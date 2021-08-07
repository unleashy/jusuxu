import { escapeTextForAttribute, escapeTextForHtml } from "./escaping";

export interface Element {
  render: () => string;
}

export type Props = Record<string, unknown> & {
  children?: unknown;
  dangerouslySetInnerHTML?: { __html: string };
};

const VOID_ELEMENTS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

export abstract class HtmlElement implements Element {
  static for(tagName: string, props: Props): HtmlElement {
    const { children, ...otherProps } = props;

    if (VOID_ELEMENTS.includes(tagName)) {
      return new VoidHtmlElement(tagName, otherProps);
    } else if ("dangerouslySetInnerHTML" in otherProps) {
      const { dangerouslySetInnerHTML, ...otherOtherProps } = otherProps;

      return new DangerousHtmlElement(
        tagName,
        otherOtherProps,
        (dangerouslySetInnerHTML as { __html: string }).__html
      );
    } else {
      return new NormalHtmlElement(tagName, otherProps, children);
    }
  }

  protected constructor(
    readonly tagName: string,
    readonly props: Omit<Props, "children">,
    readonly children: unknown
  ) {}

  render(): string {
    return `<${this.tagName}${this.attributes()}>${this.contents()}`;
  }

  protected abstract contents(): string;

  protected attributes(): string {
    const processedAttrs = Object.entries(this.props)
      .map(([k, v]) => {
        switch (v) {
          case true:
            return k;

          case false:
          case undefined:
          case null:
            return false;

          default:
            return `${k}="${escapeTextForAttribute(String(v))}"`;
        }
      })
      .filter(it => it); // remove false boolean attrs

    if (processedAttrs.length === 0) {
      return "";
    } else {
      return " " + processedAttrs.join(" ");
    }
  }
}

class NormalHtmlElement extends HtmlElement {
  protected contents(): string {
    return `${renderChildren(this.children)}</${this.tagName}>`;
  }
}

class VoidHtmlElement extends HtmlElement {
  constructor(tagName: string, props: Omit<Props, "children">) {
    super(tagName, props, undefined);
  }

  protected contents(): string {
    return ``;
  }
}

class DangerousHtmlElement extends HtmlElement {
  constructor(
    tagName: string,
    props: Omit<Props, "children" | "dangerouslySetInnerHTML">,
    readonly dangerousContent: string
  ) {
    super(tagName, props, undefined);
  }

  protected contents(): string {
    return `${String(this.dangerousContent)}</${this.tagName}>`;
  }
}

export type Component = (props: Props) => Element;

export class ComponentElement implements Element {
  constructor(readonly Component: Component, readonly props: Props) {}

  render(): string {
    return this.Component(this.props).render();
  }
}

export class FragmentElement implements Element {
  constructor(readonly children: unknown) {}

  render(): string {
    return renderChildren(this.children);
  }
}

function renderChildren(children: unknown): string {
  switch (typeof children) {
    case "string":
      return escapeTextForHtml(children);

    case "object":
      if (Array.isArray(children)) {
        return children.map(renderChildren).join("");
      } else {
        return (children as Element | null)?.render() ?? "";
      }

    default:
      return "";
  }
}
