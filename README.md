# JobFinder Bot Frontend (React UI Dashboard)

A React single-page application built on Vite. It implements a dark-mode styled console containing statistics, charts, jobs search lists, RAG chunks monitoring, logs monitoring, and review boards.

---

## Technical Architecture

### 1. State Management & API Hooks
- **Axios HTTP Client:** Located in `src/services/api.js`. Configured with automatic interceptors that retrieve JWT tokens from localStorage and perform silent session refreshes on 401 response codes.
- **Form Handling:** Utilizes `react-hook-form` coupled with `zodResolver` to validate schemas on fields like logins, custom keys, and settings.

### 2. Routes & Guarding
- **React Router:** Router settings are defined in `src/App.jsx`.
- **Protected Routing:** A `ProtectedRoute` wrapper component intercepts route changes, verifying if a token exists in browser memory. If absent, it redirects the browser to `/login`.

### 3. CSS Style Theme
- **Obsidian Theme:** Configured inside `src/index.css`. Tailors HSL variables for dark obsidian layers, glassmorphic card backdrops, glowing svg progress meters, and dynamic hover animations.
- **Light Theme Support:** Standard fallback triggers adjust variables for slate modes.

---

## Page Components

- **Login Page (`Login.jsx`):** Renders a secure login portal using form validation.
- **Dashboard (`Dashboard.jsx`):** Renders KPI cards (crawler health, match success ratios) and Recharts charts showing weekly trends and platform distributions.
- **Jobs Board (`Jobs.jsx`):** Shows paginated lists of crawls and progress matches.
- **Job Details (`JobDetails.jsx`):** Shows RAG context summaries, keywords, and progress sliders for suitability metrics.
- **Approval Queue (`ApprovalQueue.jsx`):** The primary workstation containing Approve, Edit, Reject, and Preview modules.
- **Knowledge Base (`KnowledgeBase.jsx`):** Scraper control dashboard containing trigger buttons, crawl logs, crawled pages list, and chunk searches.
- **Settings Controller (`Settings.jsx`):** A tabbed page managing API keys, platform credentials, system prompts, and programmatic key generation.
- **Logs Page (`LogsPage.jsx`):** Exposes backend scheduler run records, audit logs, and system logs.

---

## Production Build

To build the optimized static asset package:
1. Navigate to the frontend directory:
   ```bash
   cd jobFinderBot-frontend
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. The build assets will be generated in the `dist/` folder, ready for host deployment on Vercel.
