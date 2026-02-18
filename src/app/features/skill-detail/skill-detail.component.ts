import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillsService } from '../../core/services/skills.service';
import { SkillDetail } from '../../core/models/skill.model';
import { marked } from 'marked';

@Component({
  selector: 'app-skill-detail',
  standalone: true,
  template: `
    <div class="detail-page">
      <!-- Back Button -->
      <button class="btn-back" (click)="goBack()">
        <svg class="icon-svg" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        返回列表
      </button>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <span>載入中...</span>
        </div>
      } @else if (detail()) {
        <div class="detail-layout">
          <!-- Header -->
          <header class="detail-header card animate-in">
            <div class="header-accent"></div>
            <div class="header-top">
              <h1 class="detail-name">{{ detail()!.skill.name }}</h1>
              <div class="header-actions">
                <button class="btn btn-danger" (click)="remove()" [disabled]="removing()">
                  <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  {{ removing() ? '移除中...' : '移除' }}
                </button>
              </div>
            </div>
            @if (detail()!.skill.description) {
              <p class="detail-desc">{{ detail()!.skill.description }}</p>
            }

            <div class="meta-grid">
              @if (detail()!.skill.author) {
                <div class="meta-item">
                  <span class="meta-label">作者</span>
                  <span class="meta-value">{{ detail()!.skill.author }}</span>
                </div>
              }
              @if (detail()!.skill.version) {
                <div class="meta-item">
                  <span class="meta-label">版本</span>
                  <span class="meta-value">{{ detail()!.skill.version }}</span>
                </div>
              }
              @if (detail()!.skill.license) {
                <div class="meta-item">
                  <span class="meta-label">授權</span>
                  <span class="meta-value">{{ detail()!.skill.license }}</span>
                </div>
              }
              <div class="meta-item">
                <span class="meta-label">範圍</span>
                <span class="badge badge-scope">{{ detail()!.skill.scope }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">路徑</span>
                <span class="meta-value mono">{{ detail()!.skill.install_path }}</span>
              </div>
            </div>

            <!-- Agents -->
            @if (detail()!.skill.agents.length > 0) {
              <div class="agents-section">
                <span class="meta-label">連接的 Agents</span>
                <div class="agent-tags">
                  @for (agent of detail()!.skill.agents; track agent) {
                    <span class="agent-tag">
                      <span class="agent-dot"></span>
                      {{ agent }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Security -->
            @if (detail()!.skill.security.length > 0) {
              <div class="security-section">
                <span class="meta-label">安全評估</span>
                <div class="security-badges">
                  @for (sec of detail()!.skill.security; track sec.provider) {
                    <div class="security-item">
                      <span class="sec-provider">{{ sec.provider }}</span>
                      <span class="badge"
                            [class.badge-safe]="sec.level === 'Safe'"
                            [class.badge-low]="sec.level === 'Low Risk'"
                            [class.badge-med]="sec.level === 'Med Risk'"
                            [class.badge-critical]="sec.level === 'Critical Risk'">
                        {{ sec.level }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }
          </header>

          <!-- Markdown Content -->
          <section class="content-section card animate-in" style="animation-delay: 0.1s">
            <h2 class="section-title">
              <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              SKILL.md
            </h2>
            <div class="markdown-body" [innerHTML]="renderedMarkdown()"></div>
          </section>

          @if (service.error()) {
            <div class="error-msg animate-in">
              <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ service.error() }}</span>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <svg class="icon-svg" style="width:48px;height:48px;opacity:0.4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p>找不到此 Skill</p>
          <button class="btn btn-primary" (click)="goBack()">返回列表</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-page { width: 100%; }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 0;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-family: var(--font-family);
      font-size: 13px;
      cursor: pointer;
      margin-bottom: var(--space-lg);
      transition: color var(--transition-base);
    }
    .btn-back:hover { color: var(--primary-light); }
    .btn-back .icon-svg { width: 16px; height: 16px; }

    .loading {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-2xl);
      color: var(--text-secondary);
    }

    .detail-header {
      margin-bottom: var(--space-lg);
      position: relative;
      overflow: hidden;
    }

    .header-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient-primary);
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-sm);
      padding-top: var(--space-xs);
    }

    .detail-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .detail-desc {
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
      line-height: 1.6;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .meta-label {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 14px;
      font-weight: 500;
    }

    .mono {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-secondary);
      word-break: break-all;
    }

    .agents-section, .security-section {
      margin-bottom: var(--space-md);
    }

    .agent-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-top: var(--space-xs);
    }

    .agent-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 12px;
      transition: all var(--transition-fast);
    }
    .agent-tag:hover {
      border-color: var(--primary);
      background: var(--primary-soft);
    }

    .agent-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success);
      animation: glowPulse 2s ease-in-out infinite;
    }

    .security-badges {
      display: flex;
      gap: var(--space-md);
      margin-top: var(--space-xs);
    }

    .security-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .sec-provider {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-sm);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--text-secondary);
    }

    .content-section {
      padding: var(--space-xl) !important;
    }

    .error-msg {
      margin-top: var(--space-md);
      padding: var(--space-md);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--radius-sm);
      color: #f87171;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
    }
  `]
})
export class SkillDetailComponent implements OnInit {
  detail = signal<SkillDetail | null>(null);
  loading = signal(true);
  removing = signal(false);
  renderedMarkdown = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: SkillsService
  ) { }

  async ngOnInit() {
    const name = this.route.snapshot.params['name'];
    if (name) {
      const detail = await this.service.getSkillDetail(name);
      if (detail) {
        this.detail.set(detail);
        const html = await marked(detail.markdown || '');
        this.renderedMarkdown.set(html);
      }
    }
    this.loading.set(false);
  }

  goBack() {
    this.router.navigate(['/skills']);
  }

  async remove() {
    const d = this.detail();
    if (!d) return;

    this.removing.set(true);
    const result = await this.service.removeSkill(d.skill.name, d.skill.scope === 'global');
    this.removing.set(false);

    if (result.success) {
      this.router.navigate(['/skills']);
    } else {
      this.service.error.set(result.message || '移除失敗，請稍後再試。');
    }
  }
}
