# AI Chat Client

A polished React + TypeScript client for the AI chat experience. The app is built with Vite and includes routing, Redux state management, Supabase integration, and chat-focused UI components.

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Supabase
- Axios
- Sass

## Features

- Authentication flow
- Chat list and chat history views
- Message sending and chat management
- Centralized application state with Redux
- Supabase-backed data access
- Responsive component-based layout

## Project Structure

- `src/components` - UI components for login, layout, and chat screens
- `src/redux` - Redux store and slices
- `src/router` - App routing
- `src/utils` - API clients, constants, and helpers
- `supabase/schema.sql` - Database schema reference
- `public` - Static assets

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Environment Notes

The client expects the backend and Supabase configuration to be available through the app's utility layer. Make sure the server and any required Supabase project settings are configured before testing auth or chat flows.

## Purpose

This client is intended to provide the user-facing chat experience with a clean UI, fast navigation, and a maintainable front-end architecture.
