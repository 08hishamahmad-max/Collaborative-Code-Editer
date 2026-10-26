import type { WorkspaceFile } from "../types/workspace";

export const mockFiles: WorkspaceFile[] = [
  {
    id: "main-js",
    name: "main.js",
    language: "javascript",
    content: `// Entry point for the demo app
import { createApp } from "./app.js";

const root = document.getElementById("root");

function start() {
  const app = createApp({ theme: "dark" });
  app.mount(root);
  console.log("App started");
}

start();
`,
  },
  {
    id: "index-html",
    name: "index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CollabCode Demo</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="main.js"></script>
  </body>
</html>
`,
  },
  {
    id: "styles-css",
    name: "styles.css",
    language: "css",
    content: `:root {
  --bg: #0b0d12;
  --fg: #e6e8ee;
  --accent: #6366f1;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--fg);
}

.button {
  background: var(--accent);
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
}
`,
  },
];

export const mockTerminalLines: string[] = [
  "$ npm run dev",
  "",
  "  VITE v5.0.0  ready in 312 ms",
  "",
  "  ➜  Local:   http://localhost:5173/",
  "  ➜  Network: use --host to expose",
  "",
  "[collab] connected to room: demo-room",
  "[collab] 2 collaborators online",
];