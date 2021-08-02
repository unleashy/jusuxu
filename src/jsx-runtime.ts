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

const VALID_TAG_REGEX = /^[a-z]+[^\s/>\u0000]*$/i;

export function jsx(type: string, props: Props): JSX.Element {
  if (!VALID_TAG_REGEX.test(type)) {
    throw new Error(`Tag name ${JSON.stringify(type)} is not valid.`);
  }

  return new HtmlElement(type, props);
}

export const jsxs = jsx;
