# Inspecteur Gadget

Tool to return the output of `yarn audit` for any package

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
