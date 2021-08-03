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
