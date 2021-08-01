export type Props = Record<string, unknown>;

export interface Element {
  render: () => string;
}

export class HtmlElement implements Element {
  constructor(readonly tagName: string, readonly props: Props) {}

  render(): string {
    return "";
  }
}
