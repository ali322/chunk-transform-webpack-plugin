var path = require("path")
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ChunkTransformPlugin = require("../")

module.exports = {
    entry: {
        'main': ["./main.js", "./main.less"],
        'common': ["normalize.css/normalize.css"]
    },
    module: {
        loaders: [{
                test: /\.js$/,
                loader: 'babel'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'url?limit=500'
            }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".less"]
    },
    output: {
        path: "dist",
        filename: "[name]-[hash:8].js"
    },
    plugins: [
        new ExtractTextPlugin("[name]-[hash:8].css"),
        new ChunkTransformPlugin({
            test: /\.css/,
            chunks: ['common'],
            filename: function(filename) { return "./" + path.basename(filename) }
        })
    ]
}