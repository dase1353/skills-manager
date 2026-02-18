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
            <span [class.spinning]="service.loading()">🔄</span>
            掃描
          </button>
          <button class="btn btn-primary" (click)="goToInstall()">
            ➕ 安裝新 Skill
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card card animate-in stagger-1">
          <div class="stat-icon purple">📦</div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().total }}</span>
            <span class="stat-label">總計 Skills</span>
          </div>
        </div>
        <div class="stat-card card animate-in stagger-2">
          <div class="stat-icon cyan">🌐</div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().global }}</span>
            <span class="stat-label">全域安裝</span>
          </div>
        </div>
        <div class="stat-card card animate-in stagger-3">
          <div class="stat-icon green">📁</div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().project }}</span>
            <span class="stat-label">專案安裝</span>
          </div>
        </div>
        <div class="stat-card card animate-in stagger-4">
          <div class="stat-icon orange">🤖</div>
          <div class="stat-info">
            <span class="stat-value">{{ service.stats().agents }}</span>
            <span class="stat-label">Agents 連接</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <section class="quick-actions animate-in" style="animation-delay: 0.25s">
        <h2 class="section-title">快速操作</h2>
        <div class="actions-grid">
          <div class="action-card card card-clickable" (click)="goTo('/skills')">
            <span class="action-icon">📋</span>
            <div>
              <span class="action-title">瀏覽 Skills</span>
              <span class="action-desc">查看和管理已安裝的 Skills</span>
            </div>
          </div>
          <div class="action-card card card-clickable" (click)="goTo('/install')">
            <span class="action-icon">🛒</span>
            <div>
              <span class="action-title">安裝新 Skill</span>
              <span class="action-desc">從 GitHub 倉庫安裝 Skills</span>
            </div>
          </div>
          <div class="action-card card card-clickable" (click)="goTo('/help')">
            <span class="action-icon">📖</span>
            <div>
              <span class="action-title">使用說明</span>
              <span class="action-desc">了解如何使用 Skills Manager</span>
            </div>
          </div>
          <div class="action-card card card-clickable" (click)="goTo('/settings')">
            <span class="action-icon">⚙️</span>
            <div>
              <span class="action-title">設定</span>
              <span class="action-desc">掃描路徑與應用設定</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1100px; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-xl);
    }

    .page-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.03em;
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

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      font-size: 22px;
    }

    .stat-icon.purple { background: rgba(123, 31, 162, 0.15); }
    .stat-icon.cyan { background: rgba(0, 188, 212, 0.15); }
    .stat-icon.green { background: rgba(63, 185, 80, 0.15); }
    .stat-icon.orange { background: rgba(210, 153, 34, 0.15); }

    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 12px;
      margin-top: 4px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-md);
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

    .action-icon {
      font-size: 28px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
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
