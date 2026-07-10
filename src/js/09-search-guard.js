// Guards the lunr search field (#search-input) against queries that expand to a
// match-all wildcard. Such queries return every document in the index, which
// search-ui.js then renders unbounded on the main thread on every keystroke,
// freezing the tab. See issue #36.
//
// Antora's lunr search-ui.js parses a `*` as a literal wildcard term and a `\`
// as an empty term. The empty term yields no exact match, so its begins-with /
// contains fallback appends `*` to the term. Either path produces a term that
// matches every token in the index. Its try/catch only guards QueryParseError,
// which is never thrown here, so nothing stops the blow-up.
//
// The user never needs to type these characters -- search-ui.js already applies
// prefix and contains wildcards automatically -- so we strip them from the input
// before the search (bound on a debounced keydown) reads the value.
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('input', function (e) {
    const searchInput = e.target
    if (!searchInput || searchInput.id !== 'search-input') return

    const value = searchInput.value
    const cleaned = value.replace(/[\\*]/g, '')
    if (cleaned === value) return

    // Preserve the caret, accounting for characters removed before it.
    const caret = searchInput.selectionStart ?? 0
    const removedBeforeCaret = (value.slice(0, caret).match(/[\\*]/g) || []).length
    searchInput.value = cleaned
    const newCaret = Math.max(0, caret - removedBeforeCaret)
    try { searchInput.setSelectionRange(newCaret, newCaret) } catch {}
  }, true)
})
