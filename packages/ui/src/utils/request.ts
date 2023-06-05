import request from 'axios'

request.defaults.baseURL = 'http://localhost:8002'

// 统一处理 axios 异常错误
request.interceptors.response.use(
   (response) => {
      return response
   },
   (error) => {
      if (error.response) {
         // 请求已发出，但服务器响应的状态码不在 2xx 范围内
         console.log(error.response.data)
         console.log(error.response.status)
         console.log(error.response.headers)
         // alert(error.response.data)
         typeof error.response.data === 'string' &&
            window.alert2('服务错误：' + error.response.data)
      } else {
         // 在设置触发错误的请求时发生了一些事情
         console.log('Error', error.message)
      }
      console.log(error.config)
      return Promise.reject(error)
   },
)

export default request
