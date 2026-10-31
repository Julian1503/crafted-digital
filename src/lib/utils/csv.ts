/**
 * @fileoverview CSV cell escaping safe for spreadsheets.
 *
 * Two risks: a value containing a comma, quote or newline breaks the row, and
 * a value starting with `=`, `+`, `-`, `@`, tab or carriage return is executed
 * as a formula by Excel, Sheets and LibreOffice (CSV injection). Formula-leading
 * cells are prefixed with an apostrophe, which spreadsheets show as text.
 */
const FORMULA_LEAD = /^[=+\-@\t\r]/;
const NEEDS_QUOTES = /[",\r\n]/;

export function csvCell(value: unknown): string {
    if (value === null || value === undefined) return "";
    let text = value instanceof Date ? value.toISOString() : String(value);
    if (FORMULA_LEAD.test(text)) text = `'${text}`;
    if (NEEDS_QUOTES.test(text) || text.startsWith("'")) text = `"${text.replace(/"/g, '""')}"`;
    return text;
}

export function csvRow(values: unknown[]): string {
    return values.map(csvCell).join(",");
}
