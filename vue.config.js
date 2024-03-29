const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  //WAP打包时 此行代码需注释
  publicPath: './',
  assetsDir: './',
  devServer: {
    port: 9090,
    open: false,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://m.5gyungou.com/api',
        // target: 'http://20g5198x42.imwork.net:42915',
        // target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets')
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/_var.scss";'
      }
    }
  }
}
