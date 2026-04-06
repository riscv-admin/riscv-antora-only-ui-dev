// Handlebars helper: contains
// Usage: {{#if (contains arrayOrString value)}} ... {{/if}}
module.exports = function contains(haystack, needle) {
  if (Array.isArray(haystack)) {
    return haystack.includes(needle);
  }
  if (typeof haystack === 'string') {
    return haystack.indexOf(needle) !== -1;
  }
  return false;
};
