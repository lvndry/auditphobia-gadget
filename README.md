# Inspecteur Gadget

Tool that returns the output of `yarn audit` of npm packages

## Get started

```bash
yarn add inspecteur-gadget
# or
npm install inspecteur-gadget
```

## Usage

```ts
import { createAudit } from "inspecteur-gadget";

const myFunction = async () => {
  try {
    const audit = await createAudit({
      name: "create-react-app",
      version: "5.0.0",
    });
    console.log(audit);
  } catch (err) {
    console.error(err);
  }
};
```
