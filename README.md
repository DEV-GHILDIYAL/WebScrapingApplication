# ScrapeFlow

**Enterprise Web Scraping Platform** — Configure, schedule, and manage web scraping jobs through an intuitive UI. No code required.

---

## Architecture Overview

```
                    ┌──────────────────────────────┐
                    │         Clients               │
                    │   (Browser / API consumers)   │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │     Next.js 15 Frontend       │
                    │   TypeScript + Tailwind v3    │
                    │      App Router + RSC         │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────▼────────────────────┐
              │            API Gateway / Routes         │
              │     Next.js API Routes → AWS Lambda     │
              └───┬────────┬────────┬────────┬─────────┘
                  │        │        │        │
         ┌────────▼──┐ ┌──▼─────┐ ┌▼──────┐ ┌▼────────────┐
         │  Cognito   │ │ SQS    │ │  S3   │ │  DynamoDB    │
         │  (Auth)    │ │(Queue) │ │(Files)│ │  (Database)  │
         │            │ │        │ │       │ │              │
         │ • Email/PW │ │ Job    │ │Export │ │ • Jobs       │
         │ • Google   │ │ queue  │ │files  │ │ • Users      │
         │   OAuth    │ │        │ │       │ │ • Billing    │
         └────────────┘ └───┬────┘ └───────┘ │ • Proxy cfg  │
                            │                └──────────────┘
                   ┌────────▼────────┐
                   │  Step Functions  │
                   │  (Orchestrator)  │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │     Fargate     │
                   │   (Workers)     │
                   │                 │
                   │ • Scraping      │
                   │ • Proxy rotate  │
                   │ • Data extract  │
                   └─────────────────┘
                            │
              ┌─────────────▼──────────────┐
              │        CloudWatch          │
              │  Logs · Metrics · Alarms   │
              └────────────────────────────┘
```

## AWS Service Mapping

| Service               | Purpose                                            | Resource Name                  |
|-----------------------|----------------------------------------------------|--------------------------------|
| **Amazon Cognito**    | User authentication (email/password + Google OAuth) | `scrapeflow-user-pool`         |
| **AWS Lambda**        | Backend API handlers (auth, jobs, billing)          | `scrapeflow-api-*`             |
| **Amazon SQS**        | Job queue for async processing                     | `scrapeflow-jobs-queue`        |
| **AWS Step Functions**| Workflow orchestration for multi-step scraping      | `scrapeflow-job-workflow`      |
| **AWS Fargate**       | Container-based scraper workers                    | `scrapeflow-worker-cluster`    |
| **Amazon DynamoDB**   | Primary database (jobs, users, billing, proxy cfg) | `scrapeflow-*` tables          |
| **Amazon S3**         | Export file storage (CSV, JSON, Excel)             | `scrapeflow-exports`           |
| **Secrets Manager**   | Proxy credentials, API keys                        | `scrapeflow/proxy-creds`       |
| **CloudWatch**        | Logging, metrics, and alarms                       | `scrapeflow-*` log groups      |
| **Razorpay**          | Payment processing (Standard Checkout)             | External service               |

## Tech Stack

| Layer            | Technology                       |
|------------------|----------------------------------|
| Frontend         | Next.js 15 + TypeScript          |
| Styling          | Tailwind CSS v3                  |
| Auth             | AWS Cognito + Google OAuth       |
| API              | Next.js API Routes → AWS Lambda  |
| Job Queue        | Amazon SQS                       |
| Orchestration    | AWS Step Functions               |
| Workers          | AWS Fargate (containers)         |
| Database         | Amazon DynamoDB                  |
| File Storage     | Amazon S3                        |
| Secrets          | AWS Secrets Manager              |
| Monitoring       | Amazon CloudWatch                |
| Payments         | Razorpay Standard Checkout       |

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API route handlers
│   │   │   ├── auth/route.ts   # Auth → Cognito
│   │   │   ├── jobs/route.ts   # Jobs → DynamoDB + SQS
│   │   │   └── billing/route.ts# Billing → Razorpay
│   │   ├── auth/               # Auth pages (sign in/up/out)
│   │   ├── dashboard/          # App dashboard
│   │   │   ├── jobs/           # Job management
│   │   │   ├── settings/       # Account settings
│   │   │   └── exports/        # Export history
│   │   ├── pricing/            # Pricing page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Design system + Tailwind
│   ├── components/
│   │   ├── ui/                 # Button, Card, Input, Badge, etc.
│   │   ├── layout/             # Navbar, Sidebar, Header, Footer
│   │   ├── landing/            # Hero, Features, HowItWorks, CTA
│   │   ├── jobs/               # JobCard, JobForm, FieldExtractor
│   │   └── settings/           # Billing, Proxy, API keys
│   ├── lib/                    # Types, constants, utilities, mock data
│   ├── services/               # API service layer (mock → real)
│   └── hooks/                  # useAuth, useJobs
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind v3 + design tokens
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies
```

## API Response Format

All API routes return a **consistent response envelope**:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

On error:

```json
{
  "success": false,
  "data": null,
  "error": "Human-readable error message"
}
```

## Local Development

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+

### Quick Start

```bash
# Clone
git clone https://github.com/YOUR_ORG/WebScrapingApplication.git
cd WebScrapingApplication

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start dev server
npm run dev
```

The app runs at **http://localhost:3000**

## Environment Variables

| Variable                          | Description                           | Required |
|-----------------------------------|---------------------------------------|----------|
| `NEXT_PUBLIC_APP_URL`             | App URL (default: http://localhost:3000) | No    |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID`| Cognito User Pool ID                 | Yes      |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID`   | Cognito App Client ID                | Yes      |
| `NEXT_PUBLIC_COGNITO_DOMAIN`      | Cognito hosted UI domain             | Yes      |
| `AWS_REGION`                      | AWS region (default: us-east-1)      | Yes      |
| `AWS_ACCESS_KEY_ID`               | AWS access key                       | Yes      |
| `AWS_SECRET_ACCESS_KEY`           | AWS secret key                       | Yes      |
| `DYNAMODB_JOBS_TABLE`             | DynamoDB table for jobs              | Yes      |
| `DYNAMODB_USERS_TABLE`            | DynamoDB table for users             | Yes      |
| `S3_EXPORTS_BUCKET`              | S3 bucket for export files            | Yes      |
| `SQS_JOBS_QUEUE_URL`             | SQS queue URL for job processing      | Yes      |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`    | Razorpay public key                   | Yes      |
| `RAZORPAY_KEY_SECRET`            | Razorpay secret key                   | Yes      |
| `SECRETS_PROXY_ARN`              | Secrets Manager ARN for proxy creds   | No       |

## Available Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start development server (port 3000) |
| `npm run build`  | Create production build              |
| `npm start`      | Start production server              |
| `npm run lint`   | Run ESLint checks                    |

## Deployment

- **Frontend**: AWS Amplify or Vercel
- **Backend APIs**: AWS Lambda behind API Gateway
- **Database**: DynamoDB (on-demand capacity)
- **Workers**: Fargate tasks via SQS → Step Functions
- **CDN**: CloudFront for static assets
- **DNS**: Route 53

## License

Proprietary — All rights reserved.
