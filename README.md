<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563EB,50:38BDF8,100:6366F1&height=220&section=header&text=Oikyo&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Social%20Development%20Events%20Platform&descSize=20&descAlignY=60" alt="Oikyo banner" width="100%" />

<a href="https://oikyo-psi.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=700&lines=Connecting+passionate+volunteers;Community+service+events+across+Bangladesh;Create+%E2%80%A2+Join+%E2%80%A2+Manage+events;Driving+meaningful+social+development" alt="Typing animation" />
</a>

<br />

<a href="https://oikyo-psi.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-oikyo--psi.vercel.app-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo" /></a>
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />

</div>

---

## About

**Oikyo** connects passionate volunteers with community service events to drive meaningful social development across Bangladesh. Anyone can discover upcoming events, join the ones they care about, and organizers can create and manage their own.

This repository contains the **client** (frontend) of the project.

## Features

| | Feature | What it does |
|---|---|---|
| 📅 | **Upcoming Events** | Browse community events and open a details page for each one |
| ➕ | **Create Event** | Organizers publish a new event with its details and category |
| 🛠️ | **Manage Events** | Update events through a dialog and delete them with a confirmation prompt |
| 🎟️ | **Joined Events** | See every event you have joined in one place |
| 🖼️ | **Gallery** | A photo gallery section on the home page |
| 🔐 | **Authentication** | Sign in and sign up with Better Auth |

### Event Categories

<div align="center">

![Cleanup](https://img.shields.io/badge/Cleanup-10B981?style=flat-square)
![Plantation](https://img.shields.io/badge/Plantation-22C55E?style=flat-square)
![Donation](https://img.shields.io/badge/Donation-F97316?style=flat-square)
![Education](https://img.shields.io/badge/Education-3B82F6?style=flat-square)
![Health Camp](https://img.shields.io/badge/Health%20Camp-F43F5E?style=flat-square)
![Food Distribution](https://img.shields.io/badge/Food%20Distribution-F59E0B?style=flat-square)

</div>

## Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,ts,react,tailwind,mongodb,vercel,git,github&theme=dark" alt="Tech stack icons" />

</div>

- **Framework:** Next.js with TypeScript
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui and HeroUI
- **Icons:** Lucide React and React Icons
- **Authentication:** Better Auth
- **Database:** MongoDB
- **Alerts:** SweetAlert
- **Deployment:** Vercel

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/Ayman392/Social-Development-Events-Platform_Client.git
cd Social-Development-Events-Platform_Client
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the project root and add your own values:

```env
# Example names, change them to match your project
NEXT_PUBLIC_API_URL=your_server_url
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
```

**4. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js routes and layouts
│   └── components/  # Reusable UI, home sections, footer and more
├── components.json  # shadcn/ui configuration
├── next.config.ts
└── package.json
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |

## Author

<div align="center">

**Made with 💙 by [Ayman](https://github.com/Ayman392)**

<a href="https://oikyo-psi.vercel.app"><img src="https://img.shields.io/badge/Visit%20Oikyo-38BDF8?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Visit Oikyo" /></a>
<a href="https://github.com/Ayman392"><img src="https://img.shields.io/badge/GitHub-Ayman392-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:38BDF8,100:2563EB&height=120&section=footer" alt="Footer wave" width="100%" />

</div>
