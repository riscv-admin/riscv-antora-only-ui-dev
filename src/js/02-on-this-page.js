; (function () {
  'use strict'

  document.querySelectorAll('.content article a').forEach(function (item) {
    const location = window.location
    if (location) {
      if (item.hostname && item.hostname !== location.hostname) {
        item.classList.add('external')
        item.setAttribute('target', '_blank')
      }
    }
  })

  var sidebar = document.querySelector('div.toc')
  if (!sidebar) return
  if (document.querySelector('body.-toc')) return sidebar.parentNode.removeChild(sidebar)
  var levels = parseInt(sidebar.dataset.levels || 2, 10)
  if (levels < 0) return

  var articleSelector = 'article.doc'
  var article = document.querySelector(articleSelector)
  var headingsSelector = []
  for (var level = 0; level <= levels; level++) {
    var headingSelector = [articleSelector]
    if (level) {
      for (var l = 1; l <= level; l++) headingSelector.push((l === 2 ? '.sectionbody>' : '') + '.sect' + l)
      headingSelector.push('h' + (level + 1) + '[id]')
    } else {
      headingSelector.push('h1[id].sect0')
    }
    headingsSelector.push(headingSelector.join('>'))
  }
  var headings = find(headingsSelector.join(','), article.parentNode)
  if (!headings.length) return sidebar.parentNode.removeChild(sidebar)

  var lastActiveFragment
  // Each fragment maps to every link that represents it: the on-page TOC's
  // own link, plus (when present) the mirrored link in the left nav below.
  // Scroll-spying activates/deactivates all of them together.
  var links = {}
  function registerLink (fragment, link) {
    (links[fragment] || (links[fragment] = [])).push(link)
  }
  function setLinksActive (fragment) {
    links[fragment].forEach(function (link) { link.classList.add('is-active') })
  }
  function setLinksInactive (fragment) {
    links[fragment].forEach(function (link) { link.classList.remove('is-active') })
  }
  var list = headings.reduce(function (accum, heading) {
    var link = document.createElement('a')
    link.textContent = heading.textContent
    link.href = '#' + heading.id
    registerLink(link.href, link)
    var listItem = document.createElement('li')
    listItem.dataset.level = parseInt(heading.nodeName.slice(1), 10) - 1
    listItem.appendChild(link)
    accum.appendChild(listItem)
    return accum
  }, document.createElement('ul'))

  mirrorHeadingsIntoLeftNav(headings, registerLink)

  var menu = sidebar.querySelector('.toc-menu')
  if (!menu) (menu = document.createElement('div')).className = 'toc-menu'

  var title = document.createElement('h3')
  title.textContent = sidebar.dataset.title || 'Contents'
  menu.appendChild(title)
  menu.appendChild(list)

  var startOfContent = !document.getElementById('toc') && article.querySelector('h1.page ~ :not(.is-before-toc)')
  if (startOfContent) {
    var embeddedToc = document.createElement('aside')
    embeddedToc.className = 'toc embedded'
    embeddedToc.appendChild(menu.cloneNode(true))
    startOfContent.parentNode.insertBefore(embeddedToc, startOfContent)
  }

  window.addEventListener('load', function () {
    onScroll()
    window.addEventListener('scroll', onScroll)
  })

  function onScroll() {
    var scrolledBy = window.pageYOffset
    var buffer = getNumericStyleVal(document.documentElement, 'fontSize') * 1.15 + 80
    var ceil = article.offsetTop
    if (scrolledBy && window.innerHeight + scrolledBy + 2 >= document.documentElement.scrollHeight) {
      lastActiveFragment = Array.isArray(lastActiveFragment) ? lastActiveFragment : Array(lastActiveFragment || 0)
      var activeFragments = []
      var lastIdx = headings.length - 1
      headings.forEach(function (heading, idx) {
        var fragment = '#' + heading.id
        if (idx === lastIdx || heading.getBoundingClientRect().top + getNumericStyleVal(heading, 'paddingTop') > ceil) {
          activeFragments.push(fragment)
          if (lastActiveFragment.indexOf(fragment) < 0) setLinksActive(fragment)
        } else if (~lastActiveFragment.indexOf(fragment)) {
          setLinksInactive(lastActiveFragment.shift())
        }
      })
      list.scrollTop = list.scrollHeight - list.offsetHeight
      lastActiveFragment = activeFragments.length > 1 ? activeFragments : activeFragments[0]
      return
    }
    if (Array.isArray(lastActiveFragment)) {
      lastActiveFragment.forEach(setLinksInactive)
      lastActiveFragment = undefined
    }
    var activeFragment
    headings.some(function (heading) {
      if (heading.getBoundingClientRect().top + getNumericStyleVal(heading, 'paddingTop') - buffer > ceil) return true
      activeFragment = '#' + heading.id
    })
    if (activeFragment) {
      if (activeFragment === lastActiveFragment) return
      if (lastActiveFragment) setLinksInactive(lastActiveFragment)
      setLinksActive(activeFragment)
      // Scroll the (first-registered, i.e. the sidebar's own) link into view;
      // the mirrored left-nav link, if any, isn't part of this scroll region.
      var activeLink = links[activeFragment][0]
      if (list.scrollHeight > list.offsetHeight) {
        list.scrollTop = Math.max(0, activeLink.offsetTop + activeLink.offsetHeight - list.offsetHeight)
      }
      lastActiveFragment = activeFragment
    } else if (lastActiveFragment) {
      setLinksInactive(lastActiveFragment)
      lastActiveFragment = undefined
    }
  }

  // Mirror this page's own on-page TOC headings into its left-nav item, so
  // the chapter you're reading shows its subsections in the left nav too
  // (the same subsections the right-hand "on this page" TOC above lists).
  // This only ever covers the *current* page: the left nav is rendered
  // server-side from nav.adoc, which has no notion of in-page headings, and
  // other pages' headings aren't in the DOM to read. registerLink keeps
  // these mirrored links in the same scroll-spy fragment map as the
  // sidebar's own links, so scrolling highlights both in sync.
  function mirrorHeadingsIntoLeftNav (headings, registerLink) {
    var navItem = document.querySelector('.nav-menu .nav-item.is-current-page')
    if (!navItem) return
    // Skip the page's own title (h1.sect0, i.e. the level-0 match) - it's
    // already represented by navItem's own link.
    var sections = headings.filter(function (heading) { return heading.nodeName !== 'H1' })
    if (!sections.length) return
    var baseDepth = (parseInt(navItem.dataset.depth, 10) || 0) + 1
    navItem.appendChild(renderHeadingList(buildHeadingTree(sections), baseDepth, registerLink))
  }

  function buildHeadingTree (headings) {
    var root = { children: [] }
    var stack = [{ level: 0, node: root }]
    headings.forEach(function (heading) {
      var level = parseInt(heading.nodeName.slice(1), 10) - 1
      var item = { heading: heading, children: [] }
      while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop()
      stack[stack.length - 1].node.children.push(item)
      stack.push({ level: level, node: item })
    })
    return root.children
  }

  function renderHeadingList (items, depth, registerLink) {
    var ul = document.createElement('ul')
    ul.className = 'nav-list'
    items.forEach(function (item) {
      var li = document.createElement('li')
      li.className = 'nav-item nav-heading-item'
      li.dataset.depth = depth
      var link = document.createElement('a')
      link.className = 'nav-link'
      link.href = '#' + item.heading.id
      link.textContent = item.heading.textContent
      registerLink(link.href, link)
      li.appendChild(link)
      if (item.children.length) li.appendChild(renderHeadingList(item.children, depth + 1, registerLink))
      ul.appendChild(li)
    })
    return ul
  }

  function find(selector, from) {
    return [].slice.call((from || document).querySelectorAll(selector))
  }

  function getNumericStyleVal(el, prop) {
    return parseFloat(window.getComputedStyle(el)[prop])
  }
})()
