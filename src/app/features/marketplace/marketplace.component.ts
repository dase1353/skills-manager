import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkillsService } from '../../core/services/skills.service';
import { InstallResult } from '../../core/models/skill.model';

@Component({
    selector: 'app-marketplace',
    standalone: true,
    imports: [FormsModule],
    template: `
    <div class="marketplace-page">
      <header class="page-header animate-in">
        <h1 class="page-title">安裝 Skills</h1>
        <p class="page-subtitle">從 GitHub 倉庫安裝 Agent Skills</p>
      </header>

      <!-- Install Form -->
      <div class="install-form card animate-in" style="animation-delay: 0.05s">
        <h2 class="form-title">從 GitHub 安裝</h2>
        <p class="form-desc">輸入 GitHub 倉庫路徑（例如 <code>angular/angular</code> 或 <code>analogjs/angular-skills</code>）</p>

        <div class="form-row">
          <div class="input-group" style="flex: 1">
            <span class="icon">📦</span>
            <input type="text"
                   placeholder="owner/repo"
                   [ngModel]="repoInput()"
                   (ngModelChange)="repoInput.set($event)"
                   (keydown.enter)="install()" />
          </div>
          <div class="scope-toggle">
            <label class="toggle-label">
              <input type="checkbox"
                     [ngModel]="globalScope()"
                     (ngModelChange)="globalScope.set($event)" />
              <span class="toggle-text">全域安裝</span>
            </label>
          </div>
          <button class="btn btn-primary"
                  (click)="install()"
                  [disabled]="installing() || !repoInput()">
            {{ installing() ? '安裝中...' : '🚀 安裝' }}
          </button>
        </div>

        @if (installing()) {
          <div class="progress-bar">
            <div class="progress-inner"></div>
          </div>
        }
      </div>

      <!-- Result -->
      @if (result()) {
        <div class="result-card card animate-in"
             [class.result-success]="result()!.success"
             [class.result-error]="!result()!.success">
          <div class="result-header">
            <span class="result-icon">{{ result()!.success ? '✅' : '❌' }}</span>
            <span class="result-msg">{{ result()!.message }}</span>
          </div>
          @if (result()!.output) {
            <details class="result-output">
              <summary>查看詳細輸出</summary>
              <pre>{{ result()!.output }}</pre>
            </details>
          }
        </div>
      }

      <!-- Popular Repos -->
      <section class="popular-section animate-in" style="animation-delay: 0.15s">
        <h2 class="section-title">🔥 熱門 Skills 倉庫</h2>
        <div class="repo-grid">
          @for (repo of popularRepos; track repo.name) {
            <div class="repo-card card card-clickable" (click)="repoInput.set(repo.name)">
              <div class="repo-name">{{ repo.name }}</div>
              <p class="repo-desc">{{ repo.desc }}</p>
              <div class="repo-meta">
                <span class="repo-skills">📦 {{ repo.skills }} skills</span>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
    styles: [`
    .marketplace-page { max-width: 900px; }

    .page-header { margin-bottom: var(--space-lg); }
    .page-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
    .page-subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 13px; }

    .install-form { margin-bottom: var(--space-lg); }
    .form-title { font-size: 16px; font-weight: 600; margin-bottom: var(--space-xs); }
    .form-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: var(--space-md); }
    .form-desc code {
      background: var(--bg-input);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 12px;
    }

    .form-row {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .scope-toggle {
      display: flex;
      align-items: center;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      cursor: pointer;
      font-size: 13px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .toggle-label input[type="checkbox"] {
      accent-color: var(--primary);
    }

    .progress-bar {
      margin-top: var(--space-md);
      height: 3px;
      background: var(--bg-input);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-inner {
      height: 100%;
      width: 30%;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      border-radius: 3px;
      animation: progressSlide 1.5s ease infinite;
    }

    @keyframes progressSlide {
      0% { width: 0%; margin-left: 0; }
      50% { width: 60%; margin-left: 20%; }
      100% { width: 0%; margin-left: 100%; }
    }

    .result-card { margin-bottom: var(--space-lg); }
    .result-success { border-color: var(--success); }
    .result-error { border-color: var(--error); }

    .result-header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-weight: 500;
    }

    .result-output {
      margin-top: var(--space-md);
    }

    .result-output summary {
      cursor: pointer;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .result-output pre {
      margin-top: var(--space-sm);
      padding: var(--space-md);
      background: var(--bg-input);
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 11px;
      white-space: pre-wrap;
      max-height: 300px;
      overflow-y: auto;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-md);
    }

    .repo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: var(--space-md);
    }

    .repo-card {
      padding: var(--space-md) !important;
    }

    .repo-name {
      font-weight: 600;
      font-size: 14px;
      font-family: var(--font-mono);
      margin-bottom: var(--space-xs);
    }

    .repo-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: var(--space-sm);
    }

    .repo-meta {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class MarketplaceComponent {
    repoInput = signal('');
    globalScope = signal(true);
    installing = signal(false);
    result = signal<InstallResult | null>(null);

    popularRepos = [
        { name: 'angular/angular', desc: 'Angular 官方 skills — core, compiler, signal-forms, new-app', skills: 4 },
        { name: 'analogjs/angular-skills', desc: 'AnalogJS 的 Angular v20+ 開發 skills 全套', skills: 10 },
        { name: 'vercel-labs/agent-skills', desc: 'Vercel 精選 AI Agent Skills 集合', skills: 8 },
        { name: 'microsoft/skills', desc: 'Microsoft 官方 Agent Skills', skills: 5 },
        { name: 'remotion-dev/skills', desc: 'Remotion 影片製作 Agent Skills', skills: 3 },
    ];

    constructor(private service: SkillsService) { }

    async install() {
        const repo = this.repoInput().trim();
        if (!repo) return;

        this.installing.set(true);
        this.result.set(null);

        const result = await this.service.installSkill(repo, this.globalScope());
        this.result.set(result);
        this.installing.set(false);
    }
}
