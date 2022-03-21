import { exec } from "child_process";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile, rm } from "fs/promises";
import { resolve } from "path";
import { promisify } from "util";

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
    cvss: { score: number; vectorString: string } | null;
    cwe: string[];
    deleted: boolean | null;
    findings: { version: Version; path: string[] }[];
    found_by: { name: string } | null;
    github_advisory_id: string;
    id: number;
    metadata: any | null;
    module_name: string;
    npm_advisory_id: string | null;
    overview: string;
    patched_versions: string;
    title: string;
    recommendation: string;
    references: string;
    reported_by: { name: string } | null;
    severity: "info" | "low" | "moderate" | "high" | "critical";
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
  vulnerabilities: {
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

const exec_async = promisify(exec);

const createPackageDirectory = async (): Promise<string> => {
  let packageID = randomUUID();
  while (existsSync(packageID)) {
    packageID = randomUUID();
  }

  await mkdir(packageID);
  return packageID;
};

const formatOutput = (output: string): Audit[] => {
  return output
    .split("\n")
    .map((line) => line.replace(/\\n/gm, ""))
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line));
};

export const generatePackageAudit = async (
  auditedPackage: Package
): Promise<Audit[]> => {
  const process_dir = process.cwd();
  const PACKAGE_JSON_FILE_NAME = "package.json";

  const packageID = await createPackageDirectory();

  const packagePath = resolve(process_dir, packageID);
  process.chdir(packagePath);

  await writeFile(
    PACKAGE_JSON_FILE_NAME,
    JSON.stringify({
      name: packageID,
      private: true,
      dependencies: {
        [auditedPackage.name]: auditedPackage.version,
      },
    })
  );

  try {
    await exec_async(
      "yarn install --ignore-scripts --silent --non-interactive"
    );
    const { stdout } = await exec_async("yarn audit --json");

    process.chdir(process_dir);
    await rm(packageID, { recursive: true });

    return formatOutput(stdout);
  } catch (err) {
    // yarn audit returns a non-zero exit code if vulnerabilites are found
    // https://classic.yarnpkg.com/lang/en/docs/cli/audit/#toc-yarn-audit
    process.chdir(process_dir);
    await rm(packageID, { recursive: true });
    const { stdout, stderr } = err as { stdout: string; stderr: string };

    if (stderr) {
      throw new Error(stderr);
    }

    return formatOutput(stdout);
  }
};

(async () => {
  const audit = await generatePackageAudit({
    name: "create-react-app",
    version: "5.0.0",
  });
  console.log(JSON.stringify(audit, null, 2));
})();
