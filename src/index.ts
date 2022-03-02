import { exec } from "child_process";
import { error } from "console";
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
    error(err);
  }

  const process_dir = process.cwd();
  const dirPath = resolve(process_dir, packageID);
  process.chdir(dirPath);

  await writeFile(
    "package.json",
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
    await rm(packageID, { recursive: true });
    const { stdout, stderr } = err as { stdout: string; stderr: string };

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout;
  }
};
