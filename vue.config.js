let path = require('path')
module.exports = {
    productionSourceMap: false,
    devServer: {
        proxy: {//配置跨域
            '/api': {
                target: process.env.VUE_APP_APIDOMAIN + '/api',//这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: true,
                changOrigin: true,//允许跨域
                pathRewrite: {
                    '^/api': ''//请求的时候使用这个api就可以
                }
            }

        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [path.resolve(__dirname, 'src/assets/weui/weui.less')]
      }
    }
}
