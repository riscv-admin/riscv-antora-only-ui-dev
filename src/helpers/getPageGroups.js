'use strict';

/**
 * Returns a list of unique page-group values from all components.
 * Usage: {{#each (getPageGroups site.components) as |group|}} ... {{/each}}
 */
module.exports = function getPageGroups(components) {
  const groups = new Set();
  if (Array.isArray(components)) {
    components.forEach(component => {
      if (
        component.asciidoc &&
        component.asciidoc.attributes &&
        component.asciidoc.attributes['page-group']
      ) {
        groups.add(component.asciidoc.attributes['page-group']);
      }
    });
  }
  return Array.from(groups);
};
