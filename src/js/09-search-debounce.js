document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input')
  if (!searchInput) return

  let debounceTimer
  let originalValue = ''

  // Intercept input events and debounce them
  searchInput.addEventListener('input', function(e) {
    e.stopImmediatePropagation()
    originalValue = this.value

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      // Create and dispatch a custom event after debounce
      this.dispatchEvent(new Event('input', { bubbles: true }))
      this.dispatchEvent(new Event('change', { bubbles: true }))
    }, 200)
  }, true) // Use capture phase to intercept before other listeners
})
