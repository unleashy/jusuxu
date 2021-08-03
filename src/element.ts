import { escapeTextForHtml } from "./escaping";

export interface Element {
  render: () => string;
}

export type Props = Record<string, unknown> & { children?: unknown };

export class HtmlElement implements Element {
  constructor(readonly tagName: string, readonly props: Props) {}

  render(): string {
    const { children, ...props } = this.props;
    if (VOID_ELEMENTS.includes(this.tagName)) {
      return `<${this.tagName}${this.renderAttributes(props)}>`;
    } else {
      // prettier-ignore
      return `<${this.tagName}${this.renderAttributes(props)}>${this.renderChildren(children)}</${this.tagName}>`;
    }
  }

  private renderAttributes(props: Omit<Props, "children">): string {
    const propsEntries = Object.entries(props);
    if (propsEntries.length === 0) {
      return "";
    } else {
      return " " + propsEntries.map(([k, v]) => `${k}="${v}"`).join(" ");
    }
  }

  private renderChildren(children: unknown): string {
    switch (typeof children) {
      case "string":
        return escapeTextForHtml(children);

      case "object":
        if (Array.isArray(children)) {
          return children.map(child => this.renderChildren(child)).join("");
        } else {
          return (children as Element | null)?.render() ?? "";
        }

      default:
        return "";
    }
  }
}

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
