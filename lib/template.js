var _ = require('underscore')

/**
 * loader生成输出js
 * @param {Array} imports
 * @param {String} pathToTwig
 * @param {Object} opts
 */
module.exports = function build(imports, pathToTwig, opts) {
  let requires = ''
  if (imports.length > 0) {
    _.each(_.uniq(imports), function(file) {
      requires += 'require(' + JSON.stringify(file) + ');\n'
    })
  }

  let souce = `
      ${requires}
      var twig = require("${pathToTwig}").twig;
      var template = twig(${JSON.stringify(opts)});
      function render(context, params) { 
        return template.render(context, params) 
      };
      function macro() {
        var args = Array.prototype.slice.call(arguments)
        var name = args.shift()
        var macros = render({}, {
            output: 'macros'
        })
        var renderFn = macros[name]
        return typeof renderFn !== 'function' ? Promise.reject('no ' + name + ' macros') : renderFn.apply(macro, args)
      };
      render.template = template;
      render.macro = macro;
      module.exports = render;
  `
  return souce
}
