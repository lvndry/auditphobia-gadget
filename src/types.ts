export type Version = `${number}.${number}.${number}`;

export interface Package {
  /** Name of the package */
  name: string;
  /** version of the package. MAJOR.MINOR.PATCH */
  version: Version;
}

/** https://yarnpkg.com/api/interfaces/plugin_npm_cli.auditadvisory.html */
export interface AuditAdvisoryData {
  resolution: {
    id: number;
    path: string;
    dev: boolean;
    optional: boolean;
    bundled: boolean;
  };
  advisory: {
    access: string;
    created: string;
    cves: string[];
    cvss: unknown | null;
    cwe: string;
    deleted: boolean | null;
    findings: { version: Version; path: string[] }[];
    found_by: { name: string } | null;
    github_advisory_id: string;
    id: number;
    metadata: unknown | null;
    module_name: string;
    npm_advisory_id: string;
    overview: string;
    patched_versions: string;
    title: string;
    recommendation: string;
    references: string;
    reported_by: { name: string } | null;
    severity: string;
    updated: string;
    url: string;
    vulnerable_versions: string;
  };
}

export interface AuditAdvisory {
  type: "auditAdvisory";
  data: AuditAdvisoryData;
}

export interface AuditSummaryData {
  vulnerabilites: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  dependencies: number;
  devDependencies: number;
  optionalDependencies: number;
  totalDependencies: number;
}

export interface AuditSummary {
  type: "auditSummary";
  data: AuditSummaryData;
}

export type Audit = AuditAdvisory | AuditSummary;
