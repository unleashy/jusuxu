# Jusuxu

**Jusuxu** is a simplistic renderer for JSX, which also works as a templating
engine.

## Usage

### Transpiling JSX

You’ll need to transpile the JSX, with probably either Babel or TypeScript.

For Babel, use [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx):

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "runtime": "automatic",
        "importSource": "jusuxu"
      }
    ]
  ]
}
```

For TypeScript, use this in your config:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "jusuxu"
  }
}
```

### Rendering

Construct a `Renderer` and pass an element to its `render` method. The result
is an HTML string.

```typescript jsx
import { Renderer } from "jusuxu";

function Greet({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}

const renderer = new Renderer();

const html = renderer.render(<Greet name="Emma" />);

console.log(html); // => "<!DOCTYPE html><p>Hello, Emma!</p>"
```

To render a fragment, with no doctype:

```typescript jsx
const html = renderer.renderFragment(<Greet name="Emma" />);

console.log(html); // => "<p>Hello, Emma!</p>"
```

### Integrating with Express

Register the engine plus set your view paths and whatnot:

```typescript
import express from "express";
import { createEngine } from "jusuxu/express"; 

const app = express();

// register jusuxu to tsx files (or jsx if not using TS!)
app.engine("tsx", createEngine());

// set .tsx/.jsx as the default extension and set your views path
app.set("view engine", "tsx");
app.set("views", __dirname + "/views");
```

Each view file must default-export a component; its props are the locals you
pass through a Response’s `render` method: 

```typescript jsx
export default function Homepage({ name }: { name: string }) {
  return <p>Welcome, {name}!</p>;
}
```

## Licence

[MIT.](LICENSE.txt)
