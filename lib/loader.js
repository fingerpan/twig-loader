var Twig = require('twig')
var hashGenerator = require('hasha')
var mapcache = require('./mapcache')
var compilerFactory = require('./compiler')
var getOptions = require('./getOptions')
Twig.cache(false)

module.exports = function(source, ...other) {
    var path = require.resolve(this.resource)
    var id = hashGenerator(path)
    var options = getOptions(this)
    var tpl

    Twig.extend(function(Twig) {
        // 为 Twig 新增一个 webpack 类型的 complie 函数
        Twig.compiler.module['webpack'] = compilerFactory(options)
    })
    mapcache.set(id, path)

    this.cacheable && this.cacheable()

    // 预编译模板
    tpl = Twig.twig({
        id: id,
        path: path,
        data: source,
        allowInlineIncludes: true
    })

    // 调用 module 类型的 webpack的函数, twig 为twig模块路径
    // 实际调用 compilerFactory工厂函数返回的函数
    tpl = tpl.compile({
        module: 'webpack',
        twig: 'twig'
    })

    // callback
    this.callback(null, tpl)
}
