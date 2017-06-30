let nextIdent = 0
let mapKeys = require('lodash/mapKeys')

function ChunkTransformWebpackPlugin(options) {
    options.chunks = options.chunks || []
    this.options = options
    this.runing = false
    if (typeof options.test === 'function') {
        this.test = options.test;
    } else if (typeof options.test === 'string') {
        this.test = function(filename) { return filename.indexOf(options.test) >= 0; }
    } else if (options.test instanceof RegExp) {
        this.test = function(filename) { return options.test.test(filename); }
    } else {
        throw new Error('Invalid test supplied to ChunkTransformWebpackPlugin')
    }
    this.ident = __filename + (nextIdent++);
}

ChunkTransformWebpackPlugin.prototype.apply = function(compiler) {
    let that = this
    let options = this.options
    let ident = this.ident
    let selected = options.chunks
    let chunkName = options.chunkName
    let transformer = options.filename
    let isFileMatched = this.test

    compiler.plugin('this-compilation', function(compilation) {
        compilation.plugin('optimize-chunks', function(chunks) {
            if (compilation[ident]) return;
            compilation[ident] = true;

            if (chunkName) {
                if (typeof chunkName !== 'string') {
                    throw new Error('Invalid chunkName supplied to ChunkTransformWebpackPlugin')
                }
                chunks = chunks.filter(function(chunk) {
                    return selected.indexOf(chunk.name) >= 0
                })
                let newChunk = chunks.find(function(chunk) {
                    return chunk.name === chunkName
                })
                if (!newChunk) {
                    newChunk = this.addChunk(chunkName)
                    newChunk.initial = newChunk.entry = true
                }
                let usedChunks = chunks.filter(function(chunk) {
                    return chunk !== newChunk
                })
                let commonModules = []
                usedChunks.forEach(function(chunk) {
                    chunk.modules.forEach(function(module) {
                        if (!module.userRequest) return
                        if (commonModules.indexOf(module) === -1 && isFileMatched(module.userRequest)) {
                            commonModules.push(module)
                        }
                    })
                    chunk.parents[newChunk]
                    newChunk.chunks.push(chunk)
                    if (chunk.entry) {
                        // chunk.entry = false
                    }
                })
                commonModules.forEach(function(module) {
                    usedChunks.forEach(module.removeChunk.bind(module))
                    newChunk.addModule(module)
                    module.addChunk(newChunk)
                })
                selected.push(chunkName)
                this.restartApplyPlugins()
            }
            // return true
        })
    })

    compiler.plugin('emit', function(compilation, callback) {
        if (that.runing) {
            callback()
            return
        }
        let namedChunks = compilation.namedChunks
        let assets = compilation.assets

        if (that.isHotUpdateCompilation(assets)) {
            callback()
            return
        }
        selected.forEach(function(v) {
            let _chunkFiles = []
            namedChunks[v].files.forEach(function(file, i) {
                if (isFileMatched(file) === false) {
                    delete assets[file]
                    return
                }
                let _filename = file
                if (typeof transformer === 'function') {
                    _filename = transformer(file)
                } else if (typeof transformer === 'string') {
                    _filename = transformer
                }
                _chunkFiles.push(_filename)
                assets = mapKeys(assets, function(v, k) {
                    if (k == file) {
                        return _filename
                    }
                    return k
                })
            })
            namedChunks[v].files = _chunkFiles
        })
        compilation.assets = assets
        that.runing = true
        callback()
    })
}

ChunkTransformWebpackPlugin.prototype.isHotUpdateCompilation = function(assets) {
    return assets.length && assets.some(function(name) {
        return /\.hot-update\.js$/.test(name);
    })
}

module.exports = ChunkTransformWebpackPlugin