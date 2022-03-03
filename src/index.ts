import { exec } from "child_process";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile, rm } from "fs/promises";
import { resolve } from "path";
import { promisify } from "util";

const exec_async = promisify(exec);

interface Package {
  name: string;
  version: string;
}

export const createAudit = async (auditedPackage: Package) => {
  let packageID = randomUUID();
  while (existsSync(packageID)) {
    packageID = randomUUID();
  }

  try {
    await mkdir(packageID);
  } catch (err) {
    throw err;
  }

  const process_dir = process.cwd();
  const dirPath = resolve(process_dir, packageID);
  process.chdir(dirPath);
  const PACKAGE_JSON_FILE_NAME = "package.json";

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
    await rm(packageID, { recursive: true });

    return stdout;
  } catch (err) {
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
