# twig-loader [![Build Status](https://travis-ci.org/zimmo-be/twig-loader.svg)](https://travis-ci.org/zimmo-be/twig-loader)
Webpack loader for compiling Twig.js templates. This loader will allow you to require Twig.js views to your code.

## Installation

`npm install twig-loader`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html?branch=master)

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

### Options

- `twigOptions`: optional; a map of options to be passed through to Twig.
  Example: `{autoescape: true}`

## Loading templates

```twig
{# File: dialog.html.twig #}
<p>{{title}}</p>
```

#### normal
```javascript

// File: app.js
import dialog from 'dialog.html.twig'
var html = dialog({title: 'dialog title'});
// do something


// async
function showDialog(options, callback) {
     require.ensure([], (require) => {
        const render = require('./one.bor.twig')
        callback(render(options))
    }, 'yangpan')
}

```

#### macro
> test.html.twig
``` js
{% macro render(comment) %}
    <div>{{comment}}</div>
{% endmacro %}
```
> js
``` js
import { macro } from 'test.html.twig'

macro('render', 'hello word').then((html) => {
   // do something
})
// or ---

async function rendrTest() {
    let html = await macro('render', 'hello word')
    // do something
}
```


