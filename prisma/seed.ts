import { PrismaClient, Proficiency } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedSkill {
  name: string;
  proficiency: Proficiency;
  yearsExperience: number;
  isInferred: boolean;
  inferredFrom?: string;
}

interface SeedProfile {
  email: string;
  password: string;
  accountName: string;
  candidateName: string;
  summary: string;
  location: string;
  yearsExperience: number;
  skills: SeedSkill[];
  projects: { title: string; description: string; technologies: string[] }[];
}

const SEEDS: SeedProfile[] = [
  {
    email: "rahul.sharma@skillshub.demo",
    password: "demo123",
    accountName: "Rahul Sharma",
    candidateName: "Rahul Sharma",
    summary:
      "Rahul is a senior full-stack engineer with 6 years of experience building real-time collaborative applications. He has led teams on production deployments using Next.js and Node.js, and specializes in WebSocket-driven architectures handling thousands of concurrent users.",
    location: "Bangalore, India",
    yearsExperience: 6,
    skills: [
      { name: "React", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Next.js", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "TypeScript", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Node.js", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Socket.IO", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "PostgreSQL", proficiency: "INTERMEDIATE", yearsExperience: 4, isInferred: false },
      { name: "Redis", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "AWS", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "JavaScript", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "TypeScript" },
      { name: "SQL", proficiency: "INTERMEDIATE", yearsExperience: 4, isInferred: true, inferredFrom: "PostgreSQL" },
      { name: "Caching", proficiency: "BEGINNER", yearsExperience: 3, isInferred: true, inferredFrom: "Redis" }
    ],
    projects: [
      {
        title: "CollabBoard — Real-time Whiteboard",
        description:
          "Built a multiplayer whiteboard supporting 200+ concurrent users with sub-50ms latency. Implemented operational transforms and conflict-free state sync over WebSockets.",
        technologies: ["Next.js", "Socket.IO", "Redis", "PostgreSQL"]
      },
      {
        title: "LiveChat Enterprise",
        description:
          "Led architecture for a real-time customer support chat platform serving 1M+ messages/day. Reduced p99 latency from 800ms to 120ms.",
        technologies: ["Node.js", "Socket.IO", "Redis", "AWS"]
      }
    ]
  },
  {
    email: "priya.menon@skillshub.demo",
    password: "demo123",
    accountName: "Priya Menon",
    candidateName: "Priya Menon",
    summary:
      "Priya is a machine learning engineer with 5 years of experience deploying production ML pipelines. She has built recommendation systems serving millions of users and specializes in NLP and computer vision using PyTorch and TensorFlow.",
    location: "Hyderabad, India",
    yearsExperience: 5,
    skills: [
      { name: "Python", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "PyTorch", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "TensorFlow", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "scikit-learn", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Pandas", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "NumPy", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "FastAPI", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "Docker", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Machine Learning", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "PyTorch" },
      { name: "Data Analysis", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "Pandas" }
    ],
    projects: [
      {
        title: "Recommendation Engine v2",
        description:
          "Designed and shipped a transformer-based recommendation engine increasing CTR by 23% across 12M monthly users.",
        technologies: ["PyTorch", "Python", "FastAPI", "Docker"]
      },
      {
        title: "Vision-Based Quality Inspection",
        description:
          "Built a CNN-based defect detection system for a manufacturing client, achieving 97.4% accuracy on production line images.",
        technologies: ["TensorFlow", "Python", "OpenCV"]
      }
    ]
  },
  {
    email: "marcus.lee@skillshub.demo",
    password: "demo123",
    accountName: "Marcus Lee",
    candidateName: "Marcus Lee",
    summary:
      "Marcus is a senior Java backend engineer with 8 years building high-scale microservices for fintech. He has deep expertise in Spring Boot, distributed systems, and event-driven architectures using Kafka.",
    location: "Singapore",
    yearsExperience: 8,
    skills: [
      { name: "Java", proficiency: "EXPERT", yearsExperience: 8, isInferred: false },
      { name: "Spring Boot", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Kafka", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "PostgreSQL", proficiency: "ADVANCED", yearsExperience: 6, isInferred: false },
      { name: "Kubernetes", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Docker", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "AWS", proficiency: "INTERMEDIATE", yearsExperience: 4, isInferred: false },
      { name: "Distributed Systems", proficiency: "INTERMEDIATE", yearsExperience: 5, isInferred: true, inferredFrom: "Kafka" },
      { name: "Message Queues", proficiency: "INTERMEDIATE", yearsExperience: 5, isInferred: true, inferredFrom: "Kafka" },
      { name: "SQL", proficiency: "INTERMEDIATE", yearsExperience: 6, isInferred: true, inferredFrom: "PostgreSQL" }
    ],
    projects: [
      {
        title: "Payment Settlement Engine",
        description:
          "Architected an event-sourced payment settlement system processing 2M+ transactions/day with 99.99% reliability.",
        technologies: ["Java", "Spring Boot", "Kafka", "PostgreSQL"]
      },
      {
        title: "Fraud Detection Microservice",
        description:
          "Built real-time fraud-scoring pipeline integrated with 14 downstream consumer services via Kafka topics.",
        technologies: ["Java", "Spring Boot", "Kafka"]
      }
    ]
  },
  {
    email: "ananya.iyer@skillshub.demo",
    password: "demo123",
    accountName: "Ananya Iyer",
    candidateName: "Ananya Iyer",
    summary:
      "Ananya is a mobile-first frontend engineer specializing in React Native, with 4 years shipping cross-platform consumer apps. She has deep TypeScript experience and a strong eye for performance.",
    location: "Mumbai, India",
    yearsExperience: 4,
    skills: [
      { name: "React Native", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "TypeScript", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Redux", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "iOS Development", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "Android Development", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "Jest", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "React", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "React Native" },
      { name: "JavaScript", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "React Native" },
      { name: "Testing", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: true, inferredFrom: "Jest" }
    ],
    projects: [
      {
        title: "GroFresh Mobile App",
        description:
          "Lead engineer for a grocery delivery app with 800k+ MAU. Reduced cold-start time by 60% through aggressive code splitting.",
        technologies: ["React Native", "TypeScript", "Redux"]
      },
      {
        title: "BookSwap",
        description: "Cross-platform book exchange app with real-time messaging and location-based matching.",
        technologies: ["React Native", "TypeScript", "Firebase"]
      }
    ]
  },
  {
    email: "daniel.okafor@skillshub.demo",
    password: "demo123",
    accountName: "Daniel Okafor",
    candidateName: "Daniel Okafor",
    summary:
      "Daniel is a DevOps engineer with 7 years building cloud-native infrastructure on AWS and GCP. He has automated deployments for fast-moving startups and led Kubernetes migrations at scale.",
    location: "Lagos, Nigeria",
    yearsExperience: 7,
    skills: [
      { name: "Kubernetes", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "Terraform", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "AWS", proficiency: "EXPERT", yearsExperience: 7, isInferred: false },
      { name: "GCP", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Docker", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Helm", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "GitHub Actions", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Python", proficiency: "INTERMEDIATE", yearsExperience: 5, isInferred: false },
      { name: "Infrastructure as Code", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "Terraform" },
      { name: "DevOps", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "Terraform" }
    ],
    projects: [
      {
        title: "Multi-Region Kubernetes Migration",
        description:
          "Led migration of 30+ microservices from VMs to EKS across 3 regions, cutting infra costs by 38% and deploy times by 70%.",
        technologies: ["Kubernetes", "Terraform", "AWS", "Helm"]
      },
      {
        title: "GitOps Pipeline",
        description:
          "Built a fully automated GitOps deployment pipeline with progressive delivery and automated rollbacks.",
        technologies: ["GitHub Actions", "Kubernetes", "ArgoCD"]
      }
    ]
  },
  {
    email: "sophie.chen@skillshub.demo",
    password: "demo123",
    accountName: "Sophie Chen",
    candidateName: "Sophie Chen",
    summary:
      "Sophie is a product designer with 6 years building user-centric SaaS experiences. She specializes in design systems, prototyping in Figma, and conducting end-to-end user research.",
    location: "Toronto, Canada",
    yearsExperience: 6,
    skills: [
      { name: "Figma", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "Design Systems", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "Prototyping", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "UX Research", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Sketch", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Framer", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Notion", proficiency: "INTERMEDIATE", yearsExperience: 4, isInferred: false },
      { name: "UI/UX Design", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "Figma" }
    ],
    projects: [
      {
        title: "Enterprise SaaS Redesign",
        description:
          "Led the redesign of a B2B analytics platform serving 50k users. Improved task completion rate by 41% after iterative usability testing.",
        technologies: ["Figma", "Design Systems"]
      },
      {
        title: "Mobile Banking App",
        description: "Designed the end-to-end mobile experience for a neobank including onboarding, transactions, and budgeting.",
        technologies: ["Figma", "Prototyping", "UX Research"]
      }
    ]
  },
  {
    email: "vikram.patel@skillshub.demo",
    password: "demo123",
    accountName: "Vikram Patel",
    candidateName: "Vikram Patel",
    summary:
      "Vikram is a data engineer with 5 years building large-scale data pipelines and analytics platforms. He has deep experience with Python, Airflow, and modern data warehouses.",
    location: "Pune, India",
    yearsExperience: 5,
    skills: [
      { name: "Python", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "Apache Airflow", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Spark", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Snowflake", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "dbt", proficiency: "ADVANCED", yearsExperience: 2, isInferred: false },
      { name: "PostgreSQL", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Pandas", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "AWS", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Data Analysis", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "Pandas" },
      { name: "SQL", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "PostgreSQL" }
    ],
    projects: [
      {
        title: "Customer 360 Data Platform",
        description:
          "Built unified data platform consolidating 12 source systems into a single customer view, processing 80GB/day.",
        technologies: ["Python", "Airflow", "Snowflake", "dbt"]
      },
      {
        title: "Real-time Analytics Pipeline",
        description: "Streaming analytics pipeline ingesting 50k events/sec for product telemetry dashboards.",
        technologies: ["Spark", "Python", "AWS"]
      }
    ]
  },
  {
    email: "elena.rossi@skillshub.demo",
    password: "demo123",
    accountName: "Elena Rossi",
    candidateName: "Elena Rossi",
    summary:
      "Elena is a Python backend engineer with 4 years building Django and FastAPI services for e-commerce. She has hands-on experience with payment integrations and high-traffic APIs.",
    location: "Milan, Italy",
    yearsExperience: 4,
    skills: [
      { name: "Python", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "Django", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "FastAPI", proficiency: "ADVANCED", yearsExperience: 2, isInferred: false },
      { name: "PostgreSQL", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Redis", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Celery", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Stripe API", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Docker", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "REST API", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "API Design", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "REST API" },
      { name: "SQL", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "PostgreSQL" }
    ],
    projects: [
      {
        title: "Multi-tenant E-commerce Backend",
        description:
          "Built core backend for a fashion marketplace with 200+ tenants and 4M+ products. Handled Black Friday peak of 1500 RPS.",
        technologies: ["Django", "PostgreSQL", "Redis", "Stripe API"]
      },
      {
        title: "Subscription Billing Service",
        description: "Designed and shipped a metered billing service with dunning logic and proration.",
        technologies: ["FastAPI", "Stripe API", "Celery"]
      }
    ]
  },
  {
    email: "aisha.khan@skillshub.demo",
    password: "demo123",
    accountName: "Aisha Khan",
    candidateName: "Aisha Khan",
    summary:
      "Aisha is a cybersecurity engineer with 5 years of experience in penetration testing and threat modeling. She has led red team exercises for fintech clients and specializes in cloud security on AWS.",
    location: "Bangalore, India",
    yearsExperience: 5,
    skills: [
      { name: "Penetration Testing", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "Python", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Burp Suite", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "OWASP", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Wireshark", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "AWS Security", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "SIEM", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Threat Modeling", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Cybersecurity", proficiency: "EXPERT", yearsExperience: 5, isInferred: true, inferredFrom: "Penetration Testing" }
    ],
    projects: [
      { title: "Fintech Red Team Engagement", description: "Led a 6-week red team exercise for a tier-1 bank, identifying 23 critical vulnerabilities across web and mobile.", technologies: ["Burp Suite", "Python", "OWASP"] },
      { title: "Cloud Security Audit Framework", description: "Built an automated AWS security posture audit tool covering CIS benchmarks and compliance scoring.", technologies: ["Python", "AWS Security"] }
    ]
  },
  {
    email: "tomas.garcia@skillshub.demo",
    password: "demo123",
    accountName: "Tomás García",
    candidateName: "Tomás García",
    summary:
      "Tomás is an iOS engineer with 4 years building consumer apps in Swift and SwiftUI. He has shipped to the App Store at scale and is fluent in modern reactive patterns with Combine.",
    location: "Madrid, Spain",
    yearsExperience: 4,
    skills: [
      { name: "Swift", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "SwiftUI", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "UIKit", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Combine", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Core Data", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Xcode", proficiency: "EXPERT", yearsExperience: 4, isInferred: false },
      { name: "Objective-C", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "iOS Development", proficiency: "ADVANCED", yearsExperience: 4, isInferred: true, inferredFrom: "Swift" }
    ],
    projects: [
      { title: "Travel Companion App", description: "Designed and shipped a travel itinerary app with offline maps and trip sharing, 4.7 stars on App Store.", technologies: ["Swift", "SwiftUI", "Core Data"] },
      { title: "Banking SDK Migration", description: "Migrated a banking SDK from Objective-C to Swift, reducing crash rate by 60% and binary size by 35%.", technologies: ["Swift", "Objective-C"] }
    ]
  },
  {
    email: "yui.tanaka@skillshub.demo",
    password: "demo123",
    accountName: "Yui Tanaka",
    candidateName: "Yui Tanaka",
    summary:
      "Yui is a QA automation engineer with 5 years building end-to-end test infrastructure. She has set up Playwright and Cypress suites running in CI for enterprise SaaS products.",
    location: "Tokyo, Japan",
    yearsExperience: 5,
    skills: [
      { name: "Playwright", proficiency: "EXPERT", yearsExperience: 3, isInferred: false },
      { name: "Cypress", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Selenium", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "TypeScript", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Java", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "TestNG", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Postman", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "JMeter", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Testing", proficiency: "EXPERT", yearsExperience: 5, isInferred: true, inferredFrom: "Playwright" },
      { name: "JavaScript", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: true, inferredFrom: "TypeScript" }
    ],
    projects: [
      { title: "E2E Test Platform", description: "Built shared Playwright testing platform used by 12 product teams, cutting flaky test rate by 70%.", technologies: ["Playwright", "TypeScript"] },
      { title: "Load Testing Suite", description: "Designed JMeter-based load suite simulating 10k concurrent users for checkout flows.", technologies: ["JMeter", "Java"] }
    ]
  },
  {
    email: "liam.obrien@skillshub.demo",
    password: "demo123",
    accountName: "Liam O'Brien",
    candidateName: "Liam O'Brien",
    summary:
      "Liam is a game developer with 6 years shipping titles in Unity. He specializes in multiplayer netcode and shader work, with two indie titles published on Steam.",
    location: "Dublin, Ireland",
    yearsExperience: 6,
    skills: [
      { name: "Unity", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "C#", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Unreal Engine", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "C++", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Photon", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Shader Graph", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Blender", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Game Design", proficiency: "ADVANCED", yearsExperience: 6, isInferred: false }
    ],
    projects: [
      { title: "Skybreakers Multiplayer", description: "Lead engineer on a 4v4 arena shooter with rollback netcode, peaking at 12k concurrent players.", technologies: ["Unity", "C#", "Photon"] },
      { title: "Procedural World Generator", description: "Built a tile-based world generator with custom shaders for an open-world prototype.", technologies: ["Unity", "Shader Graph", "C#"] }
    ]
  },
  {
    email: "maya.singh@skillshub.demo",
    password: "demo123",
    accountName: "Maya Singh",
    candidateName: "Maya Singh",
    summary:
      "Maya is a blockchain engineer with 3 years writing Solidity smart contracts. She has audited DeFi protocols and built production dApps on Ethereum and L2s.",
    location: "Delhi, India",
    yearsExperience: 3,
    skills: [
      { name: "Solidity", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Hardhat", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Foundry", proficiency: "ADVANCED", yearsExperience: 2, isInferred: false },
      { name: "Ethers.js", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Web3.js", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "Smart Contracts", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "TypeScript", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: false },
      { name: "Next.js", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "JavaScript", proficiency: "INTERMEDIATE", yearsExperience: 3, isInferred: true, inferredFrom: "TypeScript" },
      { name: "React", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: true, inferredFrom: "Next.js" }
    ],
    projects: [
      { title: "DeFi Lending Protocol", description: "Built and audited a peer-to-peer lending protocol with $4M+ TVL across two L2 networks.", technologies: ["Solidity", "Hardhat", "Ethers.js"] },
      { title: "NFT Marketplace dApp", description: "Full-stack dApp for minting and trading NFTs with gas-optimized contracts and a Next.js frontend.", technologies: ["Solidity", "Next.js", "TypeScript"] }
    ]
  },
  {
    email: "carlos.mendes@skillshub.demo",
    password: "demo123",
    accountName: "Carlos Mendes",
    candidateName: "Carlos Mendes",
    summary:
      "Carlos is a Salesforce developer with 7 years architecting CRM solutions for enterprise clients. He has deep Apex/Lightning experience and three Salesforce certifications.",
    location: "São Paulo, Brazil",
    yearsExperience: 7,
    skills: [
      { name: "Salesforce", proficiency: "EXPERT", yearsExperience: 7, isInferred: false },
      { name: "Apex", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Lightning Web Components", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "SOQL", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Visualforce", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Salesforce Admin", proficiency: "EXPERT", yearsExperience: 7, isInferred: false },
      { name: "REST API", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Process Builder", proficiency: "ADVANCED", yearsExperience: 6, isInferred: false },
      { name: "API Design", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "REST API" }
    ],
    projects: [
      { title: "Enterprise CRM Rollout", description: "Led the Salesforce implementation for a 2,000-seat enterprise rollout including 14 custom apps.", technologies: ["Salesforce", "Apex", "Lightning Web Components"] },
      { title: "Sales Automation Engine", description: "Built a quote-to-cash automation reducing manual processing time by 80%.", technologies: ["Apex", "Salesforce", "Process Builder"] }
    ]
  },
  {
    email: "hina.yamamoto@skillshub.demo",
    password: "demo123",
    accountName: "Hina Yamamoto",
    candidateName: "Hina Yamamoto",
    summary:
      "Hina is a senior embedded systems engineer with 8 years building firmware for IoT and industrial devices. She has shipped products on STM32 and ARM Cortex platforms.",
    location: "Osaka, Japan",
    yearsExperience: 8,
    skills: [
      { name: "C", proficiency: "EXPERT", yearsExperience: 8, isInferred: false },
      { name: "C++", proficiency: "ADVANCED", yearsExperience: 6, isInferred: false },
      { name: "RTOS", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "FreeRTOS", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "ARM Cortex", proficiency: "ADVANCED", yearsExperience: 7, isInferred: false },
      { name: "STM32", proficiency: "EXPERT", yearsExperience: 6, isInferred: false },
      { name: "Embedded Linux", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "MQTT", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "IoT", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false }
    ],
    projects: [
      { title: "Industrial Sensor Firmware", description: "Designed firmware for a temperature/vibration sensor array deployed across 80+ factory floors.", technologies: ["C", "FreeRTOS", "STM32"] },
      { title: "Smart Meter Platform", description: "Led firmware for an LoRaWAN smart meter shipped to 50k+ residential units.", technologies: ["C", "ARM Cortex", "MQTT"] }
    ]
  },
  {
    email: "olu.adebayo@skillshub.demo",
    password: "demo123",
    accountName: "Olu Adebayo",
    candidateName: "Olu Adebayo",
    summary:
      "Olu is a developer-experience technical writer with 5 years authoring API docs and tutorials. He has shipped documentation portals for two open-source SDKs and a developer platform.",
    location: "Nairobi, Kenya",
    yearsExperience: 5,
    skills: [
      { name: "API Documentation", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "OpenAPI", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Markdown", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "Docusaurus", proficiency: "ADVANCED", yearsExperience: 3, isInferred: false },
      { name: "Mintlify", proficiency: "INTERMEDIATE", yearsExperience: 2, isInferred: false },
      { name: "Information Architecture", proficiency: "ADVANCED", yearsExperience: 4, isInferred: false },
      { name: "Technical Writing", proficiency: "EXPERT", yearsExperience: 5, isInferred: false },
      { name: "Git", proficiency: "ADVANCED", yearsExperience: 5, isInferred: false },
      { name: "Version Control", proficiency: "ADVANCED", yearsExperience: 5, isInferred: true, inferredFrom: "Git" }
    ],
    projects: [
      { title: "Developer Portal Relaunch", description: "Led the redesign and content overhaul of a public dev portal, doubling weekly active developers in 4 months.", technologies: ["Docusaurus", "OpenAPI", "Markdown"] },
      { title: "SDK Reference Docs", description: "Authored complete reference documentation for two open-source SDKs across 6 languages.", technologies: ["Markdown", "OpenAPI"] }
    ]
  }
];

async function main() {
  console.log(`Seeding ${SEEDS.length} profiles...`);
  let created = 0;
  let skipped = 0;

  for (const s of SEEDS) {
    const existing = await prisma.user.findUnique({ where: { email: s.email } });
    if (existing) {
      console.log(`  · ${s.email} already exists — skipping`);
      skipped++;
      continue;
    }

    const hashed = await bcrypt.hash(s.password, 10);

    await prisma.user.create({
      data: {
        email: s.email,
        name: s.accountName,
        password: hashed,
        role: "EMPLOYEE",
        profile: {
          create: {
            name: s.candidateName,
            summary: s.summary,
            location: s.location,
            yearsExperience: s.yearsExperience,
            availability: "Available",
            resumeFileName: `${s.candidateName.replace(/ /g, "_")}_Resume.pdf`,
            skills: {
              create: s.skills.map((sk) => ({
                name: sk.name,
                proficiency: sk.proficiency,
                yearsExperience: sk.yearsExperience,
                isInferred: sk.isInferred,
                inferredFrom: sk.inferredFrom || null
              }))
            },
            projects: { create: s.projects },
            reviewQueue: {
              create: { status: "APPROVED", reviewedAt: new Date() }
            }
          }
        }
      }
    });
    created++;
    console.log(`  ✓ ${s.candidateName} (${s.email})`);
  }

  console.log(`\nDone — ${created} created, ${skipped} skipped (already existed).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
