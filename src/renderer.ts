export class Renderer {
  render(element: JSX.Element): string {
    return `<!DOCTYPE html>${this.renderFragment(element)}`;
  }

  renderFragment(element: JSX.Element): string {
    return element.render();
  }
}
