import { escapeTextForHtml } from "../../src/escaping";

describe(escapeTextForHtml, () => {
  it(`escapes "<" and "&" correctly`, () => {
    expect(
      escapeTextForHtml("hello <p>world</p> foobar &amp; <&>\"'/")
    ).toEqual(
      "hello &#x3c;p>world&#x3c;/p> foobar &#x26;amp; &#x3c;&#x26;>\"'/"
    );
  });
});
