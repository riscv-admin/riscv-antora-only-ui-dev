'use strict'

module.exports = (allComponents, currentComponent) => {
  if (!allComponents || !currentComponent) return []
  const group = getGroup(currentComponent)
  if (!group) return []
  return allComponents.filter((c) => getGroup(c) === group)
}

function getGroup (component) {
  return component.asciidoc && component.asciidoc.attributes
    ? component.asciidoc.attributes['page-group'] || null
    : null
}
