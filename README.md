# Skills Manager ⚡

Skills Manager is a powerful desktop application designed for visualizing, installing, and managing AI Agent Skills. Built with Angular and Tauri, it provides a sleek interface to interact with the [skills CLI](https://skills.sh).

## 🚀 Features

- **📊 Dashboard**: Quick overview of your installed skills, project vs global distribution, and connected AI agents.
- **📋 Skills Management**: Browse installed skills in a clean list view. Search, filter, and sort by name, install date, or agent count.
- **📖 Skill Details**: Read the full `SKILL.md` content, view metadata, author info, and security assessments.
- **🛒 Marketplace**: Easily install new skills directly from GitHub repositories.
- **🛡️ Security First**: integrated security assessments (Gen, Socket, Snyk) for supported skills.
- **🤖 Agent Linking**: Automatically handles symlinking skills to agents like Claude Desktop, Cursor, VS Code Copilot, and more.
- **⚙️ Setup Guard**: Automatically checks if the required `skills` CLI is installed on startup.

## 🛠️ Tech Stack

- **Frontend**: Angular v19+ (Signals, Standalone Components, Reactive UI)
- **Backend**: Tauri v2 (Rust)
- **Database**: SQLite (via `rusqlite` with bundled features)
- **Design**: Vanilla CSS with Glassmorphism aesthetics and Dark Mode
- **CLI Integration**: `npx skills`

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Rust](https://www.rust-lang.org/) (v1.75+)
- [skills](https://www.npmjs.com/package/skills) CLI: `npm install -g skills`
- **Windows**: [Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/downloads/) with C++ workload.

### Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dase1353/skills-manager.git
   cd skills-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   # Windows (sets up MSVC environment automatically)
   ./dev.bat

   # Other platforms
   npm run tauri dev
   ```

## 🏗️ Building for Production

```bash
npm run tauri build
```

The installer will be generated in `src-tauri/target/release/bundle/`.

## 📜 License

[MIT](LICENSE)

---
Made with ❤️ for the AI Agent community.
