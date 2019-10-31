import axios from 'axios'
import sync from '@/utils/sync'
import { Toast, Dialog } from 'vant'
import { getToken } from '@/utils/auth'
import router from '../router';


// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    const isNeedAsync =
      config.url == '/order/create' || config.url == '/order/cancelOrder'
    if (!config.params) {
      config.params = {
        format: isNeedAsync ? 'async' : 'json',
        token: getToken()
      }
    } else {
      config.params = {
        ...{
          format: isNeedAsync ? 'async' : 'json',
          token: getToken()
        },
        ...config.params
      }
    }

    if (config.headers['Content-Type'].includes('application/json')) {
      if (!config.data) {
        config.data = {
          format: isNeedAsync ? 'async' : 'json',
          token: getToken()
        }
      } else {
        config.data = {
          ...{
            format: isNeedAsync ? 'async' : 'json',
            token: getToken()
          },
          ...config.data
        }
      }
    }

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.result) {
      /* Toast.fail(res.msg) */
      // result:1 token错误集;
      if (res.result == 1) {
        // token失效跳转到登录页面
        router.push('/login')
        sync.disconnect()
      }
      let error = new Error(res.msg || 'Error')
      error.errcode = res.errcode
      return Promise.reject(error)
    } else {
      if (res.hasOwnProperty('result')) 
        return res.data
      else 
        return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.errcode) Toast.fail(error.message)
    if(error.response.status == 500) Toast.fail("网络异常，请检查网络设置")
    return Promise.reject(error)
  }
)

export default service
