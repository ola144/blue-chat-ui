# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
export default defineConfig([
  # Chat App

  Lightweight real-time chat application built with React, TypeScript, and Vite.

  ## Features

  - Real-time messaging via WebSockets
  - User authentication and profiles
  - Responsive UI with modern React patterns

  ## Tech stack

  - Frontend: React + TypeScript + Vite
  - State: Redux (slices in `src/redux`)
  - HTTP: Axios (`src/services/axios.ts`)
  - WebSocket: Socket utilities (`src/services/socket.ts`)

  ## Prerequisites

  - Node.js 18+ and npm or yarn

  ## Setup

  1. Install dependencies

  ```bash
  npm install
  # or
  yarn
````

2. Create a `.env` file in the project root and set the API base URL used by the app (used by `src/services/*`):

```
VITE_API_BASE_URL=http://localhost:4000
```

3. Run the dev server

```bash
npm run dev
# or
yarn dev
```

4. Build for production

```bash
npm run build
```

5. Preview the production build

```bash
npm run preview
```

## Project structure (key files)

- `src/main.tsx` — app entry
- `src/App.tsx` — top-level routes and layout
- `src/services/` — API, socket, auth helpers
- `src/redux/` — Redux store and slices
- `src/Components/` — UI components
- `src/Pages/` — route pages (Login, Signup, Home, Profile)

## Environment variables

- `VITE_API_BASE_URL` — base URL for REST API and socket endpoint

Note: Vite exposes env variables prefixed with `VITE_` via `import.meta.env`.

## Contributing

Contributions are welcome — please open an issue or submit a PR with a clear description.

## License

This project does not include a license file. Add one if you plan to open-source the repository.
