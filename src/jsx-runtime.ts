import { Element as JusuxuElement, HtmlElement, Props } from "./element";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [name: string]: any;
    }

    type Element = JusuxuElement;
    type ElementClass = never;
  }
}

export function jsx(type: string, props: Props): JSX.Element {
  return new HtmlElement(type, props);
}

export const jsxs = jsx;
