import { Component, OnInit, signal } from '@angular/core';
import { SkillsService } from '../../core/services/skills.service';
import { ScanPath } from '../../core/models/skill.model';

@Component({
    selector: 'app-settings',
    standalone: true,
    template: `
    <div class="settings-page">
      <header class="page-header animate-in">
        <h1 class="page-title">設定</h1>
        <p class="page-subtitle">管理掃描路徑和應用設定</p>
      </header>

      <!-- Scan Paths -->
      <section class="settings-section card animate-in" style="animation-delay: 0.05s">
        <h2 class="section-title">📂 掃描路徑</h2>
        <p class="section-desc">Skills Manager 會在以下路徑中搜尋已安裝的 Skills</p>

        @if (scanPaths().length > 0) {
          <div class="paths-list">
            @for (sp of scanPaths(); track sp.path) {
              <div class="path-item">
                <div class="path-info">
                  <span class="path-text">{{ sp.path }}</span>
                  <span class="badge badge-scope">{{ sp.path_type }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-msg">尚無掃描路徑設定</div>
        }
      </section>

      <!-- About -->
      <section class="settings-section card animate-in" style="animation-delay: 0.15s">
        <h2 class="section-title">ℹ️ 關於</h2>
        <div class="about-grid">
          <div class="about-item">
            <span class="about-label">應用名稱</span>
            <span class="about-value">Skills Manager</span>
          </div>
          <div class="about-item">
            <span class="about-label">版本</span>
            <span class="about-value">0.1.0</span>
          </div>
          <div class="about-item">
            <span class="about-label">前端</span>
            <span class="about-value">Angular v19+</span>
          </div>
          <div class="about-item">
            <span class="about-label">後端</span>
            <span class="about-value">Tauri v2 + Rust</span>
          </div>
          <div class="about-item">
            <span class="about-label">資料庫</span>
            <span class="about-value">SQLite (rusqlite)</span>
          </div>
          <div class="about-item">
            <span class="about-label">CLI 工具</span>
            <span class="about-value">npx skills</span>
          </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .settings-page { max-width: 800px; }

    .page-header { margin-bottom: var(--space-lg); }
    .page-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
    .page-subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 13px; }

    .settings-section { margin-bottom: var(--space-lg); }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-xs);
    }

    .section-desc {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
    }

    .paths-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .path-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-sm) var(--space-md);
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
    }

    .path-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .path-text {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-secondary);
    }

    .empty-msg {
      color: var(--text-muted);
      font-size: 13px;
      text-align: center;
      padding: var(--space-lg);
    }

    .about-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .about-item {
      padding: var(--space-sm) 0;
    }

    .about-label {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }

    .about-value {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class SettingsComponent implements OnInit {
    scanPaths = signal<ScanPath[]>([]);

    constructor(private service: SkillsService) { }

    async ngOnInit() {
        const paths = await this.service.getScanPaths();
        this.scanPaths.set(paths);
    }
}
