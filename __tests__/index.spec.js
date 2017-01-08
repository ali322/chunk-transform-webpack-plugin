import test from 'ava'
import webpack from 'webpack'
import path from 'path'
import ChunkTransformPlugin from "../"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import fs from 'fs'

const OUTPUT_PATH = path.join(__dirname, "fixtures", "dist")
const VENDOR_FILE = "./vendor.css"

test.cb('should transform chunk', t => {
    var compiler = webpack({
        entry: {
            main: path.join(__dirname, 'fixtures', 'entry.js'),
            vendor: [path.join(__dirname, 'fixtures', 'vendor.css')]
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loader: 'babel'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            }]
        },
        output: {
            path: OUTPUT_PATH,
            filename: "[name].min.js"
        },
        plugins: [
            new ExtractTextPlugin("[name]-[hash].css"),
            new ChunkTransformPlugin({
                filename: VENDOR_FILE,
                test: /\.css/,
                chunks: ['vendor']
            })
        ]
    }, (err, stats) => {
        t.ifError(err, 'err is null')
        const _css = fs.readFileSync(path.resolve(path.join(__dirname, "fixtures", "dist", VENDOR_FILE)), 'utf8')
        t.true(_css.length > 0, 'found css')
        t.end()
    })
})