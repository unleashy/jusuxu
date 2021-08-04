import { Fragment, jsx, jsxs } from "../../src";
import {
  ComponentElement,
  FragmentElement,
  HtmlElement
} from "../../src/element";

describe(jsx, () => {
  it("constructs Elements properly", () => {
    expect(jsx("a", { href: "link" })).toBeInstanceOf(HtmlElement);
    expect(jsx(jest.fn(), { foo: "bar" })).toBeInstanceOf(ComponentElement);
    expect(jsx(Fragment, { children: [] })).toBeInstanceOf(FragmentElement);
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

  it.each([
    "",
    " ",
    "\f",
    "\n",
    "\t",
    "\0",
    "/",
    ">",
    "<",
    "=",
    "'",
    '"',
    " a",
    "b ",
    "c/",
    "d>",
    "e<",
    "F=",
    "G'",
    'H"'
  ])("throws on attribute name %j", attr => {
    expect(() => jsx("div", { [attr]: "" })).toThrowErrorMatchingSnapshot();
  });

  it.each(["a[]", "b:c", "dę", "f^g"])(
    "does not throw on attribute name %j",
    attr => {
      expect(() => jsx("div", { [attr]: "" })).not.toThrow();
    }
  );
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
