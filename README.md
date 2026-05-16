# SkillsHub — AI-Powered Skills Intelligence Platform

> Find the right people. In plain English.

**Live Demo:** https://skillshub-git-main-prafulla-rajput-s-projects.vercel.app

**Team:** Prompt & Pixels — Prafulla Rajput

---

## What It Does

SkillsHub turns resumes into structured talent intelligence and lets HR teams search by intent, not keywords.

- **Employees** upload a PDF resume → AI extracts every skill, proficiency level, years of experience, and project history
- **HR teams** search using full natural language sentences → ranked results with match scores and plain-English reasoning

---

## The Two Hard Problems

### Hard Problem 1 — Smart Profile Ingestion
Resume PDF → unpdf text extraction → Groq Llama 3.3 70B extracts a fully structured profile with **skill inference** — if the resume mentions Next.js, React is automatically inferred; Spring Boot infers Java; TensorFlow infers Python + Machine Learning. 30+ inference rules baked into the system prompt.

### Hard Problem 2 — Semantic Natural Language Search
HR types: *"find me a senior React engineer who built real-time apps"*
System returns: ranked candidates with match score (0–100) + plain-English reasoning per result, powered by Groq Llama 3.3 70B.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma |
| Auth | NextAuth.js v4 |
| Styling | Tailwind CSS + shadcn/ui |
| AI Engine | Groq — Llama 3.3 70B |
| PDF Parsing | unpdf (Mozilla pdf.js) |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Groq](https://console.groq.com) API key (free tier, no credit card)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Prafulla-Rajput7/skillshub.git
cd skillshub

# 2. Install dependencies
npm install

# 3. Set up environment variables
```

Create a `.env` file in the project root:

```env
DATABASE_URL="your_neon_pooled_connection_string"
NEXTAUTH_SECRET="any_32_char_random_string"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="your_groq_api_key"
LLM_MODEL="llama-3.3-70b-versatile"
```

```bash
# 4. Run database migrations
npx prisma migrate deploy
npx prisma generate

# 5. Seed demo data (17 profiles across React, ML, Java, DevOps, Design, etc.)
npx prisma db seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| HR | Create via /signup (select HR) | your choice |
| Employee | rahul.sharma@skillshub.demo | demo123 |
| Employee | priya.menon@skillshub.demo | demo123 |
| Employee | marcus.lee@skillshub.demo | demo123 |

---

## Features

- Role-based auth — HR and Employee with protected routes and middleware
- PDF resume upload with AI-powered structured extraction (Groq Llama 3.3 70B)
- 30+ skill inference rules (Next.js → React, Spring Boot → Java, TensorFlow → Python + ML)
- HR review queue — approve or reject AI-extracted profiles before they go live
- Semantic natural language search with ranked results and plain-English reasoning
- Match score ring (0–100) per search result
- Talent directory with individual profile pages
- 17 seed profiles spanning React, ML, Java, React Native, DevOps, Design, Data Engineering, Python backend, Cybersecurity, iOS, QA, Game Dev, Blockchain, Salesforce, Embedded, and more
- Profile journey stepper showing employee progress from upload to live directory
- Deterministic color-coded skill chips (same skill = same color across all profiles)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                # Login + signup — split-screen layout
│   ├── (dashboard)/
│   │   ├── hr/                # Dashboard, search, review queue, talent directory
│   │   └── employee/          # Profile view + resume upload
│   └── api/
│       ├── auth/              # NextAuth + signup endpoint
│       ├── resume/            # PDF upload + Groq extraction
│       ├── review/            # Approve / reject endpoints
│       └── search/            # Semantic search with Groq ranking
├── components/                # Shared UI components (AvatarInitials, SkillBadge, etc.)
└── lib/
    ├── llm.ts                 # Groq integration — extraction + search ranking
    ├── pdf.ts                 # unpdf text extraction
    ├── auth.ts                # NextAuth config
    └── prisma.ts              # Prisma client singleton

prisma/
├── schema.prisma              # 5 models: User, Profile, Skill, Project, ReviewQueue
└── seed.ts                    # 17 realistic employee profiles
```

---

## Search Queries That Work Well

```
"senior React engineer who built real-time apps"
"Python ML expert with PyTorch and computer vision"
"Java backend with Kafka and microservices"
"designer fluent in Figma and design systems for SaaS"
"DevOps engineer with Kubernetes and Terraform on AWS"
"iOS engineer with Swift and SwiftUI"
"data engineer with Airflow and Snowflake"
```

---

## What We'd Build Next

- **Conversational search** — refine results in chat ("only show ones in Bangalore")
- **Team builder mode** — describe a project, get a proposed team with rationale
- **Skill gap analysis** — company-wide skill weak spots vs upcoming projects
- **GitHub integration** — infer active skills from recent public commits
- **Bulk import** — upload a folder of PDFs and process in batch
