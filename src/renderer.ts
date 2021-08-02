import { Element } from "./element";

export class Renderer {
  renderFragment(element: Element): string {
    return element.render();
  }
}
