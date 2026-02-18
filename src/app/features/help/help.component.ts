import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  template: `
    <div class="help-page">
      <header class="page-header animate-in">
        <h1 class="page-title">使用說明</h1>
        <p class="page-subtitle">了解如何使用 Skills Manager 管理你的 AI Agent Skills</p>
      </header>

      <!-- What are Skills -->
      <section class="help-section card animate-in" style="animation-delay: 0.05s">
        <h2 class="section-title">🤔 什麼是 Agent Skills？</h2>
        <div class="section-body">
          <p>
            <strong>Agent Skills</strong> 是一套可重用的指令集，用來擴展 AI 編碼助手的能力。
            每個 Skill 由一個 <code>SKILL.md</code> 檔案定義，包含 YAML 前置資料（metadata）和詳細的 Markdown 指令。
          </p>
          <p>
            當 AI 助手（如 Claude、Copilot、Cursor 等）使用 Skill 時，<code>SKILL.md</code> 的內容會被注入到助手的上下文中，
            引導助手按照特定的最佳實踐、框架知識或工作流程來生成程式碼。
          </p>
        </div>
      </section>

      <!-- Installation Mechanism -->
      <section class="help-section card animate-in" style="animation-delay: 0.1s">
        <h2 class="section-title">🔗 安裝與連結機制</h2>
        <div class="section-body">
          <p>當你透過本應用程式或是 CLI 安裝 Skill 時，背後會執行以下流程：</p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">📥</span>
              <div>
                <strong>安裝命令</strong>
                <p>應用程式會呼叫 <code>npx skills add &lt;repo&gt;</code>。這會將 Skill 下載到你的電腦中（全域預設為 <code>~/.agents/skills/</code>）。</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔗</span>
              <div>
                <strong>自動連結 Agents</strong>
                <p>安裝過程中，<code>skills</code> 工具會自動偵測你電腦中安裝的 AI Agents，並在這些 Agents 的設定目錄中建立符號連結（Symlink）。</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🤖</span>
              <div>
                <strong>支援的 Agents</strong>
                <p>目前支援連結到：Claude Desktop, Cursor, VS Code Copilot, Appflowy, Windsurf 等多種 AI 助手。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How to Use -->
      <section class="help-section card animate-in" style="animation-delay: 0.15s">
        <h2 class="section-title">🚀 主要功能</h2>
        <div class="section-body">
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <div>
                <strong>Dashboard</strong>
                <p>一目了然地查看已安裝 Skills 的統計數據，包括總數、全域/專案分佈和連接的 Agents 數量。</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📋</span>
              <div>
                <strong>Skills 列表</strong>
                <p>瀏覽所有已安裝的 Skills。支援按名稱搜尋、按範圍篩選，以及按名稱、安裝時間或 Agents 數量排序。</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📖</span>
              <div>
                <strong>Skill 詳情</strong>
                <p>點擊任一 Skill 查看完整的 SKILL.md 內容、metadata、連接的 Agents 和安全評估。</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🛒</span>
              <div>
                <strong>安裝 Skills</strong>
                <p>輸入 GitHub 倉庫路徑（如 <code>angular/angular</code>）即可快速安裝 Skills。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CLI Reference -->
      <section class="help-section card animate-in" style="animation-delay: 0.15s">
        <h2 class="section-title">💻 CLI 指令參考</h2>
        <div class="section-body">
          <p>Skills Manager 使用 <code>npx skills</code> CLI 工具執行安裝/移除操作。你也可以直接在終端使用這些指令：</p>
          <div class="cmd-table">
            <div class="cmd-row">
              <code class="cmd">npx skills add &lt;owner/repo&gt; -g</code>
              <span class="cmd-desc">從 GitHub 全域安裝 Skills</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">npx skills remove &lt;name&gt; -g</code>
              <span class="cmd-desc">全域移除指定 Skill</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">npx skills ls -g</code>
              <span class="cmd-desc">列出所有全域安裝的 Skills</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">npx skills find &lt;keyword&gt;</code>
              <span class="cmd-desc">搜尋可用的 Skills</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">npx skills update</code>
              <span class="cmd-desc">更新所有已安裝的 Skills</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">npx skills init &lt;name&gt;</code>
              <span class="cmd-desc">建立新的 SKILL.md</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Popular Repos -->
      <section class="help-section card animate-in" style="animation-delay: 0.2s">
        <h2 class="section-title">🔥 推薦的 Skills 倉庫</h2>
        <div class="section-body">
          <div class="cmd-table">
            <div class="cmd-row">
              <code class="cmd">angular/angular</code>
              <span class="cmd-desc">Angular 官方 — core、compiler、signal-forms、new-app</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">analogjs/angular-skills</code>
              <span class="cmd-desc">AnalogJS — Angular v20+ 完整開發 skills（10 個）</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">vercel-labs/agent-skills</code>
              <span class="cmd-desc">Vercel 精選 AI Agent Skills</span>
            </div>
            <div class="cmd-row">
              <code class="cmd">microsoft/skills</code>
              <span class="cmd-desc">Microsoft 官方 Agent Skills</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="help-section card animate-in" style="animation-delay: 0.25s">
        <h2 class="section-title">🛠️ 技術架構</h2>
        <div class="section-body">
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-label">前端</span>
              <span class="tech-value">Angular v19+</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">桌面框架</span>
              <span class="tech-value">Tauri v2 (Rust)</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">資料庫</span>
              <span class="tech-value">SQLite (rusqlite)</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">CLI 工具</span>
              <span class="tech-value">npx skills</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">市集</span>
              <span class="tech-value">skills.sh / skillsmp.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .help-page { max-width: 800px; }

    .page-header { margin-bottom: var(--space-lg); }
    .page-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
    .page-subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 13px; }

    .help-section { margin-bottom: var(--space-md); }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 1px solid var(--border);
    }

    .section-body p {
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: var(--space-sm);
    }

    .section-body code {
      background: var(--bg-input);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--accent);
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .feature-item {
      display: flex;
      gap: var(--space-md);
      align-items: flex-start;
    }

    .feature-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }

    .feature-item strong {
      display: block;
      margin-bottom: 2px;
      font-size: 14px;
    }

    .feature-item p {
      margin: 0 !important;
      font-size: 13px;
    }

    .cmd-table {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .cmd-row {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: 10px var(--space-md);
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
    }

    .cmd {
      min-width: 320px;
      font-size: 13px;
      background: var(--bg-input) !important;
      padding: 4px 10px !important;
      border-radius: 4px;
      color: var(--accent-light) !important;
    }

    .cmd-desc {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-md);
    }

    .tech-item { padding: var(--space-sm) 0; }
    .tech-label {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }
    .tech-value { font-size: 14px; font-weight: 500; }
  `]
})
export class HelpComponent { }
