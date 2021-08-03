export function escapeTextForHtml(text: string): string {
  return text.replace(/[<&]/g, match => {
    if (match === "<") {
      return "&#x3c;";
    } else {
      // match === "&"
      return "&#x26;";
    }
  });
}

export function escapeTextForAttribute(text: string): string {
  return text.replace(/["&]/g, match => {
    if (match === `"`) {
      return "&#x22;";
    } else {
      // match === "&"
      return "&#x26;";
    }
  });
}
