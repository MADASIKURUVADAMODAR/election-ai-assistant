# Security Policy

## Security-First Design

1.  **PII Redaction**: Gemini AI is instructed to redact sensitive personal identifiers (EPIC, Aadhaar, phone numbers) before returning data.
2.  **Input Sanitization**: All user-provided strings are sanitized using `dompurify` to prevent XSS.
3.  **Firebase Security**: Firestore and Storage are protected by strict security rules.
4.  **Content Security Policy**: Implemented via Next.js headers to restrict unauthorized scripts and styles.

## Reporting a Vulnerability

If you find a security vulnerability, please do not open a public issue. Instead, email security@example.com (replace with real email).

## Environment Variables

Sensitive keys (GEMINI_API_KEY, Firebase secrets) are never exposed to the client and are managed via Vercel environment variables.
