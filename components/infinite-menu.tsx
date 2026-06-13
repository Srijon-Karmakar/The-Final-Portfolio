"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;

    float scale = max(imageAspect / containerAspect,
                     containerAspect / imageAspect);

    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;

    st = clamp(st, 0.0, 1.0);
    st = st * cellSize + cellOffset;

    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class Face {
  constructor(
    public a: number,
    public b: number,
    public c: number
  ) {}
}

class Vertex {
  public position: vec3;
  public normal: vec3;
  public uv: vec2;

  constructor(x: number, y: number, z: number) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  public vertices: Vertex[] = [];
  public faces: Face[] = [];

  public addVertex(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  public addFace(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  public get lastVertex() {
    return this.vertices[this.vertices.length - 1];
  }

  public subdivide(divisions = 1) {
    const midPointCache: Record<string, number> = {};
    let faces = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array<Face>(faces.length * 4);

      faces.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      faces = newFaces;
    }

    this.faces = faces;
    return this;
  }

  public spherize(radius = 1) {
    this.vertices.forEach((vertex) => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  public get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData,
    };
  }

  public get vertexData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.position)));
  }

  public get normalData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.normal)));
  }

  public get uvData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.uv)));
  }

  public get indexData() {
    return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
  }

  public getMidPoint(ndxA: number, ndxB: number, cache: Record<string, number>) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }

    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1, t, 0,
      1, t, 0,
      -1, -t, 0,
      1, -t, 0,
      0, -1, t,
      0, 1, t,
      0, -1, -t,
      0, 1, -t,
      t, 0, -1,
      t, 0, 1,
      -t, 0, -1,
      -t, 0, 1
    ).addFace(
      0, 11, 5,
      0, 5, 1,
      0, 1, 7,
      0, 7, 10,
      0, 10, 11,
      1, 5, 9,
      5, 11, 4,
      11, 10, 2,
      10, 7, 6,
      7, 1, 8,
      3, 9, 4,
      3, 4, 2,
      3, 2, 6,
      3, 6, 8,
      3, 8, 9,
      4, 9, 5,
      2, 4, 11,
      6, 2, 10,
      8, 6, 7,
      9, 8, 1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    const safeSteps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / safeSteps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;

    for (let i = 0; i < safeSteps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }

    this.addFace(0, safeSteps, 1);
  }
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: [string, string],
  attribLocations?: Record<string, number>
) {
  const program = gl.createProgram();
  if (!program) return null;

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) {
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
  });

  if (attribLocations) {
    for (const attrib in attribLocations) {
      if (Object.prototype.hasOwnProperty.call(attribLocations, attrib)) {
        gl.bindAttribLocation(program, attribLocations[attrib], attrib);
      }
    }
  }

  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: Array<[WebGLBuffer, number, number]>,
  indices?: Uint16Array
) {
  const va = gl.createVertexArray();
  if (!va) return null;

  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    if (indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const isCompact = window.matchMedia("(max-width: 900px)").matches;
  const dprCap = isCompact ? 1.1 : 1.5;
  const dpr = Math.min(dprCap, window.devicePixelRatio || 1);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function makeBuffer(
  gl: WebGL2RenderingContext,
  sizeOrData: number | ArrayBufferView,
  usage: number
) {
  const buf = gl.createBuffer();
  if (!buf) {
    throw new Error("Failed to create WebGL buffer.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  if (typeof sizeOrData === "number") {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  } else {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number
) {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error("Failed to create WebGL texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 0])
  );
  return texture;
}

type UpdateCallback = (deltaTime: number) => void;

class ArcballControl {
  public isPointerDown = false;
  public orientation = quat.create();
  public pointerRotation = quat.create();
  public rotationVelocity = 0;
  public rotationAxis = vec3.fromValues(1, 0, 0);
  public snapDirection = vec3.fromValues(0, 0, -1);
  public snapTargetDirection: vec3 | null = null;

  private pointerPos = vec2.create();
  private previousPointerPos = vec2.create();
  private smoothedRotationVelocity = 0;
  private combinedQuat = quat.create();
  private readonly epsilon = 0.1;
  private readonly identityQuat = quat.create();

  private readonly handlePointerDown = (e: PointerEvent) => {
    vec2.set(this.pointerPos, e.clientX, e.clientY);
    vec2.copy(this.previousPointerPos, this.pointerPos);
    this.isPointerDown = true;
  };

  private readonly handlePointerUp = () => {
    this.isPointerDown = false;
  };

  private readonly handlePointerMove = (e: PointerEvent) => {
    if (this.isPointerDown) {
      vec2.set(this.pointerPos, e.clientX, e.clientY);
    }
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private updateCallback: UpdateCallback = () => undefined
  ) {
    canvas.addEventListener("pointerdown", this.handlePointerDown);
    canvas.addEventListener("pointerup", this.handlePointerUp);
    canvas.addEventListener("pointerleave", this.handlePointerUp);
    canvas.addEventListener("pointermove", this.handlePointerMove);
    canvas.style.touchAction = "none";
  }

  public update(deltaTime: number, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const intensity = 0.3 * timeScale;
      const angleAmplification = 5 / timeScale;
      const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
      vec2.scale(midPointerPos, midPointerPos, intensity);

      if (vec2.sqrLen(midPointerPos) > this.epsilon) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);

        const p = this.project(midPointerPos);
        const q = this.project(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);

        vec2.copy(this.previousPointerPos, midPointerPos);
        angleFactor *= angleAmplification;

        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(this.pointerRotation, this.pointerRotation, this.identityQuat, intensity);
      }
    } else {
      const intensity = 0.1 * timeScale;
      quat.slerp(this.pointerRotation, this.pointerRotation, this.identityQuat, intensity);

      if (this.snapTargetDirection) {
        const snappingIntensity = 0.2;
        const sqrDist = vec3.squaredDistance(this.snapTargetDirection, this.snapDirection);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= snappingIntensity * distanceFactor;
        this.quatFromVectors(
          this.snapTargetDirection,
          this.snapDirection,
          snapRotation,
          angleFactor
        );
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const rotationAxisIntensity = 0.8 * timeScale;
    quat.slerp(this.combinedQuat, this.combinedQuat, combinedQuat, rotationAxisIntensity);
    quat.normalize(this.combinedQuat, this.combinedQuat);

    const rad = Math.acos(this.combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this.combinedQuat[0] / s;
      this.rotationAxis[1] = this.combinedQuat[1] / s;
      this.rotationAxis[2] = this.combinedQuat[2] / s;
    }

    const rotationVelocityIntensity = 0.5 * timeScale;
    this.smoothedRotationVelocity +=
      (rv - this.smoothedRotationVelocity) * rotationVelocityIntensity;
    this.rotationVelocity = this.smoothedRotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  public destroy() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointerleave", this.handlePointerUp);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
  }

  private quatFromVectors(a: vec3, b: vec3, out: quat, angleFactor = 1) {
    const axis = vec3.cross(vec3.create(), a, b);
    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  private project(pos: vec2) {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;

    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;

    if (xySq <= rSq / 2.0) {
      z = Math.sqrt(rSq - xySq);
    } else {
      z = rSq / Math.sqrt(xySq);
    }

    return vec3.fromValues(-x, y, z);
  }
}

export interface InfiniteMenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

type ActiveItemCallback = (index: number) => void;
type MovementChangeCallback = (isMoving: boolean) => void;
type InitCallback = (instance: InfiniteGridMenu) => void;

interface Camera {
  matrix: mat4;
  near: number;
  far: number;
  fov: number;
  aspect: number;
  position: vec3;
  up: vec3;
  matrices: {
    view: mat4;
    projection: mat4;
    inversProjection: mat4;
  };
}

interface GeometryBuffers {
  vertices: Float32Array;
  indices: Uint16Array;
  normals: Float32Array;
  uvs: Float32Array;
}

class InfiniteGridMenu {
  private gl: WebGL2RenderingContext | null = null;
  private discProgram: WebGLProgram | null = null;
  private discVAO: WebGLVertexArrayObject | null = null;
  private discBuffers!: GeometryBuffers;
  private icoGeo!: IcosahedronGeometry;
  private discGeo!: DiscGeometry;
  private worldMatrix = mat4.create();
  private tex: WebGLTexture | null = null;
  private control!: ArcballControl;
  private animationFrameId = 0;
  private destroyed = false;
  private atlasSize = 1;
  private instancePositions: vec3[] = [];
  private discInstanceCount = 0;
  private time = 0;
  private deltaTime = 0;
  private deltaFrames = 0;
  private frames = 0;
  private movementActive = false;
  private readonly targetFrameDuration = 1000 / 60;
  private readonly sphereRadius = 2;

  private discLocations!: {
    aModelPosition: number;
    aModelUvs: number;
    aInstanceMatrix: number;
    uWorldMatrix: WebGLUniformLocation | null;
    uViewMatrix: WebGLUniformLocation | null;
    uProjectionMatrix: WebGLUniformLocation | null;
    uCameraPosition: WebGLUniformLocation | null;
    uScaleFactor: WebGLUniformLocation | null;
    uRotationAxisVelocity: WebGLUniformLocation | null;
    uTex: WebGLUniformLocation | null;
    uFrames: WebGLUniformLocation | null;
    uItemCount: WebGLUniformLocation | null;
    uAtlasSize: WebGLUniformLocation | null;
  };

  private discInstances!: {
    matricesArray: Float32Array;
    matrices: Float32Array[];
    buffer: WebGLBuffer | null;
  };

  public camera: Camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3),
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create(),
    },
  };

  public smoothRotationVelocity = 0;
  public scaleFactor = 1.0;

  constructor(
    private canvas: HTMLCanvasElement,
    private items: InfiniteMenuItem[],
    private onActiveItemChange: ActiveItemCallback,
    private onMovementChange: MovementChangeCallback,
    onInit?: InitCallback,
    scale = 1.0
  ) {
    this.scaleFactor = scale;
    this.camera.position[2] = 3 * scale;
    this.init(onInit);
  }

  public resize() {
    if (!this.gl) return;
    if (resizeCanvasToDisplaySize(this.canvas)) {
      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }
    this.updateProjectionMatrix();
  }

  public run = (time = 0) => {
    if (this.destroyed) return;

    this.deltaTime = Math.min(32, time - this.time);
    this.time = time;
    this.deltaFrames = this.deltaTime / this.targetFrameDuration;
    this.frames += this.deltaFrames;

    this.animate(this.deltaTime);
    this.render();

    this.animationFrameId = window.requestAnimationFrame(this.run);
  };

  public destroy() {
    this.destroyed = true;
    window.cancelAnimationFrame(this.animationFrameId);
    this.control?.destroy();

    if (!this.gl) return;

    if (this.discProgram) {
      this.gl.deleteProgram(this.discProgram);
    }
    if (this.discVAO) {
      this.gl.deleteVertexArray(this.discVAO);
    }
    if (this.discInstances?.buffer) {
      this.gl.deleteBuffer(this.discInstances.buffer);
    }
    if (this.tex) {
      this.gl.deleteTexture(this.tex);
    }
  }

  private init(onInit?: InitCallback) {
    const isCompact = window.matchMedia("(max-width: 900px)").matches;
    const gl = this.canvas.getContext("webgl2", {
      antialias: !isCompact,
      alpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) {
      throw new Error("No WebGL 2 context!");
    }

    this.gl = gl;
    this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3,
    });
    if (!this.discProgram) {
      throw new Error("Failed to create InfiniteMenu shader program.");
    }

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, "aModelPosition"),
      aModelUvs: gl.getAttribLocation(this.discProgram, "aModelUvs"),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram, "aInstanceMatrix"),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, "uWorldMatrix"),
      uViewMatrix: gl.getUniformLocation(this.discProgram, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(this.discProgram, "uProjectionMatrix"),
      uCameraPosition: gl.getUniformLocation(this.discProgram, "uCameraPosition"),
      uScaleFactor: gl.getUniformLocation(this.discProgram, "uScaleFactor"),
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, "uRotationAxisVelocity"),
      uTex: gl.getUniformLocation(this.discProgram, "uTex"),
      uFrames: gl.getUniformLocation(this.discProgram, "uFrames"),
      uItemCount: gl.getUniformLocation(this.discProgram, "uItemCount"),
      uAtlasSize: gl.getUniformLocation(this.discProgram, "uAtlasSize"),
    };

    this.discGeo = new DiscGeometry(isCompact ? 28 : 40, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs, 2],
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(isCompact ? 0 : 1).spherize(this.sphereRadius);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.discInstanceCount = this.icoGeo.vertices.length;
    this.initDiscInstances(this.discInstanceCount);
    this.initTexture();
    this.control = new ArcballControl(this.canvas, (deltaTime) => this.onControlUpdate(deltaTime));

    this.updateCameraMatrix();
    this.updateProjectionMatrix();
    this.resize();

    if (onInit) {
      onInit(this);
    }
  }

  private initTexture() {
    if (!this.gl) return;
    const gl = this.gl;
    this.tex = createAndSetupTexture(gl, gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const isCompact = window.matchMedia("(max-width: 900px)").matches;
    const desiredCellSize = isCompact ? 640 : window.innerWidth <= 1200 ? 768 : 1024;
    const cellSize = Math.max(512, Math.min(desiredCellSize, Math.floor(maxTextureSize / this.atlasSize)));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    void Promise.all(
      this.items.map(
        (item) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load ${item.image}`));
            img.src = item.image;
          })
      )
    )
      .then((images) => {
        images.forEach((img, i) => {
          const x = (i % this.atlasSize) * cellSize;
          const y = Math.floor(i / this.atlasSize) * cellSize;
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.generateMipmap(gl.TEXTURE_2D);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private initDiscInstances(count: number) {
    if (!this.gl || !this.discVAO) return;
    const gl = this.gl;

    const matricesArray = new Float32Array(count * 16);
    const matrices: Float32Array[] = [];
    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(matricesArray.buffer, i * 16 * 4, 16);
      mat4.identity(instanceMatrixArray as unknown as mat4);
      matrices.push(instanceMatrixArray);
    }

    this.discInstances = {
      matricesArray,
      matrices,
      buffer: gl.createBuffer(),
    };

    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);

    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  private animate(deltaTime: number) {
    if (!this.gl) return;
    this.control.update(deltaTime, this.targetFrameDuration);

    const positions = this.instancePositions.map((p) =>
      vec3.transformQuat(vec3.create(), p, this.control.orientation)
    );
    const scale = 0.25;
    const scaleIntensity = 0.6;

    positions.forEach((p, ndx) => {
      const s = (Math.abs(p[2]) / this.sphereRadius) * scaleIntensity + (1 - scaleIntensity);
      const finalScale = s * scale;
      const matrix = mat4.create();

      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
      mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
      mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.sphereRadius]));

      mat4.copy(this.discInstances.matrices[ndx] as unknown as mat4, matrix);
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discInstances.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  private render() {
    if (!this.gl || !this.discProgram || !this.discVAO) return;
    const gl = this.gl;

    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection);
    gl.uniform3f(
      this.discLocations.uCameraPosition,
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );
    gl.uniform1i(this.discLocations.uItemCount, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);
    if (this.discLocations.uFrames) {
      gl.uniform1f(this.discLocations.uFrames, this.frames);
    }
    if (this.discLocations.uScaleFactor) {
      gl.uniform1f(this.discLocations.uScaleFactor, this.scaleFactor);
    }

    gl.uniform1i(this.discLocations.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.discInstanceCount
    );
    gl.bindVertexArray(null);
  }

  private updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  private updateProjectionMatrix() {
    if (!this.gl) return;
    const canvasEl = this.gl.canvas as HTMLCanvasElement;
    this.camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    const height = this.sphereRadius * 0.35;
    const distance = this.camera.position[2];

    if (this.camera.aspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov = 2 * Math.atan(height / this.camera.aspect / distance);
    }

    mat4.perspective(
      this.camera.matrices.projection,
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  private onControlUpdate(deltaTime: number) {
    const timeScale = deltaTime / this.targetFrameDuration + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;

    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;
    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = vec3.normalize(vec3.create(), this.getVertexWorldPosition(nearestVertexIndex));
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
      this.control.snapTargetDirection = null;
    }

    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.updateCameraMatrix();
  }

  private findNearestVertexIndex() {
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), this.control.snapDirection, inversOrientation);

    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }

    return nearestVertexIndex;
  }

  private getVertexWorldPosition(index: number) {
    return vec3.transformQuat(vec3.create(), this.instancePositions[index], this.control.orientation);
  }
}

const defaultItems: InfiniteMenuItem[] = [
  {
    image: "https://picsum.photos/900/900?grayscale",
    link: "https://google.com/",
    title: "",
    description: "",
  },
];

interface InfiniteMenuProps {
  items?: InfiniteMenuItem[];
  scale?: number;
}

export function InfiniteMenu({ items = [], scale = 1.0 }: InfiniteMenuProps) {
  const menuItems = items.length ? items : defaultItems;
  const canvasRef = useRef<HTMLCanvasElement | null>(null) as MutableRefObject<HTMLCanvasElement | null>;
  const [activeItem, setActiveItem] = useState<InfiniteMenuItem | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateLayoutMode = () => {
      setIsCompactLayout(mediaQuery.matches);
    };

    updateLayoutMode();
    mediaQuery.addEventListener("change", updateLayoutMode);

    return () => {
      mediaQuery.removeEventListener("change", updateLayoutMode);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    let sketch: InfiniteGridMenu | null = null;

    const handleActiveItem = (index: number) => {
      const itemIndex = index % menuItems.length;
      setActiveItem(menuItems[itemIndex]);
    };

    if (canvas) {
      sketch = new InfiniteGridMenu(
        canvas,
        menuItems,
        handleActiveItem,
        setIsMoving,
        (instance) => instance.run(),
        isCompactLayout ? 0.9 : scale
      );
    }

    const handleResize = () => {
      sketch?.resize();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sketch?.destroy();
    };
  }, [isCompactLayout, menuItems, scale]);

  const handleButtonClick = () => {
    if (!activeItem?.link) return;
    if (activeItem.link.startsWith("http")) {
      window.open(activeItem.link, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = activeItem.link;
    }
  };

  return (
    <div className="infinite-menu">
      <canvas
        id="infinite-grid-menu-canvas"
        ref={canvasRef}
        className="infinite-menu__canvas"
      />

      {activeItem ? (
        <>
          <h2
            className={`infinite-menu__title ${isMoving ? "is-hidden" : "is-visible"}`}
          >
            {activeItem.title}
          </h2>

          <p
            className={`infinite-menu__description ${isMoving ? "is-hidden" : "is-visible"}`}
          >
            {activeItem.description}
          </p>

          <button
            type="button"
            onClick={handleButtonClick}
            className={`infinite-menu__cta ${isMoving ? "is-hidden" : "is-visible"}`}
            aria-label={activeItem.link ? `Open ${activeItem.title}` : "Open item"}
          >
            <span className="infinite-menu__cta-icon">&#8599;</span>
          </button>
        </>
      ) : null}
    </div>
  );
}
