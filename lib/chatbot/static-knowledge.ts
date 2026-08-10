export type StaticKnowledgeChunk = {
  title: string;
  text: string;
};

const STOP_WORDS = new Set([
  "about",
  "and",
  "are",
  "can",
  "does",
  "for",
  "from",
  "him",
  "his",
  "srijon",
  "srijons",
  "tell",
  "the",
  "what",
  "who",
  "with",
  "you",
  "your",
]);

export const STATIC_KNOWLEDGE: StaticKnowledgeChunk[] = [
  {
    title: "Identity",
    text: "Srijon Karmakar is a full-stack developer based in Kolkata, India. He builds modern web applications and digital products with a focus on scalable architecture, secure APIs, and polished user experiences.",
  },
  {
    title: "Positioning",
    text: "Srijon describes himself as an engineer by instinct and a 3D designer by hobby. His work combines technical problem-solving, product thinking, and visual creativity.",
  },
  {
    title: "Contact",
    text: "Srijon can be contacted at srijonkarmakar.dev@gmail.com. His LinkedIn profile is https://www.linkedin.com/in/srijon-karmakar/. He is based in Kolkata, India, and his CV is available at /cv/cv.pdf.",
  },
  {
    title: "Skills",
    text: "Srijon's core skills include React, Next.js, Node.js, Python, Django, backend API development, authentication, role-based access control, database integrations, dashboards, portals, and cloud-based systems.",
  },
  {
    title: "Services",
    text: "Srijon offers full-stack development, backend API and authentication work, dashboard and portal systems, and performance optimization.",
  },
  {
    title: "Education",
    text: "Srijon has a Computer Science background. His portfolio lists a B.Tech GPA of 8.6 and graduation year of 2025.",
  },
  {
    title: "Career Snapshot",
    text: "The portfolio presents Srijon as having 2 professional roles, 7+ projects in his CV, 10+ total projects, 3 games created, 3 ongoing projects, 1+ year of engineering experience, and 5 years in graphic design.",
  },
  {
    title: "Engineering Projects",
    text: "Srijon's featured engineering projects include BetterPass, ToolMitra, Senevon Studio, House of Musa, POV-Cricket Game, ArtBlock, 3D-Portfolio, and EsportM.",
  },
  {
    title: "Design Work",
    text: "Srijon has created logo design work for ArtBlock, BetterPass, Edifyeight, Matebid, FNB, EsportM, eTester, Senevon, and Yarrowtech.",
  },
];

const PUBLIC_KNOWLEDGE_FILES = [
  "/chatbot/srijon-profile.md",
  "/chatbot/srijon-chatbot-questions.md",
];

let cachedPublicKnowledge: StaticKnowledgeChunk[] | null = null;

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function parseMarkdownKnowledge(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .split(/\n(?=##\s+)/)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const heading = section.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? "Srijon";
      return {
        title: heading,
        text: section
          .replace(/^#+\s+.+$/gm, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim(),
      };
    })
    .filter((chunk) => chunk.text.length > 0);
}

export async function loadPublicKnowledge() {
  if (cachedPublicKnowledge) {
    return cachedPublicKnowledge;
  }

  if (typeof window === "undefined") {
    return STATIC_KNOWLEDGE;
  }

  try {
    const documents = await Promise.all(
      PUBLIC_KNOWLEDGE_FILES.map(async (filePath) => {
        const response = await fetch(filePath, { cache: "no-store" });

        if (!response.ok) {
          return "";
        }

        return response.text();
      })
    );

    const chunks = documents.flatMap(parseMarkdownKnowledge);
    cachedPublicKnowledge = chunks.length > 0 ? chunks : STATIC_KNOWLEDGE;
    return cachedPublicKnowledge;
  } catch {
    cachedPublicKnowledge = STATIC_KNOWLEDGE;
    return cachedPublicKnowledge;
  }
}

export async function getStaticKnowledgeContext() {
  const knowledge = await loadPublicKnowledge();

  return knowledge
    .map((chunk) => `## ${chunk.title}\n\n${chunk.text}`)
    .join("\n\n---\n\n");
}

function isGreeting(question: string) {
  return /^(hi|hii|hello|hey|yo|sup|namaste|hola|good\s+(morning|afternoon|evening))[\s!.?]*$/i.test(
    question.trim()
  );
}

export function isSrijonRelatedQuestion(question: string) {
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

export async function staticChatbotAnswer(question: string) {
  const normalized = question.toLowerCase();
  const knowledge = await loadPublicKnowledge();

  if (isGreeting(question)) {
    return "Hi. I can help you learn about Srijon's skills, projects, experience, education, services, or contact details.";
  }

  if (!isSrijonRelatedQuestion(question)) {
    return "I only answer questions about Srijon. If you want to know about him, ask me about his skills, projects, experience, education, services, or contact details.";
  }

  if (normalized.includes("contact") || normalized.includes("email") || normalized.includes("linkedin")) {
    return knowledge.find((chunk) => chunk.title === "Contact")?.text ?? "";
  }

  if (normalized.includes("location") || normalized.includes("where")) {
    return "Srijon is based in Kolkata, India.";
  }

  if (normalized.includes("skill") || normalized.includes("stack") || normalized.includes("technology")) {
    return knowledge.find((chunk) => chunk.title === "Core Skills" || chunk.title === "Skills")?.text ?? "";
  }

  if (normalized.includes("project") || normalized.includes("portfolio") || normalized.includes("built")) {
    return knowledge.find((chunk) => chunk.title === "Engineering Projects")?.text ?? "";
  }

  if (normalized.includes("education") || normalized.includes("degree") || normalized.includes("gpa") || normalized.includes("cgpa")) {
    return knowledge.find((chunk) => chunk.title === "Education")?.text ?? "";
  }

  if (normalized.includes("service") || normalized.includes("hire") || normalized.includes("do best")) {
    return knowledge.find((chunk) => chunk.title === "Services")?.text ?? "";
  }

  const queryTokens = tokenize(question);
  const bestChunk = knowledge.map((chunk, index) => {
    const chunkTokens = new Set(tokenize(`${chunk.title} ${chunk.text}`));
    const score = queryTokens.reduce(
      (total, token) => total + (chunkTokens.has(token) ? 1 : 0),
      0
    );

    return { chunk, index, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index)[0]?.chunk;

  if (!bestChunk) {
    return "I do not have that specific detail about Srijon yet.";
  }

  return bestChunk.text;
}
