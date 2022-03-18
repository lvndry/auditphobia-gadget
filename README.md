# Inspecteur Gadget

Returns the output of `yarn audit --json` of npm packages

## Get started

```bash
yarn add auditphobia-gadget
# or
npm install auditphobia-gadget
```

## Usage

```ts
import { generatePacakgeAudit } from "auditphobia-gadget";

const myFunction = async () => {
  try {
    const audit = await generatePacakgeAudit({
      name: "package-name",
      version: "package-version",
    });
    console.log(audit);
  } catch (err) {
    console.error(err);
  }
};
```
