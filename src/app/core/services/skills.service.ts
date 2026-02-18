import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Skill, SkillDetail, InstallResult, Stats, ScanPath, AgentSetting } from '../models/skill.model';

@Injectable({ providedIn: 'root' })
export class SkillsService {
    skills = signal<Skill[]>([]);
    stats = signal<Stats>({ total: 0, global: 0, project: 0, agents: 0 });
    loading = signal(false);
    error = signal<string | null>(null);

    async scanSkills(): Promise<Skill[]> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const skills = await invoke<Skill[]>('scan_skills');
            this.skills.set(skills);
            await this.loadStats();
            return skills;
        } catch (e) {
            this.error.set(String(e));
            return [];
        } finally {
            this.loading.set(false);
        }
    }

    async loadSkills(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const skills = await invoke<Skill[]>('get_all_skills');
            this.skills.set(skills);
        } catch (e) {
            this.error.set(String(e));
        } finally {
            this.loading.set(false);
        }
    }

    async loadStats(): Promise<void> {
        try {
            const stats = await invoke<Stats>('get_stats');
            this.stats.set(stats);
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
    }

    async getSkillDetail(name: string): Promise<SkillDetail | null> {
        try {
            return await invoke<SkillDetail>('get_skill_detail', { name });
        } catch (e) {
            this.error.set(String(e));
            return null;
        }
    }

    async installSkill(repo: string, global: boolean = true, skillName?: string): Promise<InstallResult> {
        this.loading.set(true);
        try {
            const result = await invoke<InstallResult>('install_skill_from_repo', {
                repo,
                global,
                skillName: skillName || null
            });
            if (result.success) {
                await this.scanSkills();
            }
            return result;
        } catch (e) {
            return { success: false, message: String(e), output: '' };
        } finally {
            this.loading.set(false);
        }
    }

    async removeSkill(name: string, global: boolean = true): Promise<InstallResult> {
        this.loading.set(true);
        try {
            const result = await invoke<InstallResult>('remove_skill_cmd', { name, global });
            if (result.success) {
                await this.loadSkills();
                await this.loadStats();
            }
            return result;
        } catch (e) {
            return { success: false, message: String(e), output: '' };
        } finally {
            this.loading.set(false);
        }
    }

    async getScanPaths(): Promise<ScanPath[]> {
        try {
            return await invoke<ScanPath[]>('get_scan_paths');
        } catch (e) {
            return [];
        }
    }

    async getAgentSettings(): Promise<AgentSetting[]> {
        try {
            return await invoke<AgentSetting[]>('get_agent_settings');
        } catch (e) {
            return [];
        }
    }

    async updateAgentSetting(agentId: string, enabled: boolean): Promise<void> {
        try {
            await invoke('update_agent_setting', { agentId, enabled });
        } catch (e) {
            console.error('Failed to update agent setting:', e);
        }
    }

    async resetAgentSettings(): Promise<void> {
        try {
            await invoke('reset_default_agents');
        } catch (e) {
            console.error('Failed to reset agent settings:', e);
        }
    }
}
