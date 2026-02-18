import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SkillsService } from './core/services/skills.service';
import { invoke } from '@tauri-apps/api/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Skills CLI missing banner -->
    @if (skillsCliMissing()) {
      <div class="cli-banner">
        <div class="cli-banner-content">
          <div class="cli-banner-icon icon-box icon-box-sm icon-box-amber">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <strong>未偵測到 skills CLI 工具</strong>
            <p>安裝/移除功能需要 <code>skills</code> 套件。請執行 <code>npm install -g skills</code> 安裝。</p>
          </div>
          <button class="btn btn-secondary btn-sm" (click)="dismissBanner()">關閉</button>
        </div>
      </div>
    }

    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <svg class="icon-svg" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span class="brand-text">Skills Manager</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <span class="nav-label">Dashboard</span>
          </a>
          <a routerLink="/skills" routerLinkActive="active" class="nav-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            <span class="nav-label">Skills</span>
          </a>
          <a routerLink="/install" routerLinkActive="active" class="nav-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span class="nav-label">安裝</span>
          </a>
          <a routerLink="/help" routerLinkActive="active" class="nav-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span class="nav-label">說明</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <span class="nav-label">設定</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="version-badge">v0.1.0</div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .cli-banner {
      background: rgba(234, 179, 8, 0.08);
      border-bottom: 1px solid rgba(234, 179, 8, 0.2);
      padding: 10px var(--space-lg);
    }

    .cli-banner-content {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      max-width: 1200px;
      margin: 0 auto;
    }

    .cli-banner-content p {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .cli-banner-content code {
      background: var(--bg-input);
      padding: 1px 5px;
      border-radius: 3px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--warning);
    }

    .cli-banner-content strong {
      font-size: 13px;
      color: var(--warning);
    }

    .btn-sm {
      padding: 4px 12px;
      font-size: 12px;
      margin-left: auto;
    }

    .app-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 230px;
      min-width: 230px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      background: var(--bg-surface);
      z-index: 10;
      position: relative;
    }

    .sidebar::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(to bottom, var(--primary), transparent);
      opacity: 0.15;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: var(--space-lg) var(--space-md);
      border-bottom: 1px solid var(--border);
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient-primary);
      border-radius: var(--radius-sm);
      color: white;
      box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
    }

    .brand-icon .icon-svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
      stroke: none;
    }

    .brand-text {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-sm) 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: var(--space-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-base);
      cursor: pointer;
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--primary-soft);
      color: var(--primary-light);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: var(--gradient-primary);
    }

    .nav-item .icon-svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: var(--space-md);
      border-top: 1px solid var(--border);
    }

    .version-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      background: var(--bg-card);
      border-radius: 100px;
      font-size: 11px;
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-xl);
      background: var(--bg-dark);
    }
  `]
})
export class AppComponent implements OnInit {
  skillsCliMissing = signal(false);

  constructor(private skillsService: SkillsService) { }

  async ngOnInit() {
    // Check if skills CLI is available
    try {
      const installed = await invoke<boolean>('check_skills_cli');
      if (!installed) {
        this.skillsCliMissing.set(true);
      }
    } catch {
      this.skillsCliMissing.set(true);
    }

    // Scan skills
    await this.skillsService.scanSkills();
  }

  dismissBanner() {
    this.skillsCliMissing.set(false);
  }
}
