const path = require('path')
const poststylus = require('poststylus')
const pxtorem = require('postcss-pxtorem')
const resolve = (file) => path.resolve(__dirname, file)
const MODE = process.env.VUE_APP_MODE
let outputDir, assetsDir
if (MODE === 'test') {
  outputDir = 'dist/test'
  assetsDir = './static'
} else if (MODE === 'stage') {
  outputDir = 'dist/gray'
  assetsDir = './static'
} else if (MODE === 'release') {
  outputDir = 'dist/release'
  assetsDir = './static'
}
let baseURL = ''
if (MODE === 'dev') {
  // 开发
  baseURL = 'http://118.31.222.92'
} else if (MODE === 'testdev') {
  // 测试环境
  baseURL = 'http://118.31.222.92'
} else if (MODE === 'stagedev') {
  // 灰度环境
  baseURL = 'http://118.31.222.92'
} else if (MODE === 'releasedev') {
  // 正式环境
  baseURL = 'http://118.31.222.92'
}

// 引入插件
const {
  skeleton,
  TerserPlugin,
  compressionWebpackPlugin,
  zipPlugin,
} = require('./webpack.plugin')
// 按需加载插件
const pluginsFnc = () => {
  if (process.env.NODE_ENV === 'production') {
    //TerserPlugin 去除console.log。
    //zipPlugin打包压缩代码Zipt包
    //skeleton骨架屏
    //compressionWebpackPlugin开始gzip压缩
    return [TerserPlugin, zipPlugin, skeleton, compressionWebpackPlugin]
  } else {
    return []
  }
}
module.exports = {
  publicPath: '',
  outputDir: outputDir,
  assetsDir: assetsDir,
  indexPath: 'index.html',
  // https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
  // 不是这个 https://www.npmjs.com/package/style-resources-loader
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/style/var.less')], // 引入全局样式变量
    },
  },
  css: {
    loaderOptions: {
      // https://github.com/ant-design/ant-motion/issues/44
      less: {
        javascriptEnabled: true,
        use: [
          poststylus([
            pxtorem({
              rootValue: 100,
              propWhiteList: [],
              minPixelValue: 2,
            }),
            'autoprefixer',
          ]),
        ],
        import: [resolve('./src/assets/theme.custom')],
      },
      stylus: {
        use: [
          poststylus([
            pxtorem({
              rootValue: 100,
              propWhiteList: [],
              minPixelValue: 2,
            }),
            'autoprefixer',
          ]),
        ],
        import: [resolve('./src/assets/theme.custom')],
      },
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 100,
            propWhiteList: [],
            minPixelValue: 2,
          }),
          require('autoprefixer')(),
        ],
      },
    },
  },
  transpileDependencies: ['mand-mobile'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@views': resolve('src/views'),
        '@components': resolve('src/components'),
        '@assets': resolve('src/assets'),
        '@router': resolve('src/router'),
        '@common': resolve('src/common'),
        '@store': resolve('src/store'),
        '@layout': resolve('src/layout'),
        '@api': resolve('src/api'),
        '@config': resolve('src/config'),
      },
    },
    plugins: pluginsFnc(),
  },
  //本地服务器代理
  devServer: {
    host: '0.0.0.0',
    proxy: baseURL, // 服务器ip
    // proxy: 'http://101.37.27.140:8083',
    port: '8080', //端口
  },
}
