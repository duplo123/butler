# 🚀 Quick Start Guide - Local Development

## ✅ You're All Set Up!

Your Summer Schedule Planner is now running locally!

### 🌐 Access the Application

**Main App:** http://localhost:3000

**Database UI (Prisma Studio):** 
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 📱 What You Can Test

### 1. **Family Profile Management**
The home page will show the family profile interface where you can:
- Add caregivers (parents/guardians)
- Add children with age auto-calculation
- View and edit family members

### 2. **Camp Ingestion** 
Test the URL input component:
- Paste any summer camp website URL
- Watch the processing stages (scraping → extracting → saving)
- Review extracted data
- **Note:** Without OpenAI API key, you'll see placeholder data

### 3. **Lifecycle Tracker (Kanban)**
- Drag and drop camps between stages:
  - 🤔 Considering (yellow)
  - 📝 Applied (blue)
  - ✅ Registered (green)
  - 📦 Archived (gray)

### 4. **Calendar View**
- See all active camps in a calendar
- Color-coded by lifecycle stage
- Conflict detection for overlapping dates

---

## 🗄️ Database Commands

### View Data in UI
```bash
npx prisma studio
```

### Reset Database (Delete All Data)
```bash
docker-compose down -v
docker-compose up -d
npx prisma db push
```

### Stop Database
```bash
docker-compose down
```

### Restart Database
```bash
docker-compose up -d
```

---

## 🔧 Development Commands

### Start Dev Server
```bash
npm run dev
```
Runs at http://localhost:3000 with hot reload

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

---

## 🧪 Testing Features

### Test Family Profile
1. Go to http://localhost:3000
2. Add a caregiver (e.g., "John Doe", email, phone)
3. Add a child (e.g., "Emma", DOB: 2015-06-15)
4. See auto-calculated age

### Test Camp Ingestion
1. Try ingesting a camp URL (any summer camp website)
2. Watch the processing animation
3. Review the extracted data
4. Click "Save to Considering"

**Example URLs to try:**
- https://www.ymca.org/summer-camps
- https://www.campfire.org/
- Any local summer camp website

### Test Kanban Board
1. Create a few camps (or add them via Prisma Studio)
2. Drag camps between lifecycle stages
3. See smooth animations and updates

### Test Calendar
1. Add camps with start/end dates
2. View them in the calendar
3. Check for conflict warnings on overlapping dates

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart
docker-compose restart
```

### Prisma Schema Changes
```bash
# After modifying schema.prisma
npx prisma generate
npx prisma db push
```

---

## 📊 Component Testing URLs

Once the server is running, you can access:

- **Home (Profile):** http://localhost:3000
- **API Health Check:** http://localhost:3000/api/family

**API Endpoints to test with Postman/curl:**
- `GET /api/family` - List families
- `POST /api/family` - Create family
- `GET /api/caregivers?familyId={id}` - List caregivers
- `POST /api/caregivers` - Add caregiver
- `GET /api/children?familyId={id}` - List children
- `POST /api/children` - Add child
- `GET /api/camps?familyId={id}` - List camps
- `POST /api/camps/ingest` - Ingest camp from URL

---

## 🎨 UI Components to Inspect

All components are in `/components`:

```
components/
├── FamilyProfile/
│   ├── CaregiverForm.tsx      - Test adding caregivers
│   ├── ChildForm.tsx          - Test age auto-calculation
│   └── ProfileSummary.tsx     - View family members
├── CampIngestor/
│   ├── URLInput.tsx           - Test URL validation
│   ├── ProcessingStatus.tsx   - See loading states
│   └── ExtractedDataPreview.tsx - Review data
├── LifecycleTracker/
│   ├── CampKanban.tsx         - Test drag & drop
│   ├── CampCard.tsx           - View camp cards
│   └── StageColumn.tsx        - Droppable columns
└── Calendar/
    └── CalendarView.tsx       - Test calendar
```

---

## 🚀 Next Steps

### Enable Full AI Extraction
Add your OpenAI API key to `.env`:
```bash
OPENAI_API_KEY="sk-proj-your-actual-key-here"
```

Then restart the dev server. The camp ingestion will use real AI to extract data!

### Deploy to Production
See the main README.md for Vercel deployment instructions.

---

## 🛑 Shutdown

When done testing:
```bash
# Stop Next.js (Ctrl+C in terminal)
# Stop database
docker-compose down
```

**Keep data for next time:** Just `docker-compose down`
**Delete all data:** `docker-compose down -v`

---

Happy testing! 🎉
