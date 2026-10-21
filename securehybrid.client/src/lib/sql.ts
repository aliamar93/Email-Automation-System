export const SQL_KEYWORDS =
    /\b(SELECT|FROM|WHERE|INNER|LEFT|RIGHT|OUTER|JOIN|ON|GROUP|ORDER|BY|HAVING|AND|OR|NOT|IN|AS|CASE|WHEN|THEN|ELSE|END|COUNT|SUM|MAX|MIN|AVG|DISTINCT|TOP|ASC|DESC|NULL|IS|BETWEEN|LIKE|UNION|ALL|WITH|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC)\b/gi

export const WRITE_STATEMENTS = /\b(INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|MERGE|GRANT)\b/i

export const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// SQL ko rangeen HTML mein badlo (keywords, strings, @params, comments)
export function highlightSql(code: string) {
    let out = escHtml(code)
    out = out.replace(/(--[^\n]*)/g, '<span class="text-slate-500">$1</span>')
    out = out.replace(/('(?:[^']|'')*')/g, '<span class="text-emerald-300">$1</span>')
    out = out.replace(/(@\w+)/g, '<span class="text-amber-300">$1</span>')
    out = out.replace(SQL_KEYWORDS, (m) => '<span class="text-blue-300">' + m + '</span>')
    return out
}
