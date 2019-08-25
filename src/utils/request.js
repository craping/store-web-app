import axios from 'axios'
import { Toast, Dialog } from 'vant'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    if(!config.params || !config.params.format)
      config.params = {...config.params, format: 'json' };
  // config.data.token = getToken();
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.errcode) {
      Toast.fail(res.msg);

      // 401:未登录;
      if (res.errcode === 401||res.errcode === 403) {
        Dialog.confirm({
          title: '确定登出',
          message: '你已被登出，可以取消继续留在该页面，或者重新登录',
          confirmButtonText: '重新登录'
        }).then(() => {
          // on confirm
        }).catch(() => {
          // on cancel
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Toast.fail(error.message);
    return Promise.reject(error)
  }
)

export default service
