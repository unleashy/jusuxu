import { Renderer } from "./renderer";
import { jsx } from "./jsx-runtime";

type ExpressEngine = (
  path: string,
  options: Record<string, unknown>,
  callback: (e: Error | null, rendered?: string) => void
) => void;

export function createEngine(): ExpressEngine {
  const renderer = new Renderer();

  return (path, props, callback) => {
    const mod = require(path);
    const Component = mod.__esModule === true ? mod.default : mod;
    if (typeof Component !== "function") {
      throw new TypeError(
        `View must default-export a component function, got ${typeof Component} instead`
      );
    }

    const rendered = renderer.render(jsx(Component, props));
    callback(null, rendered);
  };
}
