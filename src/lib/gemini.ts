import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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
  summary: string;
  location: string;
  yearsExperience: number;
  skills: ExtractedSkill[];
  projects: ExtractedProject[];
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "Crisp 2-3 sentence professional summary"
    },
    location: {
      type: SchemaType.STRING,
      description: "City, country if mentioned; empty string if unknown"
    },
    yearsExperience: {
      type: SchemaType.NUMBER,
      description: "Total years of professional experience (integer)"
    },
    skills: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          proficiency: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]
          },
          yearsExperience: { type: SchemaType.NUMBER },
          isInferred: { type: SchemaType.BOOLEAN },
          inferredFrom: { type: SchemaType.STRING, nullable: true }
        },
        required: ["name", "proficiency", "yearsExperience", "isInferred"]
      }
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          technologies: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ["title", "description", "technologies"]
      }
    }
  },
  required: ["summary", "location", "yearsExperience", "skills", "projects"]
};

const SYSTEM_INSTRUCTION = `You are a senior resume parsing engine for SkillsHub, an AI-powered skills intelligence platform.

Extract structured information from the resume. Be precise, thorough, and consistent.

CRITICAL RULES:

1. SKILLS EXTRACTION
   Extract every technical skill: programming languages, frameworks, libraries, tools, platforms, databases, methodologies, cloud services, design tools.
   Ignore soft skills like "leadership", "communication", "teamwork".

2. PROFICIENCY (per skill)
   Infer from years used, project depth, role seniority:
   - BEGINNER: 0-1 years or basic mention
   - INTERMEDIATE: 1-3 years or moderate usage
   - ADVANCED: 3-5 years or led projects with it
   - EXPERT: 5+ years or principal/lead usage
   Default to INTERMEDIATE if ambiguous.

3. YEARS PER SKILL
   Estimate from context. Default to 2 if unclear.

4. SKILL INFERENCE (THE MAGIC — this is our differentiator)
   Add INFERRED skills based on explicit ones. Mark isInferred: true and inferredFrom: <source skill name>.
   Apply ALL of these inference rules where the source skill is explicit in the resume:

   - Next.js → React
   - React Native → React, JavaScript
   - Gatsby → React
   - Remix → React
   - Angular → TypeScript, JavaScript
   - Vue / Nuxt → JavaScript
   - Svelte / SvelteKit → JavaScript
   - TypeScript → JavaScript
   - Spring Boot / Spring Framework → Java
   - Django / Flask / FastAPI → Python
   - Ruby on Rails → Ruby
   - Laravel / Symfony → PHP
   - Express / Fastify / NestJS / Koa → Node.js, JavaScript
   - .NET / ASP.NET / Entity Framework → C#
   - TensorFlow / PyTorch / Keras / scikit-learn → Python, Machine Learning
   - Pandas / NumPy → Python, Data Analysis
   - Kubernetes / Helm / OpenShift → Docker
   - Terraform / Pulumi → Infrastructure as Code, DevOps
   - Tailwind CSS → CSS
   - Sass / SCSS / Less → CSS
   - GraphQL → API Design
   - REST / RESTful API → API Design
   - PostgreSQL / MySQL / SQLite / SQL Server / Oracle → SQL
   - MongoDB / DynamoDB / Cassandra → NoSQL
   - Redis / Memcached → Caching
   - Kafka / RabbitMQ / SQS → Distributed Systems, Message Queues
   - AWS Lambda / Google Cloud Functions / Azure Functions → Serverless
   - Figma / Sketch / Adobe XD → UI/UX Design
   - Photoshop / Illustrator / InDesign → Adobe Creative Suite
   - Jest / Vitest / Mocha / Cypress / Playwright → Testing
   - Git / GitHub / GitLab → Version Control

   For each inferred skill:
   - isInferred: true
   - inferredFrom: the source skill name exactly as it appears
   - proficiency: ONE LEVEL LOWER than source (BEGINNER stays BEGINNER, INTERMEDIATE→BEGINNER, ADVANCED→INTERMEDIATE, EXPERT→ADVANCED)
   - yearsExperience: same as source

   NEVER duplicate. If "React" is already explicit, do NOT infer it again from "Next.js" or any other source. Check each inferred skill against the explicit list first.

5. PROJECTS
   Extract 2-5 significant projects. Each must have:
   - title: project name
   - description: 1-2 sentence summary of what was built
   - technologies: array of tech used (e.g. ["React", "Node.js", "PostgreSQL"])
   If the resume has fewer than 2 projects, extract whatever exists.

6. SUMMARY
   Crisp 2-3 sentence professional summary based on the whole resume. Third person.

7. LOCATION
   Extract city + country/state if mentioned. Empty string if unknown.

8. YEARS EXPERIENCE (overall)
   Total professional experience in years, integer.

Return ONLY valid JSON matching the schema. No markdown fences, no commentary.`;

export async function extractProfileFromResume(resumeText: string): Promise<ExtractedProfile> {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseSchema: responseSchema as any
    }
  });

  const prompt = `RESUME TEXT:\n\n${resumeText}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as ExtractedProfile;
  } catch (err) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}
