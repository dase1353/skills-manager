import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillsService } from '../../core/services/skills.service';
import { Skill } from '../../core/models/skill.model';

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="skills-page">
      <header class="page-header animate-in">
        <div>
          <h1 class="page-title">Skills 列表</h1>
          <p class="page-subtitle">管理你的 {{ service.skills().length }} 個已安裝 Skills</p>
        </div>
      </header>

      <!-- Search & Filter Bar -->
      <div class="toolbar animate-in" style="animation-delay: 0.05s">
        <div class="input-group search-box">
          <span class="icon">🔍</span>
          <input type="text"
                 placeholder="搜尋 skills..."
                 [ngModel]="searchQuery()"
                 (ngModelChange)="searchQuery.set($event)" />
        </div>
        <div class="filter-group">
          <button class="filter-btn"
                  [class.active]="scopeFilter() === 'all'"
                  (click)="scopeFilter.set('all')">全部</button>
          <button class="filter-btn"
                  [class.active]="scopeFilter() === 'global'"
                  (click)="scopeFilter.set('global')">🌐 全域</button>
          <button class="filter-btn"
                  [class.active]="scopeFilter() === 'project'"
                  (click)="scopeFilter.set('project')">📁 專案</button>
        </div>
        <div class="sort-group">
          <select [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)"
                  class="sort-select">
            <option value="name">名稱</option>
            <option value="installed_at">安裝時間</option>
            <option value="agents">Agents 數量</option>
          </select>
        </div>
      </div>

      <!-- Skills List -->
      @if (service.loading()) {
        <div class="list-container card">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton-row skeleton"></div>
          }
        </div>
      } @else if (filteredSkills().length === 0) {
        <div class="empty-state">
          <span class="icon">🔍</span>
          <p>找不到符合條件的 Skills</p>
        </div>
      } @else {
        <div class="list-container card animate-in" style="animation-delay: 0.1s">
          <!-- Table Header -->
          <div class="list-header">
            <span class="col-name">名稱</span>
            <span class="col-author">作者</span>
            <span class="col-scope">範圍</span>
            <span class="col-agents">Agents</span>
            <span class="col-security">安全</span>
          </div>

          <!-- Table Rows -->
          @for (skill of filteredSkills(); track skill.name; let i = $index) {
            <div class="list-row" (click)="viewSkill(skill)" [class.alt]="i % 2 === 1">
              <div class="col-name">
                <span class="skill-name">{{ skill.name }}</span>
                @if (skill.description) {
                  <span class="skill-desc">{{ skill.description }}</span>
                }
              </div>
              <span class="col-author">{{ skill.author || '—' }}</span>
              <span class="col-scope">
                <span class="badge badge-scope">{{ skill.scope }}</span>
              </span>
              <span class="col-agents">
                <span class="agents-count" [title]="skill.agents.join(', ')">
                  🤖 {{ skill.agents.length }}
                </span>
              </span>
              <span class="col-security">
                @for (sec of skill.security; track sec.provider) {
                  <span class="badge"
                        [class.badge-safe]="sec.level === 'Safe'"
                        [class.badge-low]="sec.level === 'Low Risk'"
                        [class.badge-med]="sec.level === 'Med Risk'"
                        [class.badge-critical]="sec.level === 'Critical Risk'">
                    {{ sec.level }}
                  </span>
                }
                @if (skill.security.length === 0) {
                  <span class="no-data">—</span>
                }
              </span>
            </div>
          }
        </div>

        <div class="list-footer animate-in" style="animation-delay: 0.15s">
          共 {{ filteredSkills().length }} 個 Skills
        </div>
      }
    </div>
  `,
  styles: [`
    .skills-page { max-width: 1100px; }

    .page-header { margin-bottom: var(--space-lg); }
    .page-title { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
    .page-subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 13px; }

    .toolbar {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .search-box { flex: 1; max-width: 360px; }

    .filter-group {
      display: flex;
      gap: 2px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 2px;
    }

    .filter-btn {
      padding: 6px 14px;
      background: none;
      border: none;
      border-radius: 4px;
      color: var(--text-secondary);
      font-family: var(--font-family);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .filter-btn:hover { color: var(--text-primary); }
    .filter-btn.active { background: var(--primary); color: white; }

    .sort-select {
      padding: 8px 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-family: var(--font-family);
      font-size: 12px;
      outline: none;
      cursor: pointer;
    }

    /* ── List Table ── */
    .list-container {
      padding: 0 !important;
      overflow: hidden;
    }

    .list-header {
      display: grid;
      grid-template-columns: 2fr 1fr 80px 80px 120px;
      gap: var(--space-md);
      padding: 10px var(--space-lg);
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .list-row {
      display: grid;
      grid-template-columns: 2fr 1fr 80px 80px 120px;
      gap: var(--space-md);
      align-items: center;
      padding: 12px var(--space-lg);
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.15s;
    }

    .list-row:last-child { border-bottom: none; }
    .list-row:hover { background: var(--bg-card-hover); }
    .list-row.alt { background: rgba(255, 255, 255, 0.015); }
    .list-row.alt:hover { background: var(--bg-card-hover); }

    .col-name {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .skill-name {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary);
    }

    .skill-desc {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .col-author {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .col-scope, .col-agents, .col-security {
      font-size: 12px;
    }

    .agents-count {
      cursor: help;
    }

    .no-data {
      color: var(--text-muted);
    }

    .skeleton-row {
      height: 52px;
      border-bottom: 1px solid var(--border);
    }

    .list-footer {
      text-align: center;
      padding: var(--space-sm);
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class SkillsListComponent implements OnInit {
  searchQuery = signal('');
  scopeFilter = signal<'all' | 'global' | 'project'>('all');
  sortBy = signal<'name' | 'installed_at' | 'agents'>('name');

  filteredSkills = computed(() => {
    let skills = this.service.skills();
    const query = this.searchQuery().toLowerCase();
    const scope = this.scopeFilter();
    const sort = this.sortBy();

    if (query) {
      skills = skills.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.author.toLowerCase().includes(query)
      );
    }

    if (scope !== 'all') {
      skills = skills.filter(s => s.scope === scope);
    }

    return [...skills].sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'installed_at': return b.installed_at.localeCompare(a.installed_at);
        case 'agents': return b.agents.length - a.agents.length;
        default: return 0;
      }
    });
  });

  constructor(
    public service: SkillsService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (this.service.skills().length === 0) {
      await this.service.loadSkills();
    }
  }

  viewSkill(skill: Skill) {
    this.router.navigate(['/skills', skill.name]);
  }
}
