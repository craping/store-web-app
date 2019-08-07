import axios from 'axios'
import { Toast, Dialog } from 'vant'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
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
    const data = response.data
    if (data.errcode) {
      Toast.fail(data.msg);

      // 401:未登录;
      if (data.errcode === 401||data.errcode === 403) {
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
      return Promise.reject('error')
    } else {
      return data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Toast.fail(error.message);
    return Promise.reject(error)
  }
)

export default service
