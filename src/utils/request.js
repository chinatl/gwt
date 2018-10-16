import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import router from '@/router'
// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  timeout: 150000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers.userAgent = 'PC';// 让每个请求携带自定义userAgent 请根据实际情况自行修改
    // config.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';// 让每个请求携带自定义userAgent 请根据实际情况自行修改
    if (store.getters.token) {
      config.headers.Authorization = store.getters.token;// 让每个请求携带自定义token 请根据实际情况自行修改
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
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.sEcho === '1' || res.ret === 0 || typeof res.data === 'object' || typeof res.recordsTotal === 'number' || res.result
      && res.result !== "7001"
      && res.result !== "7000"
      && res.result !== "7002") {
      return response.data
    } else {
      Message({
        message: res.msg || res.message,
        type: 'error',
        duration: 5 * 1000
      })
      if (res.result === '7002') {
        Message({
          message: '该账号已在其他设备登陆，您已被登出！',
          type: 'error'
        });
        router.push({
          path: '/login'
        })
      }
      if (res.result === '7000') {
        Message({
          message: '用户身份过期，请重新登录！',
          type: 'error'
        });
        router.push({
          path: '/login'
        })
      }
      if (res.code === 7002) {
        Message({
          message: '该账号已在其他设备登陆，您已被登出！',
          type: 'error'
        });
        router.push({
          path: '/login'
        })
      }
      return Promise.reject(res)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
