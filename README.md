# 🚀 NovaAI - AI-Powered Interview Practice Platform

<div align="center">



[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20&%20DB-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://openai.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://nova.pritika.xyz/)


</div>

---

## What is NovaAI?

NovaAI helps you prepare for interviews using AI. Get real-time voice interviews, resume feedback, and performance tracking to ace your next opportunity.

- **Real-time voice interviews** - Chat with AI interviewer via Vapi.ai
- **Live transcripts** - See everything you say instantly
- **Resume feedback** - Upload your resume, get AI suggestions
- **Performance metrics** - Track your progress with detailed stats
- **PDF reports** - Download interview summaries

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Voice**: Vapi.ai (real-time speech & transcription)
- **AI**: OpenAI (feedback & resume analysis)
- **Database**: Supabase (user data & authentication)
- **UI Components**: Radix UI, Lucide icons, Motion animations
- **PDF & Documents**: jsPDF, html2canvas, pdf-parse

---

## 📂 Project Structure

```
src/
├── app/        → Pages & routing (Next.js App Router)
├── components/ → React components (UI, interview widget, dashboard)
├── lib/        → API integrations (Supabase, OpenAI, Vapi)
├── types/      → TypeScript definitions
└── utils/      → Helper functions

public/        → Static assets (images, icons)
prisma/        → Database schema & migrations
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key
- Vapi.ai account

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Pritika-Shukla/NovaAI.git
cd NovaAI
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# OpenAI
OPENAI_API_KEY=your_key

# Vapi.ai
NEXT_PUBLIC_VAPI_KEY=your_key
VAPI_PRIVATE_KEY=your_private_key
```

**4. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Integrations

**OpenAI** - Resume analysis, feedback generation, intelligent question creation

**Vapi.ai** - Real-time voice conversations, automatic transcription, speech synthesis

**Supabase** - User authentication, PostgreSQL database, secure file storage

---

## 🤝 Contributing

Have ideas? Found a bug? We'd love your help!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---



<div align="center">

**Master your interview skills with NovaAI** 🚀

Made with ❤️ by [Pritika Shukla](https://github.com/Pritika-Shukla)

</div>
