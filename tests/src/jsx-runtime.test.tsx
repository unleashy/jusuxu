import { jsx } from "../../src";
import { HtmlElement } from "../../src/element";

describe(jsx, () => {
  it("constructs Elements properly", () => {
    expect(jsx("a", { href: "link" })).toBeInstanceOf(HtmlElement);
  });
});

describe("jsx syntax", () => {
  it("does the same thing as calling `jsx`", () => {
    expect(<a href="link">child</a>).toEqual(
      jsx("a", { href: "link", children: "child" })
    );
  });
});
