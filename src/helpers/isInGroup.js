'use strict'

/**
 * Check if a component belongs to a specific group based on its page-group attribute.
 * Falls back to checking component name for overview pages.
 * 
 * @param {Object} component - The component object
 * @param {String} groupName - The group name to check (e.g., "hardware", "platform-software")
 * @returns {Boolean} - True if component belongs to the group
 */
module.exports = (component, groupName) => {
  if (!component || !groupName) return false
  
  // Check if the component itself is the overview page (matches by name)
  if (component.name === groupName) return true
  
  // Check if the component has the matching page-group attribute at the component level
  if (component.asciidoc && component.asciidoc.attributes) {
    return component.asciidoc.attributes['page-group'] === groupName
  }
  
  return false
}
