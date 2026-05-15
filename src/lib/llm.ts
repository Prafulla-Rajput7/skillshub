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
