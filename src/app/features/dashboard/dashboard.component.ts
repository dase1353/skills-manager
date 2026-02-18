import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SkillsService } from '../../core/services/skills.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <header class="page-header animate-in">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">你的 Agent Skills 概覽</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="refresh()" [disabled]="service.loading()">
            <svg class="icon-svg" [class.spinning]="service.loading()" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            掃描
          </button>
          <button class="btn btn-primary" (click)="goToInstall()">
            <svg class="icon-svg" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            安裝新 Skill
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card card animate-in stagger-1">
          <div class="icon-box icon-box-lg icon-box-violet">
            <svg class="icon-svg icon-svg-lg" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().total }}</span>
            <span class="stat-label">總計 Skills</span>
          </div>
        </div>
        <div class="stat-card card animate-in stagger-2">
          <div class="icon-box icon-box-lg icon-box-cyan">
            <svg class="icon-svg icon-svg-lg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().global }}</span>
            <span class="stat-label">全域安裝</span>
          </div>
        </div>
        <div class="stat-card card animate-in stagger-3">
          <div class="icon-box icon-box-lg icon-box-green">
            <svg class="icon-svg icon-svg-lg" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().project }}</span>
            <span class="stat-label">專案安裝</span>
          </div>
        </div>
        <div class="stat-card card animate-in stagger-4">
          <div class="icon-box icon-box-lg icon-box-amber">
            <svg class="icon-svg icon-svg-lg" viewBox="0 0 24 24"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 4-4 6-2-2-4-4.05-4-6a4 4 0 0 1 4-4z"/><path d="M12 14c3 2.5 6 4.5 6 8H6c0-3.5 3-5.5 6-8z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().agents }}</span>
            <span class="stat-label">Agents 連接</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <section class="quick-actions animate-in stagger-5">
        <h2 class="section-title">快速操作</h2>
        <div class="actions-grid">
          <div class="action-card card card-clickable" (click)="goTo('/skills')">
            <div class="icon-box icon-box-md icon-box-violet">
              <svg class="icon-svg icon-svg-md" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="action-text">
              <span class="action-title">瀏覽 Skills</span>
              <span class="action-desc">查看和管理已安裝的 Skills</span>
            </div>
            <svg class="icon-svg action-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="action-card card card-clickable" (click)="goTo('/install')">
            <div class="icon-box icon-box-md icon-box-cyan">
              <svg class="icon-svg icon-svg-md" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div class="action-text">
              <span class="action-title">安裝新 Skill</span>
              <span class="action-desc">從 GitHub 倉庫安裝 Skills</span>
            </div>
            <svg class="icon-svg action-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="action-card card card-clickable" (click)="goTo('/help')">
            <div class="icon-box icon-box-md icon-box-blue">
              <svg class="icon-svg icon-svg-md" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div class="action-text">
              <span class="action-title">使用說明</span>
              <span class="action-desc">了解如何使用 Skills Manager</span>
            </div>
            <svg class="icon-svg action-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="action-card card card-clickable" (click)="goTo('/settings')">
            <div class="icon-box icon-box-md icon-box-amber">
              <svg class="icon-svg icon-svg-md" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <div class="action-text">
              <span class="action-title">設定</span>
              <span class="action-desc">掃描路徑與應用設定</span>
            </div>
            <svg class="icon-svg action-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard { width: 100%; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-xl);
    }

    .page-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      color: var(--text-secondary);
      margin-top: 4px;
      font-size: 13px;
    }

    .header-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .spinning {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg) !important;
    }

    .stat-value {
      display: block;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .stat-label {
      display: block;
      color: var(--text-secondary);
      font-size: 12px;
      margin-top: 4px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-md);
      color: var(--text-secondary);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg) !important;
    }

    .action-text {
      flex: 1;
      min-width: 0;
    }

    .action-title {
      display: block;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .action-desc {
      display: block;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .action-arrow {
      color: var(--text-muted);
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .action-card:hover .action-arrow {
      color: var(--primary-light);
      transform: translateX(3px);
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(
    public service: SkillsService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (this.service.skills().length === 0) {
      await this.service.scanSkills();
    }
  }

  async refresh() {
    await this.service.scanSkills();
  }

  goToInstall() {
    this.router.navigate(['/install']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
