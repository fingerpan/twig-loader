var Twig = require('twig')
var hashGenerator = require('hasha')
var mapcache = require('./mapcache')
var compilerFactory = require('./compiler')
var getOptions = require('./getOptions')
Twig.cache(false)

module.exports = function(source) {
    const path = require.resolve(this.resource)
    const id = hashGenerator(path)
    var options = getOptions(this)
    var tpl = null

    Twig.extend(function(_Twig) {
        // 为 Twig 新增 webpack 类型 complie 函数
        _Twig.compiler.module['webpack'] = compilerFactory(options)
    })
    // set cache
    mapcache.set(id, path)
    this.cacheable && this.cacheable()

    // 预编译模板
    tpl = Twig.twig({
        id: id,
        path: path,
        data: source,
        allowInlineIncludes: true
    })

    // 调用 module 类型 webpack的函数, twig 为twig模块路径
    // 实际调用 compilerFactory 工厂函数返回的函数
    tpl = tpl.compile({
        module: 'webpack',
        twig: 'twig'
    })

    // callback
    this.callback(null, tpl)
}
