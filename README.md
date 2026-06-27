# RecruiterAI — Full-Stack Recruitment Operating System (OS)

RecruiterAI is a production-grade, AI-assisted recruitment operating system designed to automate and optimize the modern hiring lifecycle. The system manages everything from multi-channel job postings to automated candidate matching, video interview vetting, calendar scheduling, and recruitment analytics.

---

## 🚀 Product Vision
Traditional hiring processes are bottlenecked by manual sourcing, long resume review queues, and scheduling friction. RecruiterAI acts as an autonomous extension of an in-house HR team. By using artificial intelligence to parse applications, evaluate candidates against custom rubrics, and coordinate scheduling, recruiters can focus on candidate relationships and high-fidelity hiring.

---

## 🔄 End-to-End Recruitment Workflow
The platform is designed to automate candidate progression through a multi-stage funnel:

```
Company Signup & Onboarding
         │
         ▼
Organization Created & Recruiter Workspace Provisioned
         │
         ▼
Job Postings Created (Using AI JD Optimizer)
         │
         ▼
Multi-Channel Distribution (Post Once, Sync to LinkedIn, Indeed, Glassdoor, etc.)
         │
         ▼
Candidate Application Submission (Smart Forms + Resume Upload)
         │
         ▼
AI Resume Parsing & Matching Score Calculation
         │
         ├─── Score < Pass Threshold (e.g. 75%) ──> Auto-Rejection + Silver Medalist Archiving
         │
         └─── Score >= Pass Threshold (e.g. 75%)
                 │
                 ▼
AI Automated Pre-qualification Questionnaire sent
                 │
                 ├─── Score < Vet Threshold (e.g. 85%) ──> Auto-Rejection + Future Pool
                 │
                 └─── Score >= Vet Threshold (e.g. 85%)
                         │
                         ▼
Interactive Calendar Booking (Google/Outlook availability sync)
                         │
                         ▼
AI Video Assessment Vetting (Speech-to-text response rubric evaluation)
                         │
                         ▼
Recruiter/Manager Interview Feedback & Verification
                         │
                         ▼
Hiring Manager Approval, Offer Generation, and Onboarding
```

---

## 👥 Supported User Roles
RecruiterAI defines six granular Role-Based Access Control (RBAC) levels:
1. **Platform Admin**: Superuser managing SaaS tenants, global subscription tiers, and overall system health.
2. **Company Admin**: Organizational administrator managing company profiles, team memberships, and billing configurations.
3. **Recruiter**: Core recruiter managing job listings, review flows, and candidate pipelines.
4. **Hiring Manager**: Department lead approving final requisitions, evaluating shortlisted candidates, and signing off on offers.
5. **Interviewer**: Team member conducting live panels and submitting feedback scores against set rubrics.
6. **Candidate**: Applicant submitting resumes, filling questionnaires, scheduling bookings, and completing video assessments.

---

## 🛠 Technology Stack
The full-stack application utilizes a modern tech profile:

### Frontend (Production-Approved SPA)
* **Framework**: React `v18`
* **Build Tool**: Vite `v6` (with SWC compiler)
* **Language**: TypeScript
* **Animations**: Framer Motion
* **Styling**: Tailwind CSS `v4` & Radix UI / Shadcn

### Backend (Scalable Service Stack)
* **Runtime**: Next.js Route Handlers (API framework)
* **ORM**: Prisma ORM
* **Database**: PostgreSQL (Neon Serverless)
* **Authentication**: Clerk Multi-Tenant Auth
* **Caching & Queues**: Upstash Redis & BullMQ
* **File Storage**: Cloudinary / Cloudflare R2 (Resume PDFs)
* **AI Engine**: Google Gemini API (Text extraction, questions generation, video scoring)
* **Emails**: Resend API

---

## 📂 Project Folder Structure
The workspace is split into two isolated modules:

```
Recruiterai/
├── app/                  # Next.js Route Handlers (API Delivery Layer)
│   └── api/
│       └── health/       # Health verification endpoints
├── backend/              # Clean Architecture Backend Source Code
│   ├── config/           # Environment Zod configuration
│   ├── domain/           # Business domain objects & repository ports
│   │   ├── exceptions/   # Custom domain exceptions mapping to HTTP
│   │   └── repositories/ # Port contracts defining database interfaces
│   ├── application/      # Business use cases and service layers
│   │   └── services/     # Core services base interfaces
│   ├── infrastructure/   # System adapters and external connections
│   │   └── logger/       # Structured JSON Console Logger
│   └── presentation/     # Presentation layout contracts and common utils
│       ├── constants/    # User roles, status types, and status codes
│       ├── errors/       # Global exception response handler
│       ├── middleware/   # Request authentication & IP rate filters
│       ├── types/        # Common context and session structures
│       ├── utils/        # Standardized API response format helpers
│       └── validation/   # Zod body/query parser validation helpers
├── src/                  # Pre-existing Vite React Frontend (Do Not Modify)
│   ├── components/       # Custom animated landing page blocks
│   └── ui/               # Radix UI and Shadcn primitives
├── index.html            # Frontend Entry Page
├── tsconfig.json         # Unified TypeScript configuration mapping paths
└── vite.config.ts        # Vite compiler settings and aliases
```

---

## 🏗 Backend Architecture Principles
To ensure scalability and testability, the backend is built using **Clean Architecture**:
* **Dependency Rule**: Dependencies point inwards. Core business rules (Domain and Application layers) do not know about concrete database adapters (Prisma/Postgres) or HTTP frame routes (Next.js). They interact purely through interfaces (Ports).
* **Validation at the Boundary**: All requests are validated at the API boundary using Zod schema structures before execution.
* **Centralized Exception Mapping**: Services throw rich domain exceptions, which are captured by a global error handler that returns clean client-safe responses.

---

## 🗺 Development Roadmap & Branch Progress

- [x] **Branch 1: backend/project-architecture**
  * Core folder structure, env validations, standard API response wrappers, exception handling, custom logger, request validators, base ports, and test route.
- [ ] **Branch 2: backend/database-prisma**
  * Prisma ORM configurations, Neon Postgres database credentials sync, schema migrations, and repository adapter implementations.
- [ ] **Branch 3: backend/authentication-clerk**
  * Clerk SDK multi-tenant auth integrations, route session gates, and RBAC validation.
- [ ] **Branch 4: backend/jobs-pipeline**
  * Job creation API, JD optimizer integrations, search parameters, and applicant tracking states.
- [ ] **Branch 5: backend/resume-processing**
  * Cloudinary PDF upload, OCR text parsing, and Gemini-based scoring matching engine.
- [ ] **Branch 6: backend/scheduling-system**
  * Oauth calendar integration, scheduling available time blocks, and meeting notifications.
- [ ] **Branch 7: backend/analytics-logs**
  * Real-time metrics database aggregation, tenant dashboards, audit log triggers.