const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/store/' : '/',
  devServer: {
    port: 8090,
    open: false,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost/api',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
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
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  },
  css: {
    loaderOptions: {
      sass: {
        data:
          '@import "@/assets/scss/_var.scss";'
      }
    }
  }
};
