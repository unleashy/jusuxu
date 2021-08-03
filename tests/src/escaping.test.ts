import { escapeTextForAttribute, escapeTextForHtml } from "../../src/escaping";

describe(escapeTextForHtml, () => {
  it(`escapes "<" and "&" correctly`, () => {
    expect(
      escapeTextForHtml("hello <p>world</p> foobar &amp; <&>\"'/")
    ).toEqual(
      "hello &#x3c;p>world&#x3c;/p> foobar &#x26;amp; &#x3c;&#x26;>\"'/"
    );
  });
});

describe(escapeTextForAttribute, () => {
  it(`escapes '"' and "&" correctly`, () => {
    expect(escapeTextForAttribute(`hello"world &amp;&"`)).toEqual(
      `hello&#x22;world &#x26;amp;&#x26;&#x22;`
    );
  });
});
