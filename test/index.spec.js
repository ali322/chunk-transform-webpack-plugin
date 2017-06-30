let webpack = require('webpack')
let path = require('path')
let expect = require('chai').expect
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let ChunkTransformPlugin = require('../')

describe('ChunkTransformPlugin', () => {
    it('should work correctly', done => {
        webpack({
            entry: [
                path.resolve(__dirname, 'fixture', 'entry.js'),
                path.resolve(__dirname, 'fixture', 'entry.css'),
            ],
            module: {
                rules: [{
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        use: 'css-loader',
                        fallback: 'style-loader'
                    })
                }]
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[name].js'
            },
            plugins: [
                new ExtractTextPlugin("[name].css"),
                new ChunkTransformPlugin({
                    test: /\.css/,
                    chunks: ['main']
                })
            ]
        },(err,stats)=>{
            expect(err).to.be(null)
            const css = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'dist', 'main.css'))
            expect(css.length).to.above(0)
            done()
        })
    })
})