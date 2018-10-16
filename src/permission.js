import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

var SET_ALL_SLIDER_LIST = sessionStorage.getItem('SET_ALL_SLIDER_LIST');
if (SET_ALL_SLIDER_LIST) {
    store.commit('SET_ALL_SLIDER_LIST', JSON.parse(SET_ALL_SLIDER_LIST))
};
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.meta.requiresAuth) {
        if (sessionStorage.getItem("login-info")) {
            if (to.meta.role) {
                if (store.getters.all_slider_list.map(res => res.resName).join(',').includes(to.meta.name)) {
                    next()
                    NProgress.done()
                } else {
                    next({ path: '/401' })
                    NProgress.done()
                }
            } else {
                next()
                NProgress.done()
            }
        } else {
            next({ path: '/login' })
            NProgress.done()
        }
    } else {
        next();
        NProgress.done()
    }
})
