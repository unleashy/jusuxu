import path from "path";
import validView from "./express-fixtures/valid-view";
import validViewCjs from "./express-fixtures/valid-view-cjs";
import { createEngine } from "../../src/express";
import { jsx } from "../../src";

const mockRender = jest.fn().mockReturnValue("foobar");
jest.mock("../../src/renderer", () => ({
  Renderer: function () {
    return { render: mockRender };
  }
}));

function fixturePath(name: string) {
  return path.join(__dirname, "express-fixtures", name);
}

it("renders a view", () => {
  const sut = createEngine();
  const props = { foo: "bar" };
  const callback = jest.fn();

  sut(fixturePath("valid-view"), props, callback);

  expect(mockRender).toHaveBeenCalledWith(jsx(validView, props));
  expect(callback).toHaveBeenCalledWith(null, "foobar");
});

it("renders a commonjs view", () => {
  const sut = createEngine();
  const props = { anything: 1234 };
  const callback = jest.fn();

  sut(fixturePath("valid-view-cjs"), props, callback);

  expect(mockRender).toHaveBeenCalledWith(jsx(validViewCjs, props));
  expect(callback).toHaveBeenCalledWith(null, "foobar");
});

it("throws with no default export", () => {
  const sut = createEngine();
  const props = { foo: "bar" };
  const callback = jest.fn();

  expect(() =>
    sut(fixturePath("no-default-export"), props, callback)
  ).toThrowErrorMatchingInlineSnapshot(
    `"View must default-export a component function, got undefined instead"`
  );
  expect(mockRender).not.toHaveBeenCalled();
  expect(callback).not.toBeCalled();
});

it("throws if the default export is not a function", () => {
  const sut = createEngine();
  const props = { foo: "bar" };
  const callback = jest.fn();

  expect(() =>
    sut(fixturePath("default-export-is-not-function"), props, callback)
  ).toThrowErrorMatchingInlineSnapshot(
    `"View must default-export a component function, got number instead"`
  );
  expect(mockRender).not.toHaveBeenCalled();
  expect(callback).not.toBeCalled();
});
