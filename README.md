# Inspecteur Gadget 🧐

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
      name: "auditphobia",
      version: "1.0.0",
    });
    // [{ type: 'auditAdvisory', ... }]
  } catch (err) {
    // handle error
  }
};
```

## Features

- JSON output
