import router from './router'
import store from './store'
console.log(sessionStorage.getItem("login-info"))
// router.beforeEach((to, from, next) => {
//   console.log(to)
//   if (sessionStorage.getItem("login-info")) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//     }
//   } else {
//     next()
//   }
// })
