chunk-transform-webpack-plugin [![Build Status](https://travis-ci.org/ali322/chunk-transform-webpack-plugin.svg?branch=master)](https://travis-ci.org/ali322/chunk-transform-webpack-plugin) 
[![npm version](https://badge.fury.io/js/chunk-transform-webpack-plugin.svg)](https://badge.fury.io/js/chunk-transform-webpack-plugin)
===
[![NPM](https://nodei.co/npm/chunk-transform-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/chunk-transform-webpack-plugin/)

useful webpack plugin that transform chunk on fly,change existed chunk's files or create new chunk that contain specified chunk's files

Install
===

```javascript
npm install chunk-transform-webpack-plugin --save--dev
```

Usage
===

add plugin in your webpack.config.js

```javascript
var ChunkTransformPlugin = require('chunk-transform-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry:{
        index:"./index.js",
        vendor:"./vendor.css"
    },
    module:{
        loaders:[
            ...
        ]
    },
    output:{
        path:'./dist',
        filename:'[name].min.js'
    },
    plugins:[
        new ExtractTextPlugin('[name]-[hash].css'),
        new ChunkTransformPlugin({
            filename:'./vendor.css',
            chunks:['vendor'],
            test:/\.css/
        })
    ]
}
```

Plugin Options
===

- **filename**: dist chunk files template,accept string or function that take original filename as argument
- **chunks**: array of chunks changed
- **chunkName**: new chunk name that contain specified chunk's files
- **test**: predicator of chunk's files,accept regxp expression or function that take original filename as argument or string that exactly match file

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)