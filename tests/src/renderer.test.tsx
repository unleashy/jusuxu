import { jsx, Renderer } from "../../src";
import { escapeTextForHtml } from "../../src/escaping";

jest.mock("../../src/escaping", () => ({
  escapeTextForHtml: jest.fn(text => text)
}));

describe(Renderer, () => {
  describe(".renderFragment", () => {
    it("renders simple tags", () => {
      const sut = new Renderer();

      expect(sut.renderFragment(<p />)).toEqual("<p></p>");
      expect(sut.renderFragment(<span />)).toEqual("<span></span>");
      expect(sut.renderFragment(<div />)).toEqual("<div></div>");
    });

    it.each([
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
    ])("renders the void tag %s", tag => {
      const sut = new Renderer();

      expect(sut.renderFragment(jsx(tag, {}))).toEqual(`<${tag}>`);
    });

    it("renders a single attribute", () => {
      const sut = new Renderer();

      expect(sut.renderFragment(<a href="example.com" />)).toEqual(
        `<a href="example.com"></a>`
      );
    });

    it("renders multiple attributes", () => {
      const sut = new Renderer();

      expect(
        sut.renderFragment(<img src="foo.jpg" alt="something" loading="lazy" />)
      ).toEqual(`<img src="foo.jpg" alt="something" loading="lazy">`);
    });

    it("renders a text child", () => {
      const sut = new Renderer();
      expect(sut.renderFragment(<div>foobar</div>)).toEqual(
        `<div>foobar</div>`
      );
    });

    it("escapes text children via escapeTextForHtml", () => {
      const sut = new Renderer();
      expect(sut.renderFragment(<div>to be escaped</div>)).toEqual(
        `<div>to be escaped</div>`
      );
      expect(escapeTextForHtml).toHaveBeenCalledWith("to be escaped");
    });

    it("ignores undefined, bool and null children", () => {
      const sut = new Renderer();

      expect(sut.renderFragment(<div>{undefined}</div>)).toEqual(`<div></div>`);
      expect(sut.renderFragment(<div>{true}</div>)).toEqual(`<div></div>`);
      expect(sut.renderFragment(<div>{false}</div>)).toEqual(`<div></div>`);
      expect(sut.renderFragment(<div>{null}</div>)).toEqual(`<div></div>`);
    });

    it("renders an element child", () => {
      const sut = new Renderer();

      expect(
        sut.renderFragment(
          <div>
            <span title="foo">a</span>
          </div>
        )
      ).toEqual(`<div><span title="foo">a</span></div>`);
    });

    it("renders multiple child elements", () => {
      const sut = new Renderer();

      expect(
        sut.renderFragment(
          <head>
            <meta charset="utf-8" />
            <title>foobar</title>
          </head>
        )
      ).toEqual(`<head><meta charset="utf-8"><title>foobar</title></head>`);
    });

    it("renders mixed-type children", () => {
      const sut = new Renderer();

      expect(
        sut.renderFragment(
          <p>
            some
            <i>
              te
              <br />
              xt
            </i>
            {undefined}
            {false}
            here
            {true}
            {null}
          </p>
        )
      ).toEqual(`<p>some<i>te<br>xt</i>here</p>`);
    });
  });
});
