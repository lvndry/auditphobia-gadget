# Auditphobia Gadget 🧐

Core tool used by [Auditphobia](https://github.com/lvndry/auditphobia) to get the vulnerabilities of a npm package

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
    console.log(audit); // [{ type: 'auditAdvisory', ... }]
  } catch (err) {
    // handle error
  }
};
```
