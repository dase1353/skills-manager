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
          <span class="cli-banner-icon">⚠️</span>
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
      <aside class="sidebar glass">
        <div class="sidebar-brand">
          <div class="brand-icon">⚡</div>
          <span class="brand-text">Skills Manager</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span class="nav-label">Dashboard</span>
          </a>
          <a routerLink="/skills" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📋</span>
            <span class="nav-label">Skills</span>
          </a>
          <a routerLink="/install" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🛒</span>
            <span class="nav-label">安裝</span>
          </a>
          <a routerLink="/help" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📖</span>
            <span class="nav-label">說明</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">⚙️</span>
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
      background: rgba(210, 153, 34, 0.12);
      border-bottom: 1px solid rgba(210, 153, 34, 0.3);
      padding: 10px var(--space-lg);
    }

    .cli-banner-content {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      max-width: 1200px;
      margin: 0 auto;
    }

    .cli-banner-icon {
      font-size: 20px;
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
      width: 220px;
      min-width: 220px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      background: var(--bg-surface);
      z-index: 10;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-lg) var(--space-md);
      border-bottom: 1px solid var(--border);
    }

    .brand-icon {
      font-size: 22px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      border-radius: var(--radius-sm);
    }

    .brand-text {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-sm);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: var(--bg-card);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: rgba(123, 31, 162, 0.15);
      color: var(--primary-light);
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .sidebar-footer {
      padding: var(--space-md);
      border-top: 1px solid var(--border);
    }

    .version-badge {
      display: inline-block;
      padding: 2px 8px;
      background: var(--bg-card);
      border-radius: 100px;
      font-size: 11px;
      color: var(--text-muted);
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
