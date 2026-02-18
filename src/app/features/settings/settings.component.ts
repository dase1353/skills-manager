import { Component, OnInit, signal } from '@angular/core';
import { SkillsService } from '../../core/services/skills.service';
import { ScanPath, AgentSetting } from '../../core/models/skill.model';
import { invoke } from '@tauri-apps/api/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="settings-page">
      <header class="page-header animate-in">
        <h1 class="page-title">設定</h1>
        <p class="page-subtitle">管理掃描路徑和應用設定</p>
      </header>

      <!-- Scan Paths -->
      <section class="settings-section card animate-in" style="animation-delay: 0.05s">
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-cyan">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          掃描路徑
        </h2>
        <p class="section-desc">Skills Manager 會在以下路徑中搜尋已安裝的 Skills</p>

        @if (scanPaths().length > 0) {
          <div class="paths-list">
            @for (sp of scanPaths(); track sp.path) {
              <div class="path-item">
                <div class="path-info">
                  <svg class="icon-svg icon-svg-sm" style="color: var(--text-muted)" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span class="path-text">{{ sp.path }}</span>
                  <span class="badge badge-scope">{{ sp.path_type }}</span>
                </div>
                <button class="btn-open" (click)="openPath(sp.path)" title="在檔案總管中開啟">
                  <svg class="icon-svg" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  開啟
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="empty-msg">尚無掃描路徑設定</div>
        }
      </section>

      <!-- Agent Linking Settings -->
      <section class="settings-section card animate-in" style="animation-delay: 0.1s">
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-amber">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>
          </div>
          Agent 連結設定
        </h2>
        <div class="section-actions-row">
          <p class="section-desc">選擇安裝新 Skill 時預設要連結哪些 AI Agents</p>
          <button class="btn-refresh-defaults" (click)="resetDefaults()" title="重設為官方預設 Agent 清單">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            重設預設值
          </button>
        </div>

        <div class="agents-list">
          @for (agent of agentSettings(); track agent.agent_id) {
            <div class="agent-setting-item">
              <div class="agent-info">
                <span class="agent-name">{{ agent.display_name }}</span>
                <code class="agent-id">{{ agent.agent_id }}</code>
              </div>
              <label class="switch">
                <input type="checkbox" 
                       [ngModel]="agent.enabled" 
                       (ngModelChange)="toggleAgent(agent.agent_id, $event)">
                <span class="slider"></span>
              </label>
            </div>
          }
        </div>
      </section>

      <!-- About -->
      <section class="settings-section card animate-in" style="animation-delay: 0.15s">
        <h2 class="section-title">
          <div class="icon-box icon-box-sm icon-box-violet">
            <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          關於
        </h2>
        <div class="about-grid">
          <div class="about-item">
            <span class="about-label">應用名稱</span>
            <span class="about-value">Skills Manager</span>
          </div>
          <div class="about-item">
            <span class="about-label">版本</span>
            <span class="about-value">0.2.0</span>
          </div>
          <div class="about-item">
            <span class="about-label">前端</span>
            <span class="about-value">Angular v21+</span>
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
    .settings-page { width: 100%; }

    .page-header { margin-bottom: var(--space-lg); }
    .page-title {
      font-size: 28px;
      font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .page-subtitle { color: var(--text-muted); font-size: 14px; }

    .settings-section { margin-bottom: var(--space-xl); }

    .section-title {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: var(--space-xs);
      color: var(--text-primary);
    }

    .section-desc {
      color: var(--text-muted);
      font-size: 13px;
      margin-bottom: 0;
    }

    .section-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
      padding-left: 40px;
    }

    .btn-refresh-defaults {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-refresh-defaults .icon-svg { width: 14px; height: 14px; }
    .btn-refresh-defaults:hover {
      background: var(--bg-input);
      border-color: var(--text-muted);
      color: var(--text-primary);
    }

    .paths-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      padding-left: 40px;
    }

    .agents-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-md);
      padding-left: 40px;
    }

    .agent-setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      transition: all var(--transition-fast);
    }
    .agent-setting-item:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-light);
    }
    .agent-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .agent-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }
    .agent-id {
      font-size: 11px;
      color: var(--text-muted);
    }
    .path-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px var(--space-md);
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      transition: all var(--transition-fast);
    }
    .path-item:hover {
      border-color: var(--border-light);
      background: var(--bg-card-hover);
    }

    .path-info {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
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

    .btn-open {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-family: var(--font-family);
      font-size: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }
    .btn-open .icon-svg { width: 14px; height: 14px; }
    .btn-open:hover {
      background: var(--primary-soft);
      border-color: var(--primary);
      color: var(--primary-light);
    }

    .about-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .about-item {
      padding: var(--space-sm);
      border-radius: var(--radius-sm);
      transition: background var(--transition-fast);
    }
    .about-item:hover {
      background: rgba(255, 255, 255, 0.02);
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
  agentSettings = signal<AgentSetting[]>([]);

  constructor(private service: SkillsService) { }

  async ngOnInit() {
    const [paths, agents] = await Promise.all([
      this.service.getScanPaths(),
      this.service.getAgentSettings()
    ]);
    this.scanPaths.set(paths);
    this.agentSettings.set(agents);
  }

  async openPath(path: string) {
    try {
      await invoke('open_path', { path });
    } catch (e) {
      console.error('Failed to open path:', e);
    }
  }

  async toggleAgent(agentId: string, enabled: boolean) {
    // Optimistic update
    this.agentSettings.update(agents =>
      agents.map(a => a.agent_id === agentId ? { ...a, enabled } : a)
    );

    await this.service.updateAgentSetting(agentId, enabled);
  }

  async resetDefaults() {
    if (confirm('確定要重設為官方預設 Agent 清單嗎？這將會覆蓋您目前的設定。')) {
      await this.service.resetAgentSettings();
      const agents = await this.service.getAgentSettings();
      this.agentSettings.set(agents);
    }
  }
}
