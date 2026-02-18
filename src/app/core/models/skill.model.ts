export interface Skill {
  id: number | null;
  name: string;
  description: string;
  author: string;
  version: string;
  license: string;
  source_repo: string;
  install_path: string;
  scope: string;
  installed_at: string;
  updated_at: string;
  agents: string[];
  security: SecurityAssessment[];
}

export interface SecurityAssessment {
  provider: string;
  level: string;
  alerts: number;
}

export interface SkillDetail {
  skill: Skill;
  markdown: string;
}

export interface InstallResult {
  success: boolean;
  message: string;
  output: string;
}

export interface Stats {
  total: number;
  global: number;
  project: number;
  agents: number;
}

export interface ScanPath {
  id: number | null;
  path: string;
  path_type: string;
}
