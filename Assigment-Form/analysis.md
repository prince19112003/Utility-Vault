# Technical Analysis: AI Quiz Automator

This document provides a detailed breakdown of the architecture, data flow, and implementation strategies used in the **Assigment-Form** project.

## 1. Architecture Overview

The application follows a **Modular Frontend Architecture** built on React 19. It uses a **Service-Oriented Approach** to handle external APIs, abstracting the complexity of AI engines and Google Workspace integrations into dedicated service files.

### Component Map
- `App.jsx`: The central dispatcher. Manages global state (questions, auth tokens, and navigation).
- `aiService.js`: The high-speed AI interface powered exclusively by Groq.
- `googleFormsApi.js`: Handles the complex multi-step process of creating quizzes in Google Forms.
- `gmailApi.js`: Handles MIME encoding and communication with the Gmail API.

## 2. Groq Intelligence Engine

The project utilizes the **Groq Cloud API** for lightning-fast MCQ generation. 
- **Model**: `llama-3.3-70b-versatile` (or similar high-performance Llama model).
- **Endpoint**: OpenAI-compatible completion endpoint.
- **Prompt Engineering**: A dedicated `SYSTEM_PROMPT` ensures consistent JSON output, while a robust `cleanAndParse` utility ensures structural integrity even if the model includes markdown formatting.

## 3. Google Workspace Workflow

The integration with Google involves a sophisticated token-based flow:
1. **OAuth 2.0 Identity**: The user authenticates via `@react-oauth/google`, granting scopes for Forms and Gmail.
2. **Form Creation**:
    - A new form is created via `POST /v1/forms`.
    - A `batchUpdate` request is sent to convert the form into a "Quiz" and inject student fields (Name, Roll No, etc.) along with the AI-generated questions.
3. **Response Polling**: The app polls the `/responses` endpoint of the specific form ID and maps student names to their total scores.

## 4. Performance & UX Strategies

- **Glassmorphism Design**: Extensive use of Tailwind's `backdrop-blur` and semi-transparent borders for a premium aesthetic.
- **Glass-like State Transitions**: Framer-motion-style animations implemented via Tailwind `animate-in` utilities.
- **Data Persistence**: Uses `localStorage` for quiz history (The Vault) and `sessionStorage` for the splash screen logic.
- **Short URL Handling**: Integrates TinyURL to ensure that the complex Google Form URLs are user-friendly when shared via WhatsApp.

## 5. Security Considerations
- **Scoped Permissions**: The app only requests the minimum necessary scopes for Forms and Gmail functionality.
- **Environment Isolation**: API keys are managed via Vite environment variables to prevent accidental exposure in source control.
