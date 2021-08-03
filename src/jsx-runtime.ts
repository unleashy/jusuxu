import {
  Component,
  ComponentElement,
  Element as JusuxuElement,
  HtmlElement,
  Props
} from "./element";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [name: string]: any;
    }

    type Element = JusuxuElement;
    type ElementClass = never;
  }
}

export function jsx(type: string | Component, props: Props): JSX.Element {
  if (typeof type === "string") {
    validateTagName(type);
    validateAttributes(props);

    return new HtmlElement(type, props);
  } else {
    return new ComponentElement(type, props);
  }
}

const VALID_TAG_REGEX = /^[a-z]+[^\s/>\u0000]*$/i;
function validateTagName(name: string) {
  if (!VALID_TAG_REGEX.test(name)) {
    throw new Error(`Tag name ${JSON.stringify(name)} is not valid.`);
  }
}

const VALID_ATTRIBUTE_NAME_REGEX = /^[^\s/><='"\u0000]+$/i;
function validateAttributes(attrs: Props) {
  const invalidAttrName = Object.keys(attrs).find(
    name => !VALID_ATTRIBUTE_NAME_REGEX.test(name)
  );
  if (invalidAttrName !== undefined) {
    throw new Error(
      `Attribute name ${JSON.stringify(invalidAttrName)} is not valid.`
    );
  }
}

export const jsxs = jsx;
