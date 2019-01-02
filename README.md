# @to8to/twig-loader 
解决在前端复用twig模板，在webpack打包时可以对.twig文件进行解析，其作用主要再与对.twig进行预编译，直接导出render函数，方便开发者使用，提高性能。

## 安装

`npm install @to8to/twig-loader --save`


## 说明
> 此模块是在 twig-loader@0.4.1 基础上修改

## 配置

``` javascript

module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.twig$/,
                loader: "twig-loader",
                options: {
                    // See options section below
                },
            }
        ]
    },

    node: {
        fs: "empty" // avoids error messages
    }
};
```

### 参数

- `twigOptions`: optional; a map of options to be passed through to Twig.
  Example: `{autoescape: true}`

## 示例

#### 简单使用

> dialog.html.twig
```twig
{# File: dialog.html.twig #}
<p>{{title}}</p>
```
> index.js
```javascript

import dialog from './dialog.html.twig'
var html = dialog({title: 'dialog title'});
// do something...

// or 

// async
// 可以自己实现 async await
function showDialog(options, callback) {
     require.ensure([], (require) => {
        const render = require('./dialog.html.twig')
        callback(render(options))
    }, 'yangpan')
}

showDialog({
    title: 'dialog title',
}, () => {
    // do something
})


```

#### macro
> test.html.twig
``` js
{% macro yourMacroName(comment) %}
    <div>{{comment}}</div>
{% endmacro %}
```
> index.js

``` js
import { macro } from 'test.html.twig'

macro('render', 'hello word').then((html) => {
   // do something
})
// or ---

async function rendrTest() {
    let html = await macro('yourMacroName', 'hello word')
    // do something
    // ...
}
```