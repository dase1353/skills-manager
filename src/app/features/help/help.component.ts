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
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-violet">
            <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          什麼是 Agent Skills？
        </h2>
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
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-cyan">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          安裝與連結機制
        </h2>
        <div class="section-body">
          <p>當你透過本應用程式或是 CLI 安裝 Skill 時，背後會執行以下流程：</p>
          <div class="feature-list">
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-blue">
                <svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div>
                <strong>安裝命令</strong>
                <p>應用程式會呼叫 <code>npx skills add &lt;repo&gt;</code>。這會將 Skill 下載到你的電腦中（全域預設為 <code>~/.agents/skills/</code>）。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-violet">
                <svg class="icon-svg" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <div>
                <strong>自動連結 Agents</strong>
                <p>安裝過程中，<code>skills</code> 工具會自動偵測你電腦中安裝的 AI Agents，並在這些 Agents 的設定目錄中建立符號連結（Symlink）。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-green">
                <svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 4-4 6-2-2-4-4.05-4-6a4 4 0 0 1 4-4z"/><path d="M12 14c3 2.5 6 4.5 6 8H6c0-3.5 3-5.5 6-8z"/></svg>
              </div>
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
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-green">
            <svg class="icon-svg" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          主要功能
        </h2>
        <div class="section-body">
          <div class="feature-list">
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-violet">
                <svg class="icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </div>
              <div>
                <strong>Dashboard</strong>
                <p>一目了然地查看已安裝 Skills 的統計數據，包括總數、全域/專案分佈和連接的 Agents 數量。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-cyan">
                <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <strong>Skills 列表</strong>
                <p>瀏覽所有已安裝的 Skills。支援按名稱搜尋、按範圍篩選，以及按名稱、安裝時間或 Agents 數量排序。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-blue">
                <svg class="icon-svg" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div>
                <strong>Skill 詳情</strong>
                <p>點擊任一 Skill 查看完整的 SKILL.md 內容、metadata、連接的 Agents 和安全評估。</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="icon-box icon-box-sm icon-box-amber">
                <svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
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
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-blue">
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </div>
          CLI 指令參考
        </h2>
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
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-amber">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          </div>
          推薦的 Skills 倉庫
        </h2>
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
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-cyan">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          技術架構
        </h2>
        <div class="section-body">
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-label">前端</span>
              <span class="tech-value">Angular v21+</span>
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
    .help-page { width: 100%; }

    .page-header { margin-bottom: var(--space-lg); }
    .page-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .page-subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 13px; }

    .help-section { margin-bottom: var(--space-md); }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
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
      color: var(--accent-light);
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
      padding: var(--space-sm);
      border-radius: var(--radius-sm);
      transition: background var(--transition-fast);
    }
    .feature-item:hover {
      background: rgba(255, 255, 255, 0.02);
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
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .cmd-row {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: 10px var(--space-md);
      background: var(--bg-surface);
      transition: background var(--transition-fast);
    }
    .cmd-row:hover {
      background: var(--bg-card-hover);
    }

    .cmd {
      min-width: 320px;
      font-size: 13px;
      background: var(--bg-input) !important;
      padding: 4px 10px !important;
      border-radius: 4px;
      color: var(--accent-light) !important;
      border: 1px solid var(--border) !important;
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
