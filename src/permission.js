import router from './router'
import store from './store'
console.log(sessionStorage.getItem("login-info"))
router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem("login-info")) {
        next()
        // if (to.path === '/login') {
        //   next({ path: '/' })
        // }
    } else {
        next()
    }
})
