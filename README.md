# Election AI Assistant: Civic Empowerment via Google Cloud & Gemini

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0-orange?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Flash-4285F4?logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Accessibility](https://img.shields.io/badge/Accessibility-95%2B-green)](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

An enterprise-grade, civic AI platform designed to empower voters with real-time data extraction, rumor verification, and candidate analysis.

## 🚀 Key Features

-   **VoterPulse Lens**: AI-driven voter document analysis with automatic PII redaction.
-   **The Truth Guardian**: Real-time election rumor verification via Gemini 1.5 Pro.
-   **Manifesto Summarizer**: 30-second AI summaries of candidate goals and actions.
-   **Gamified Readiness**: Dynamic voter readiness score with shareable achievement badges.

## 🏗 Enterprise Architecture

This project is built for scale and security:

-   **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion.
-   **AI Layer**: Google Cloud Vertex AI (Gemini 1.5 Flash & Pro).
-   **Backend/BaaS**: Firebase (Auth, Firestore, Storage, Analytics, Performance).
-   **Deployment**: Vercel Edge with global CDN optimization.

For detailed architecture diagrams, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠 Engineering Maturity & Quality

-   **Testing**: 90%+ coverage using Vitest and React Testing Library.
-   **Performance**: Optimized with React.memo, lazy loading, and Edge runtime.
-   **Accessibility**: WCAG 2.1 compliance with semantic HTML and ARIA.
-   **Security**: DOMPurify sanitization, PII masking, and strict Firestore rules.

## 🚦 Getting Started

### Prerequisites

-   Node.js 20+
-   Firebase Project
-   Google Cloud Project (Gemini API Key)

### Installation

1.  Clone the repo
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    ```bash
    cp .env.example .env.local
    ```
4.  Run development server:
    ```bash
    npm run dev
    ```

### Testing

Run the full test suite:
```bash
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

## 📜 Documentation

-   [Architecture Details](./ARCHITECTURE.md)
-   [Security Policy](./SECURITY.md)
-   [Contributing Guide](./CONTRIBUTING.md)

## ⚖ License

MIT License - see [LICENSE](LICENSE) for details.