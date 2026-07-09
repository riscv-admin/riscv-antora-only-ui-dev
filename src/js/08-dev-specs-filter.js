document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.dev-specs-container')
  if (!container) return

  const searchInput = container.querySelector('.dev-specs-search input')
  const filterBtns = container.querySelectorAll('.filter-btn')
  const sortSelect = container.querySelector('.sort-select')
  const bands = container.querySelectorAll('.dev-spec-band')

  // Store original bands data
  const specData = Array.from(bands).map(band => ({
    element: band,
    title: band.querySelector('.band-title')?.textContent || '',
    status: band.getAttribute('data-status') || '',
    group: band.getAttribute('data-group') || '',
    fastTrack: band.getAttribute('data-fast-track') === 'true'
  }))

  function filterAndSort() {
    const searchTerm = (searchInput?.value || '').toLowerCase()
    const activeFilters = {
      status: Array.from(filterBtns)
        .filter(btn => btn.dataset.type === 'status' && btn.classList.contains('active'))
        .map(btn => btn.dataset.value),
      group: Array.from(filterBtns)
        .filter(btn => btn.dataset.type === 'group' && btn.classList.contains('active'))
        .map(btn => btn.dataset.value),
      fastTrack: Array.from(filterBtns).some(btn => btn.dataset.type === 'fasttrack' && btn.classList.contains('active'))
    }
    const sortBy = sortSelect?.value || 'name'

    let filtered = specData.filter(spec => {
      // Search filter
      if (searchTerm && !spec.title.toLowerCase().includes(searchTerm)) {
        return false
      }

      // Status filter
      if (activeFilters.status.length > 0 && !activeFilters.status.includes(spec.status)) {
        return false
      }

      // Group filter
      if (activeFilters.group.length > 0 && !activeFilters.group.includes(spec.group)) {
        return false
      }

      // Fast track filter
      if (activeFilters.fastTrack && !spec.fastTrack) {
        return false
      }

      return true
    })

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'state') {
      const stateOrder = { planning: 0, 'under development': 1, stabilization: 2, freeze: 3, 'ratification-ready': 4 }
      filtered.sort((a, b) => {
        const orderA = stateOrder[a.status.toLowerCase()] ?? 999
        const orderB = stateOrder[b.status.toLowerCase()] ?? 999
        return orderA - orderB || a.title.localeCompare(b.title)
      })
    }

    // Reorder and show/hide bands
    specData.forEach(spec => {
      spec.element.classList.add('hidden')
    })

    const bandsContainer = container.querySelector('.dev-specs-bands')
    filtered.forEach(spec => {
      spec.element.classList.remove('hidden')
      bandsContainer.appendChild(spec.element)
    })

    // Show "no results" message
    const noResults = container.querySelector('.no-results')
    if (filtered.length === 0) {
      if (!noResults) {
        const msg = document.createElement('div')
        msg.className = 'no-results'
        msg.textContent = 'No specifications match your filters.'
        container.querySelector('.dev-specs-bands').appendChild(msg)
      }
    } else if (noResults) {
      noResults.remove()
    }
  }

  // Event listeners
  searchInput?.addEventListener('input', filterAndSort)
  sortSelect?.addEventListener('change', filterAndSort)

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active')
      filterAndSort()
    })
  })
})
