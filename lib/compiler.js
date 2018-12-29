var path = require('path')
var hashGenerator = require('hasha')
var _ = require('underscore')
var mapcache = require('./mapcache')
var buildOutPut = require('./template')

module.exports = function(options) {
    return function(id, tokens, pathToTwig) {
        var includes = []
        var resourcePath = mapcache.get(id)
        var processDependency = function(token) {
            includes.push(token.value)
            token.value = hashGenerator(path.resolve(path.dirname(resourcePath), token.value))
        }
        var processToken = function(token) {
            if (token.type === 'logic' && token.token.type) {
                switch (token.token.type) {
                    case 'Twig.logic.type.block':
                    case 'Twig.logic.type.if':
                    case 'Twig.logic.type.elseif':
                    case 'Twig.logic.type.else':
                    case 'Twig.logic.type.for':
                    case 'Twig.logic.type.spaceless':
                    case 'Twig.logic.type.macro':
                        _.each(token.token.output, processToken)
                        break
                    case 'Twig.logic.type.extends':
                    case 'Twig.logic.type.include':
                        _.each(token.token.stack, processDependency)
                        break
                    case 'Twig.logic.type.embed':
                        _.each(token.token.output, processToken)
                        _.each(token.token.stack, processDependency)
                        break
                    case 'Twig.logic.type.import':
                    case 'Twig.logic.type.from':
                        if (token.token.expression !== '_self') {
                            _.each(token.token.stack, processDependency)
                        }
                        break
                }
            }
        }

        var parsedTokens = JSON.parse(tokens)

        // 寻找依赖
        _.each(parsedTokens, processToken)

        // 初始化options对象
        var opts = Object.assign({}, options.twigOptions, {
            id: id,
            data: parsedTokens,
            allowInlineIncludes: true,
            rethrow: true
        })

        // 输出js
        return buildOutPut(includes, pathToTwig, opts)
    }
}
