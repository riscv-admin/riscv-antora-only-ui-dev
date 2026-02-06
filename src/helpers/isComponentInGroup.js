'use strict'

/**
 * Check if a component belongs to a specific group based on its asciidoc.attributes.page-group.
 * Used in templates to match current page component against a group name.
 * 
 * @param {Array} components - The site.components array from Antora
 * @param {Object} currentComponent - The current page's component object
 * @param {String} groupName - The group name to check (e.g., "hardware", "platform-software")
 * @returns {Boolean} - True if component belongs to the group
 */
module.exports = (components, currentComponent, groupName) => {
  if (!components || !currentComponent || !groupName) return false
  
  // Find the matching component in the site.components array
  const component = components.find(c => c.name === currentComponent.name)
  
  if (!component || !component.versions) return false
  
  // Check if any version of this component has the matching page-group attribute
  return component.versions.some(version => {
    if (version.asciidoc && version.asciidoc.attributes) {
      return version.asciidoc.attributes['page-group'] === groupName
    }
    return false
  })
}
