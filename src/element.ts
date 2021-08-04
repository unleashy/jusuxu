import { escapeTextForAttribute, escapeTextForHtml } from "./escaping";

export interface Element {
  render: () => string;
}

export type Props = Record<string, unknown> & { children?: unknown };

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

export class HtmlElement implements Element {
  constructor(readonly tagName: string, readonly props: Props) {}

  render(): string {
    const { children, ...props } = this.props;
    if (VOID_ELEMENTS.includes(this.tagName)) {
      return `<${this.tagName}${this.renderAttributes(props)}>`;
    } else {
      // prettier-ignore
      return `<${this.tagName}${this.renderAttributes(props)}>${renderChildren(children)}</${this.tagName}>`;
    }
  }

  private renderAttributes(props: Omit<Props, "children">): string {
    const processedAttrs = Object.entries(props)
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
