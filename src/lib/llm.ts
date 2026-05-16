import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error("GROQ_API_KEY is not set");
}

const groq = new Groq({ apiKey });
const MODEL_NAME = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

export type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface ExtractedSkill {
  name: string;
  proficiency: Proficiency;
  yearsExperience: number;
  isInferred: boolean;
  inferredFrom: string | null;
}

export interface ExtractedProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface ExtractedProfile {
  name: string;
  summary: string;
  location: string;
  yearsExperience: number;
  skills: ExtractedSkill[];
  projects: ExtractedProject[];
}

const SYSTEM_INSTRUCTION = `You are a senior resume parsing engine for SkillsHub, an AI-powered skills intelligence platform.

Extract structured information from the resume. Return ONLY valid JSON, no markdown fences, no commentary.

The JSON must match this exact schema:
{
  "name": "string - the candidate's full name from the resume header",
  "summary": "string - 2-3 sentence professional summary, third person",
  "location": "string - city + country/state, or empty string if unknown",
  "yearsExperience": "number - total years of professional experience, integer",
  "skills": [
    {
      "name": "string - skill name",
      "proficiency": "BEGINNER | INTERMEDIATE | ADVANCED | EXPERT",
      "yearsExperience": "number - estimated years using this skill",
      "isInferred": "boolean - true if inferred from another skill",
      "inferredFrom": "string or null - source skill name if isInferred is true"
    }
  ],
  "projects": [
    {
      "title": "string - project name",
      "description": "string - 1-2 sentence summary",
      "technologies": ["string array - tech used"]
    }
  ]
}

CRITICAL RULES:

1. SKILLS EXTRACTION
   Extract every technical skill: programming languages, frameworks, libraries, tools, platforms, databases, methodologies, cloud services, design tools.
   Ignore soft skills like "leadership", "communication", "teamwork".

2. PROFICIENCY
   Infer from years used and depth:
   - BEGINNER: 0-1 years or basic mention
   - INTERMEDIATE: 1-3 years or moderate usage
   - ADVANCED: 3-5 years or led projects with it
   - EXPERT: 5+ years or principal/lead usage
   Default to INTERMEDIATE if ambiguous.

3. SKILL INFERENCE (THE MAGIC — this is our differentiator)
   Add INFERRED skills based on explicit ones. Mark isInferred: true and inferredFrom: <source skill name>.
   Apply ALL of these inference rules where the source skill is explicit in the resume:

   - Next.js -> React
   - React Native -> React, JavaScript
   - Gatsby / Remix -> React
   - Angular -> TypeScript, JavaScript
   - Vue / Nuxt -> JavaScript
   - Svelte / SvelteKit -> JavaScript
   - TypeScript -> JavaScript
   - Spring Boot / Spring Framework -> Java
   - Django / Flask / FastAPI -> Python
   - Ruby on Rails -> Ruby
   - Laravel / Symfony -> PHP
   - Express / Fastify / NestJS / Koa -> Node.js, JavaScript
   - .NET / ASP.NET / Entity Framework -> C#
   - TensorFlow / PyTorch / Keras / scikit-learn -> Python, Machine Learning
   - Pandas / NumPy -> Python, Data Analysis
   - Kubernetes / Helm / OpenShift -> Docker
   - Terraform / Pulumi -> Infrastructure as Code, DevOps
   - Tailwind CSS / Sass / SCSS / Less -> CSS
   - GraphQL / REST -> API Design
   - PostgreSQL / MySQL / SQLite / SQL Server / Oracle -> SQL
   - MongoDB / DynamoDB / Cassandra -> NoSQL
   - Redis / Memcached -> Caching
   - Kafka / RabbitMQ / SQS -> Distributed Systems, Message Queues
   - AWS Lambda / Cloud Functions -> Serverless
   - Figma / Sketch / Adobe XD -> UI/UX Design
   - Photoshop / Illustrator / InDesign -> Adobe Creative Suite
   - Jest / Vitest / Cypress / Playwright -> Testing
   - Git / GitHub / GitLab -> Version Control

   For each inferred skill:
   - isInferred: true
   - inferredFrom: source skill name
   - proficiency: ONE LEVEL LOWER than source (EXPERT->ADVANCED, ADVANCED->INTERMEDIATE, INTERMEDIATE->BEGINNER, BEGINNER stays BEGINNER)
   - yearsExperience: same as source

   NEVER duplicate. If a skill is already explicit, do NOT also infer it.

4. PROJECTS
   Extract 2-5 significant projects. Title, 1-2 sentence description, array of technologies.

5. SUMMARY
   2-3 sentence professional summary, third person.

6. LOCATION
   City + country/state if mentioned, else empty string.

7. YEARS EXPERIENCE (overall)
   Total professional experience in years, integer.

8. NAME
   Extract the candidate's full name as it appears in the resume header. Trim whitespace. If no name is found, use "Unknown".

Return ONLY the JSON object. No prose, no fences.`;

export async function extractProfileFromResume(resumeText: string): Promise<ExtractedProfile> {
  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: `RESUME TEXT:\n\n${resumeText}` }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 4096
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("LLM returned empty response");
  }

  try {
    return JSON.parse(content) as ExtractedProfile;
  } catch (err) {
    console.error("Failed to parse LLM response:", content);
    throw new Error("LLM returned invalid JSON");
  }
}

// ===== Semantic Search =====

export interface SearchResult {
  profileId: string;
  matchScore: number;
  reasoning: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

interface ProfileForSearch {
  id: string;
  name: string;
  summary: string | null;
  location: string | null;
  yearsExperience: number | null;
  skills: { name: string; proficiency: string; yearsExperience: number | null; isInferred: boolean }[];
  projects: { title: string; description: string; technologies: string[] }[];
}

const SEARCH_SYSTEM_INSTRUCTION = `You are a senior talent search engine for SkillsHub.

You will be given:
1. A natural language query from an HR user
2. A list of candidate profiles with their skills and projects

Your job is to find profiles that match the query and return them ranked by relevance.

RULES:

1. Return JSON object: { "results": [ { "profileId": string, "matchScore": number, "reasoning": string }, ... ] }

2. matchScore is 0-100. Reserve 90+ for near-perfect matches, 70-89 for strong matches, 50-69 for partial matches, 30-49 for weak matches. Anything below 30 should be omitted.

3. Only include profiles with matchScore >= 30. Maximum 10 results, sorted descending by matchScore.

4. reasoning is 1-2 sentences, plain English. Reference SPECIFIC skills, years of experience, or projects that justify the match. Examples:
   - "Expert in React (5 yrs), led 2 real-time apps using Socket.IO and WebSockets."
   - "Strong Python/ML background with PyTorch and TensorFlow, 4 yrs on production ML pipelines."

5. profileId must be the EXACT id string from the input — do not invent or modify.

6. Treat inferred skills as valid matches but with slightly lower weight than explicit skills.

7. If the query is vague or no profiles match well, return { "results": [] } — never fabricate matches.

8. Return ONLY valid JSON, no markdown fences, no preamble.`;

function formatProfilesForLLM(profiles: ProfileForSearch[]): string {
  return profiles
    .map((p, i) => {
      const skillsStr = p.skills
        .map((s) => `${s.name} (${s.proficiency}${s.yearsExperience ? `, ${s.yearsExperience}y` : ""}${s.isInferred ? ", inferred" : ""})`)
        .join("; ");
      const projectsStr = p.projects
        .map((proj) => `"${proj.title}" — ${proj.description} [${proj.technologies.join(", ")}]`)
        .join(" | ");
      return `--- Profile ${i + 1} ---
id: ${p.id}
name: ${p.name}
location: ${p.location || "Unknown"}
yearsExperience: ${p.yearsExperience ?? "Unknown"}
summary: ${p.summary || "(no summary)"}
skills: ${skillsStr}
projects: ${projectsStr || "(none)"}`;
    })
    .join("\n\n");
}

export async function rankProfiles(query: string, profiles: ProfileForSearch[]): Promise<SearchResponse> {
  if (profiles.length === 0) return { results: [] };

  const profilesBlock = formatProfilesForLLM(profiles);
  const userMessage = `QUERY: ${query}\n\nCANDIDATE PROFILES:\n\n${profilesBlock}`;

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: SEARCH_SYSTEM_INSTRUCTION },
      { role: "user", content: userMessage }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 2048
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return { results: [] };

  try {
    const parsed = JSON.parse(content) as SearchResponse;
    return { results: Array.isArray(parsed.results) ? parsed.results : [] };
  } catch (err) {
    console.error("Failed to parse search response:", content);
    return { results: [] };
  }
}
