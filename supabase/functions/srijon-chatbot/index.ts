type ChatRequest = {
  context?: string;
  question?: string;
};

type ProviderResult = {
  answer: string;
  provider: string;
};

type OpenAIChatRequest = {
  max_completion_tokens: number;
  messages: Array<{ role: "system" | "user"; content: string }>;
  model: string;
  reasoning_effort?: string;
  temperature: number;
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

const providerTimeoutMs = 12000;
const includeProviderErrors = Deno.env.get("DEBUG_PROVIDER_ERRORS") === "true";

const fallbackKnowledge = `
Srijon Karmakar is a full-stack developer based in Kolkata, India.
Srijon builds modern web applications and digital products with React, Next.js, Node.js, Python, Django, backend APIs, authentication, role-based access control, database integrations, dashboards, portals, and cloud-based systems.
Srijon can be contacted at srijonkarmakar.dev@gmail.com and on LinkedIn at https://www.linkedin.com/in/srijon-karmakar/.
Srijon's featured projects include BetterPass, ToolMitra, Senevon Studio, House of Musa, POV-Cricket Game, ArtBlock, 3D-Portfolio, and EsportM.
Srijon has a Computer Science background, a B.Tech GPA of 8.6, and a listed graduation year of 2025.
`;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json",
    },
  });
}

function withTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);

  return {
    clear: () => clearTimeout(timeout),
    signal: controller.signal,
  };
}

function isGreeting(question: string) {
  return /^(hi|hii|hello|hey|yo|sup|namaste|hola|good\s+(morning|afternoon|evening))[\s!.?]*$/i.test(
    question.trim()
  );
}

function isSrijonRelatedQuestion(question: string) {
  const normalized = question.toLowerCase();
  const outOfScopeTerms = [
    "weather",
    "news",
    "politics",
    "recipe",
    "movie",
    "sports score",
    "stock",
    "crypto",
    "homework",
  ];

  if (outOfScopeTerms.some((term) => normalized.includes(term))) {
    return false;
  }

  if (isGreeting(question)) {
    return true;
  }

  const relatedTerms = [
    "srijon",
    "karmakar",
    "you",
    "your",
    "him",
    "his",
    "about",
    "portfolio",
    "cv",
    "resume",
    "skill",
    "project",
    "work",
    "experience",
    "education",
    "degree",
    "cgpa",
    "gpa",
    "contact",
    "email",
    "linkedin",
    "location",
    "hire",
    "service",
    "developer",
    "frontend",
    "backend",
    "full-stack",
    "full stack",
    "react",
    "next",
    "node",
    "python",
    "django",
    "design",
  ];

  return relatedTerms.some((term) => normalized.includes(term));
}

function outOfScopeAnswer() {
  return "I only answer questions about Srijon. If you want to know about him, ask me about his skills, projects, experience, education, services, or contact details.";
}

function ruleBasedAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (isGreeting(question)) {
    return "Hi. I can help you learn about Srijon's skills, projects, experience, education, services, or contact details.";
  }

  if (!isSrijonRelatedQuestion(question)) {
    return outOfScopeAnswer();
  }

  if (normalized.includes("contact") || normalized.includes("email") || normalized.includes("linkedin")) {
    return "You can contact Srijon at srijonkarmakar.dev@gmail.com or through LinkedIn at https://www.linkedin.com/in/srijon-karmakar/.";
  }

  if (normalized.includes("location") || normalized.includes("where")) {
    return "Srijon is based in Kolkata, India.";
  }

  if (normalized.includes("skill") || normalized.includes("stack") || normalized.includes("technology")) {
    return "Srijon's core skills include React, Next.js, Node.js, Python, Django, backend API development, authentication, role-based access control, database integrations, dashboards, portals, and cloud-based systems.";
  }

  if (normalized.includes("project") || normalized.includes("portfolio") || normalized.includes("built")) {
    return "Srijon's featured projects include BetterPass, ToolMitra, Senevon Studio, House of Musa, POV-Cricket Game, ArtBlock, 3D-Portfolio, and EsportM.";
  }

  if (normalized.includes("education") || normalized.includes("degree") || normalized.includes("gpa") || normalized.includes("cgpa")) {
    return "Srijon has a Computer Science background. His portfolio lists a B.Tech GPA of 8.6 and graduation year of 2025.";
  }

  if (normalized.includes("service") || normalized.includes("hire") || normalized.includes("do best")) {
    return "Srijon offers full-stack development, backend API and authentication work, dashboard and portal systems, and performance optimization.";
  }

  return "I do not have that specific detail about Srijon yet. Once Srijon fills the chatbot Q&A document, I will be able to answer it better.";
}

async function checkedJson(response: Response, provider: string) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "error" in data
        ? JSON.stringify(data.error)
        : response.statusText;

    throw new Error(`${provider} failed: ${response.status} ${detail}`);
  }

  return data;
}

async function callClaude(systemPrompt: string, userPrompt: string): Promise<ProviderResult> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

  if (!apiKey) {
    throw new Error("Claude API key is missing.");
  }

  const timeout = withTimeout();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      body: JSON.stringify({
        max_tokens: 450,
        messages: [{ role: "user", content: userPrompt }],
        model: Deno.env.get("ANTHROPIC_MODEL") ?? "claude-3-5-haiku-latest",
        system: systemPrompt,
        temperature: 0.2,
      }),
      headers: {
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      method: "POST",
      signal: timeout.signal,
    });

    const data = await checkedJson(response, "Claude");
    const answer = data?.content
      ?.map((part: { text?: string }) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!answer) {
      throw new Error("Claude returned an empty answer.");
    }

    return { answer, provider: "claude" };
  } finally {
    timeout.clear();
  }
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<ProviderResult> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }

  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-5.6-sol";
  const reasoningEffort = Deno.env.get("OPENAI_REASONING_EFFORT");
  const requestBody: OpenAIChatRequest = {
    max_completion_tokens: 450,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model,
    temperature: 0.2,
  };

  if (reasoningEffort) {
    requestBody.reasoning_effort = reasoningEffort;
  } else if (model.startsWith("gpt-5.6")) {
    requestBody.reasoning_effort = "none";
  }

  const timeout = withTimeout();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      body: JSON.stringify(requestBody),
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      method: "POST",
      signal: timeout.signal,
    });

    const data = await checkedJson(response, "OpenAI");
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("OpenAI returned an empty answer.");
    }

    return { answer, provider: "openai" };
  } finally {
    timeout.clear();
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ answer: "Method not allowed.", provider: "rule-based" }, 405);
  }

  const body = await request.json().catch(() => null) as ChatRequest | null;
  const question = body?.question?.trim();

  if (!question) {
    return jsonResponse({ answer: "Ask me something about Srijon.", provider: "rule-based" }, 400);
  }

  if (!isSrijonRelatedQuestion(question)) {
    return jsonResponse({ answer: outOfScopeAnswer(), provider: "rule-based" });
  }

  const context = body?.context?.trim() || fallbackKnowledge;
  const systemPrompt = [
    "You are Srijon's portfolio chatbot.",
    "Answer only questions about Srijon Karmakar, his background, work, projects, skills, services, CV, and contact details.",
    "For greetings or small talk, briefly greet the visitor and invite them to ask about Srijon.",
    "Use only the supplied context. Do not invent missing facts.",
    "If the answer is not in the context, say that you do not have that specific detail yet.",
    "If a question is unrelated to Srijon, say that you only answer questions about Srijon.",
    "Keep answers concise, friendly, and direct. Do not include citations.",
  ].join(" ");
  const userPrompt = `Knowledge context:\n${context.slice(0, 12000)}\n\nVisitor question:\n${question}`;
  const providers = [callOpenAI, callClaude];
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const result = await provider(systemPrompt, userPrompt);
      return jsonResponse(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(message);
      console.warn(message);
    }
  }

  return jsonResponse({
    answer: ruleBasedAnswer(question),
    ...(includeProviderErrors ? { errors } : {}),
    provider: "rule-based",
  });
});
