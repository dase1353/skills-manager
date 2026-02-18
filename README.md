# Skills Manager ⚡

> [!IMPORTANT]
> **This project was written entirely by AI (Claude 4.6 Sonnet) and is intended for reference and testing purposes only.**

Skills Manager is a powerful desktop application designed for visualizing, installing, and managing AI Agent Skills. Built with Angular and Tauri, it provides a sleek interface to interact with the [skills CLI](https://skills.sh).

---

# Skills Manager ⚡ (繁體中文)

> [!IMPORTANT]
> **本專案完全由 AI (Claude 4.6 Sonnet) 撰寫，僅供參考與測試使用。**

Skills Manager 是一款強大的桌面應用程式，專為視覺化、安裝及管理 AI Agent Skills 而設計。本工具採用 Angular 與 Tauri 構建，為 [skills CLI](https://skills.sh) 提供了一個美觀的使用介面。

## 🚀 功能特色 | Features

### English
- **📊 Dashboard**: Quick overview of your installed skills and connected agents.
- **📋 Skills Management**: Clean list view with search, filter, and sorting.
- **📖 Skill Details**: Read full `SKILL.md` content and security assessments.
- **🤖 Agent Linking**: Automatic symlinking to Claude Desktop, Cursor, Copilot, etc.
- **⚙️ Setup Guard**: Startup check for the required `skills` CLI.

### 繁體中文
- **📊 儀表板**: 快速瀏覽已安裝的 Skills、專案/全域分佈及連接的 Agents。
- **📋 Skills 管理**: 簡潔的清單視圖，支援搜尋、篩選以及按名稱、時間或 Agent 數量排序。
- **📖 Skill 詳情**: 查看完整 `SKILL.md` 內容、metadata、作者資訊與安全評估。
- **🛒 市集**: 支援直接從 GitHub 倉庫安裝新的 Skills。
- **🛡️ 安全優先**: 整合多種安全評估（Gen, Socket, Snyk）。
- **🤖 Agent 連結**: 自動處理到 Claude Desktop, Cursor, VS Code Copilot 等工具的符號連結（Symlink）。
- **⚙️ 啟動檢查**: 啟動時自動偵測環境中是否已安裝 `skills` CLI。

## 🛠️ 技術棧 | Tech Stack

- **Frontend**: Angular v19+ (Signals, Standalone Components)
- **Backend**: Tauri v2 (Rust)
- **Database**: SQLite (via `rusqlite` bundled)
- **CLI Integration**: `npx skills`

## 📦 快速入門 | Getting Started

### Prerequisites | 前置需求
- Node.js (v20+)
- Rust (v1.75+)
- skills CLI: `npm install -g skills`
- **Windows**: Build Tools for Visual Studio 2022.

### 開發與建置 | Dev & Build
```bash
# Clone
git clone https://github.com/dase1353/skills-manager.git

# Install
npm install

# Run (Windows)
./dev.bat

# Build
npm run tauri build
```

---
Made with ❤️ for the AI Agent community.
