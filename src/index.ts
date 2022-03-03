import { exec } from "child_process";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile, rm } from "fs/promises";
import { resolve } from "path";
import { promisify } from "util";

const exec_async = promisify(exec);

export type Version = `${number}.${number}.${number}`;

export interface Package {
  name: string;
  version: Version;
}

const createPackageDirectory = async (): Promise<string> => {
  let packageID = randomUUID();
  while (existsSync(packageID)) {
    packageID = randomUUID();
  }

  try {
    await mkdir(packageID);
    return packageID;
  } catch (err) {
    throw err;
  }
};

export const createAudit = async (auditedPackage: Package) => {
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
    await exec_async("yarn --lock-file");
    const { stdout } = await exec_async("yarn audit --json");
    process.chdir(process_dir);
    await rm(packageID, { recursive: true });

    return stdout;
  } catch (err) {
    process.chdir(process_dir);
    // yarn audit returns a non-zero exit code if vulnerabilites are found
    // https://classic.yarnpkg.com/lang/en/docs/cli/audit/#toc-yarn-audit
    await rm(packageID, { recursive: true });
    const { stdout, stderr } = err as { stdout: string; stderr: string };

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout;
  }
};
