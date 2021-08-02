import { jsx, jsxs } from "../../src";
import { HtmlElement } from "../../src/element";

describe(jsx, () => {
  it("constructs Elements properly", () => {
    expect(jsx("a", { href: "link" })).toBeInstanceOf(HtmlElement);
  });

  it.each([
    "",
    " ",
    "\f",
    "\n",
    "\t",
    "\0",
    "/",
    ">",
    "!",
    "?",
    "a ",
    "b\f",
    "c\n",
    "d\t",
    "F/",
    "G>",
    "h\0"
  ])("throws on tag name %j", tag => {
    expect(() => jsx(tag, {})).toThrowErrorMatchingSnapshot();
  });

  it.each(["A!", "B?", "cð"])("does not throw on tag name %j", tag => {
    expect(() => jsx(tag, {})).not.toThrow();
  });
});

describe("jsxs", () => {
  it("is the exact same as jsx", () => {
    expect(jsxs).toBe(jsx);
  });
});

describe("jsx syntax", () => {
  it("does the same thing as calling `jsx`", () => {
    expect(<a href="link">child</a>).toEqual(
      jsx("a", { href: "link", children: "child" })
    );
  });
});
