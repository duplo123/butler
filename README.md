# Summer Schedule Planner

AI-powered family logistics management system for summer camps and activities. Built with Next.js, CopilotKit, and Vercel Workflows.

## Features

- **Family Profile Management**: Manage caregivers and children profiles
- **Camp Information Ingestion**: AI-powered web scraping and summarization
- **Lifecycle Tracking**: Kanban-style camp management (Considering → Applied → Registered → Archived)
- **Calendar Visualization**: Color-coded timeline view with conflict detection

## Tech Stack

- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend**: Vercel Workflows
- **Database**: PostgreSQL + Prisma ORM
- **AI**: CopilotKit + OpenAI GPT-4
- **State Management**: React Hooks + Server Actions

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key (for LLM extraction)
- Vercel account (for Workflows)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/doverdose/butler.git
cd butler
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/summer_planner"
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VERCEL_API_TOKEN="vercel_token_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

4. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
butler/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── family/        # Family CRUD
│   │   ├── caregivers/    # Caregiver CRUD
│   │   ├── children/      # Children CRUD
│   │   └── camps/         # Camp management
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── FamilyProfile/     # Profile management
│   ├── CampIngestor/      # URL ingestion
│   ├── LifecycleTracker/  # Kanban board
│   └── Calendar/          # Calendar view
├── workflows/             # Vercel Workflows
│   ├── scrapeCampWebsite.ts
│   ├── extractCampData.ts
│   └── detectScheduleConflicts.ts
├── lib/                   # Utilities
│   └── prisma.ts          # Prisma client
├── prisma/                # Database
│   └── schema.prisma      # Database schema
└── tests/                 # Tests
```

## Database Schema

The application uses the following main models:

- **Family**: Root entity for each family
- **Caregiver**: Parent/guardian information
- **Child**: Child profiles with age and eligibility data
- **Camp**: Summer camp information and lifecycle stage
- **CampActivity**: Activities offered by each camp

See `prisma/schema.prisma` for the complete schema.

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Implementation Phases

### Phase 1: Foundation ✅ (Completed)
- ✅ Next.js project setup
- ✅ CopilotKit integration
- ✅ Prisma ORM configuration
- ✅ Family profile components (CaregiverForm, ChildForm, ProfileSummary)
- ✅ API routes for CRUD operations (family, caregivers, children)

### Phase 2: Camp Ingestion ✅ (Completed)
- ✅ Camp URL input component
- ✅ Vercel Workflows for web scraping (placeholder implementation)
- ✅ LLM-based data extraction (ready for OpenAI integration)
- ✅ Processing status UI
- ✅ Extracted data preview component
- ✅ Camp ingestion API routes

### Phase 3: Lifecycle & Calendar ✅ (Completed)
- ✅ Kanban board with drag-and-drop (@dnd-kit)
- ✅ Calendar visualization (react-big-calendar)
- ✅ Conflict detection API
- ✅ Lifecycle stage management
- ⏳ CopilotKit proactive suggestions (pending integration)

### Phase 4: Polish & Testing ⏳ (Pending)
- ⏳ Comprehensive testing
- ⏳ Performance optimization
- ⏳ Accessibility improvements
- ⏳ Production deployment

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
