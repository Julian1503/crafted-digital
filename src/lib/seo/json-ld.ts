/**
 * @fileoverview Safe JSON-LD serialisation.
 *
 * `JSON.stringify` does not escape `<`, so a value containing `</script>` would
 * break out of the inline script tag (stored XSS from CMS content). Escaping
 * `<`, `>` and `&` as unicode keeps the JSON valid and the HTML inert.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
