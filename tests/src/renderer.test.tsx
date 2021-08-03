import { jsx, Renderer } from "../../src";
import { escapeTextForAttribute, escapeTextForHtml } from "../../src/escaping";

jest.mock("../../src/escaping", () => ({
  escapeTextForHtml: jest.fn(text => text),
  escapeTextForAttribute: jest.fn(text => text)
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

    it("renders boolean attributes correctly", () => {
      const sut = new Renderer();

      expect(sut.renderFragment(<p hidden={true} />)).toEqual(`<p hidden></p>`);
      expect(sut.renderFragment(<p hidden={false} />)).toEqual(`<p></p>`);
      expect(sut.renderFragment(<p hidden={null} />)).toEqual(`<p></p>`);
      expect(sut.renderFragment(<p hidden={undefined} />)).toEqual(`<p></p>`);
    });

    it("renders multiple attributes", () => {
      const sut = new Renderer();

      expect(
        sut.renderFragment(<img src="foo.jpg" alt="" loading="lazy" />)
      ).toEqual(`<img src="foo.jpg" alt="" loading="lazy">`);
    });

    it("escapes attribute values via escapeTextForAttribute", () => {
      const sut = new Renderer();

      expect(sut.renderFragment(<span title="to be escaped" />)).toEqual(
        `<span title="to be escaped"></span>`
      );
      expect(escapeTextForAttribute).toHaveBeenCalledWith("to be escaped");
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

    it("renders components", () => {
      const sut = new Renderer();
      const Component: () => JSX.Element = jest.fn(() => <span />);

      expect(sut.renderFragment(<Component />)).toEqual("<span></span>");
      expect(Component).toHaveBeenCalledWith({});
    });

    it("renders components with props", () => {
      const sut = new Renderer();
      const Component: (props: { foo: string; baz: number }) => JSX.Element =
        jest.fn(() => <span />);

      expect(sut.renderFragment(<Component foo="bar" baz={123} />)).toEqual(
        "<span></span>"
      );
      expect(Component).toHaveBeenCalledWith({ foo: "bar", baz: 123 });
    });

    it("renders components inside tags", () => {
      const sut = new Renderer();
      const Component: () => JSX.Element = jest.fn(() => <span />);

      expect(
        sut.renderFragment(
          <p>
            <Component />
          </p>
        )
      ).toEqual(`<p><span></span></p>`);
    });
  });

  describe(".render", () => {
    it("prepends a doctype and calls renderFragment", () => {
      const sut = new Renderer();
      const renderFragmentSpy = jest.spyOn(sut, "renderFragment");
      const element = <span />;

      expect(sut.render(element)).toEqual("<!DOCTYPE html><span></span>");
      expect(renderFragmentSpy).toHaveBeenCalledWith(element);
    });
  });
});
