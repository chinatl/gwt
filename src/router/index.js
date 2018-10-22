import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/login/message', component: () => import('@/views/login/message'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },
  {
    path: '/dashboard',
    redirect: '/user-message/index',
  },
  {
    path: '/',
    redirect: '/login',
    component: () => import('@/views/login/index'), hidden: true
  },
  {
    path: '/forgetpwd',
    component: () => import('@/views/forget-pwd/index'), hidden: true,
    redirect: '/forgetpwd/phone',
    children: [
      {
        path: 'phone',
        name: '验证手机号',
        component: () => import('@/views/forget-pwd/phone'),
        beforeEnter(to, from, next) {
          if (!sessionStorage.getItem("set-forget")) {
            next('/')
          }
          if (from.fullPath === '/' ||
            from.fullPath === '/login') {
            next()
          } else {
            next('/')
          }
        }
      },
      {
        path: 'identity',
        name: '验证身份',
        component: () => import('@/views/forget-pwd/identity'),
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("set-forget") !== 'false') {
            next('/')
          }
          if (from.fullPath === '/' ||
            from.fullPath === '/forgetpwd/phone') {
            next()
          } else {
            next('/')
          }
        }
      },
      {
        path: 'reset',
        name: '重置密码',
        component: () => import('@/views/forget-pwd/reset'),
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("set-forget") !== 'false') {
            next('/')
          }
          if (from.fullPath === '/' ||
            from.fullPath === '/forgetpwd/identity') {
            next()
          } else {
            next('/')
          }
        }
      },
      {
        path: 'finish',
        name: '成功',
        component: () => import('@/views/forget-pwd/finish'),
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("set-forget") !== 'false') {
            next('/')
          }
          if (from.fullPath === '/' ||
            from.fullPath === '/forgetpwd/finish') {
            next()
          } else {
            next('/')
          }
        }
      },
    ]
  },
  {
    path: '/firstlogin',
    component: () => import('@/views/login/first'), hidden: true,
    redirect: '/firstlogin/new',
    children: [
      {
        path: 'new',
        name: '新用户验证',
        component: () => import('@/views/login/new'),
      },
      {
        path: 'edit',
        name: '修改密码',
        component: () => import('@/views/login/edit'),
      },
      {
        path: 'success',
        name: '修改成功',
        component: () => import('@/views/login/success'),
      },
    ]
  },
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  {
    path: '/notice-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通知详情',
        component: () => import('@/views/desc/notice'),
        meta: { title: '通知详情', requiresAuth: true, name: '通知详情', up: true },
      }
    ]
  },
  {
    path: '/stuff-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '材料征集详情',
        component: () => import('@/views/desc/stuff'),
        meta: { title: '材料征集详情', requiresAuth: true, name: '材料征集', up: true },
      }
    ]
  },
  {
    path: '/meeting-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '会议通知详情',
        component: () => import('@/views/desc/meeting'),
        meta: { title: '会议通知详情', requiresAuth: true, up: true },
      }
    ]
  },
  {
    path: '/active-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '已发通知详情',
        component: () => import('@/views/desc/active'),
        meta: { title: '通知详情', requiresAuth: true, up: true },
      }
    ]
  },
  {
    path: '/forward-notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '转发通知',
        component: () => import('@/views/desc/forward-notice'),
        meta: { title: '转发通知', requiresAuth: true, up: true },
      }
    ]
  },
  {
    path: '/forward-website',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '转发通知',
        component: () => import('@/views/desc/forward-website'),
        meta: { title: '转发通知', requiresAuth: true, up: true },
      }
    ]
  },
  {
    path: '/file-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '文件举报详情',
        component: () => import('@/views/desc/file'),
        meta: { title: '文件举报详情', requiresAuth: true, up: true },
      }
    ]
  },
  {
    path: '/website-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-通知详情',
        component: () => import('@/views/desc/website'),
        meta: { title: '通知详情', requiresAuth: true, up: true }
      }
    ]
  },
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  //--------------------------------------------------------
  {
    path: '/user-message',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '我的消息',
        component: () => import('@/views/my-message'),
        meta: { title: '我的消息', requiresAuth: true, icon: '消息' },
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '举报详情',
        component: () => import('@/views/my-message/desc'),
        meta: { title: '举报详情', requiresAuth: true },
      }
    ]
  },
  {
    path: '/report-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '举报详情描述',
        component: () => import('@/views/my-message/report-desc'),
        meta: { title: '举报详情', up: true, requiresAuth: true },
      }
    ]
  },
  {
    path: '/field-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '域管理',
        component: () => import('@/views/manager-center/field-manager'),
        meta: { title: '域管理', requiresAuth: true, name: '域管理', role: true }
      }
    ]
  },
  {
    path: '/field-manager-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '域详情',
        component: () => import('@/views/manager-center/field-manager-desc'),
        meta: { title: '域详情', requiresAuth: true, name: '域管理', role: true, up: true }
      }
    ]
  },
  {
    path: '/field-manager-auth',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '授权管理',
        component: () => import('@/views/manager-center/field-manager-auth'),
        meta: { title: '授权管理', requiresAuth: true, name: '域管理', role: true, up: true }
      }
    ]
  },
  {
    path: '/part-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '部门管理',
        component: () => import('@/views/manager-center/part-manager'),
        meta: { title: '部门管理', requiresAuth: true, name: '部门管理', role: true }
      }
    ]
  },
  {
    path: '/role-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '角色管理',
        component: () => import('@/views/manager-center/role-manager'),
        meta: { title: '角色管理', requiresAuth: true, name: '角色管理', role: true }
      }
    ]
  },
  {
    path: '/user-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '用户管理',
        component: () => import('@/views/manager-center/user-manager'),
        meta: { title: '用户管理', requiresAuth: true, name: '用户管理', role: true }
      }
    ]
  },
  {
    path: '/app-set',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '应用管理',
        component: () => import('@/views/system-set/app'),
        meta: { title: '应用管理', requiresAuth: true, name: '应用管理', role: true }
      },
    ]
  },
  {
    path: '/resoure-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '资源管理',
        component: () => import('@/views/system-set/resource'),
        meta: {
          title: '资源管理', up: true, requiresAuth: true, name: '应用管理', role: true
        },
      },
    ]
  },
  {
    path: '/date-set',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '数据字典',
        component: () => import('@/views/system-set/data'),
        meta: { title: '数据字典', requiresAuth: true, name: '数据字典', role: true }
      },

    ]
  },
  {
    path: '/create-meeting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '创建会议',
        component: () => import('@/views/public-notice/meeting'),
        meta: { title: '创建会议', requiresAuth: true, name: '创建会议', role: true }
      }
    ]
  },
  {
    path: '/create-notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '创建通知',
        component: () => import('@/views/public-notice/notice'),
        meta: { title: '创建通知', requiresAuth: true, name: '创建通知', role: true }
      }
    ]
  },
  {
    path: '/stuff',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '材料征集',
        component: () => import('@/views/public-notice/stuff'),
        meta: { title: '材料征集', requiresAuth: true, name: '材料征集', role: true }
      }
    ]
  },
  {
    path: '/drafts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '草稿箱',
        component: () => import('@/views/public-notice/drafts'),
        meta: { title: '草稿箱', requiresAuth: true, name: '草稿箱', role: true }
      }
    ]
  },
  {
    path: '/re-drafts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通知编辑',
        component: () => import('@/views/public-notice/re-drafts'),
        meta: { title: '通知编辑', requiresAuth: true, name: '草稿箱', role: true, up: true }
      }
    ]
  },
  {
    path: '/signin',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通知签收',
        component: () => import('@/views/public-notice/signin'),
        meta: { title: '通知签收', requiresAuth: true, name: '通知签收', role: true }
      }
    ]
  },
  {
    path: '/active',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '已发通知',
        component: () => import('@/views/public-notice/active'),
        meta: { title: '已发通知', requiresAuth: true, name: '已发通知', role: true }
      }
    ]
  },
  {
    path: '/notice-change',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通知变更',
        component: () => import('@/views/public-notice/change'),
        meta: { title: '通知变更', requiresAuth: true, name: '已发通知', role: true, up: true }
      }
    ]
  },
  {
    path: '/forwarded',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '已转发通知',
        component: () => import('@/views/public-notice/forwarded'),
        meta: { title: '已转发通知', requiresAuth: true, name: '已转发通知', role: true }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '权限维护',
        component: () => import('@/views/public-notice/role'),
        meta: { title: '权限维护', requiresAuth: true, name: '权限维护', role: true }
      }
    ]
  },
  {
    path: '/maintain',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通知维护',
        component: () => import('@/views/public-notice/maintain'),
        meta: { title: '通知维护', name: '通知维护', role: true }
      }
    ]
  },
  {
    path: '/circulate-drafts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '公告-草稿箱',
        component: () => import('@/views/circulate/drafts'),
        meta: { title: '草稿箱', name: '草稿箱', role: true }
      }
    ]
  },
  {
    path: '/circulate-tidings',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '来文传阅',
        component: () => import('@/views/circulate/tidings'),
        meta: { title: '来文传阅', name: '来文传阅', role: true }
      }
    ]
  },
  {
    path: '/circulate-send-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '发文管理',
        component: () => import('@/views/circulate/send'),
        meta: { title: '发文管理', name: '发文管理', role: true }
      }
    ]
  },
  {
    path: '/circulate-reveive-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '来文管理',
        component: () => import('@/views/circulate/reveive'),
        meta: { title: '来文管理', name: '来文管理', role: true }
      }
    ]
  },


  {
    path: '/website-create-notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-创建通知',
        component: () => import('@/views/website/notice'),
        meta: { title: '创建通知', requiresAuth: true }
      }
    ]
  },
  {
    path: '/website-stuff',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-材料征集',
        component: () => import('@/views/public-notice/stuff'),
        meta: { title: '材料征集', requiresAuth: true }
      }
    ]
  },
  {
    path: '/website-drafts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-草稿箱',
        component: () => import('@/views/website/drafts'),
        meta: { title: '草稿箱', requiresAuth: true }
      }
    ]
  },
  {
    path: '/website-re-drafts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通知编辑',
        component: () => import('@/views/website/re-drafts'),
        meta: { title: '通知编辑', requiresAuth: true, name: '草稿箱', role: true, up: true }
      }
    ]
  },
  {
    path: '/website-signin',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-通知签收',
        component: () => import('@/views/website/signin'),
        meta: { title: '通知签收', requiresAuth: true }
      }
    ]
  },
  {
    path: '/website-active',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-已发通知',
        component: () => import('@/views/website/active'),
        meta: { title: '已发通知', requiresAuth: true }
      }
    ]
  },
  {
    path: '/website-active-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-已发通知详情',
        component: () => import('@/views/desc/website-active'),
        meta: { title: '通知详情', requiresAuth: true, up: true },
      }
    ]
  },
  {
    path: '/website-change',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-通知变更',
        component: () => import('@/views/website/change'),
        meta: { title: '通知变更', requiresAuth: true, up: true, name: '已发通知' }
      }
    ]
  },
  {
    path: '/website-forwarded',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-已转发通知',
        component: () => import('@/views/website/forwarded'),
        meta: { title: '已转发通知', requiresAuth: true }
      }
    ]
  },

  {
    path: '/website-role',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-权限维护',
        component: () => import('@/views/website/role'),
        meta: { title: '权限维护', requiresAuth: true }
      }
    ]
  },
  {
    path: '/website-maintain',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '网站信息-通知维护',
        component: () => import('@/views/website/maintain'),
        meta: { title: '通知维护', requiresAuth: true }
      }
    ]
  },
  // 教育培训
  {
    path: '/subject-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '课程列表',
        component: () => import('@/views/edu-train/list'),
        meta: { title: '课程列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/edu-train',
    component: Layout,
    children: [
      {
        path: 'chapter',
        name: '课程章节',
        component: () => import('@/views/edu-train/chapter'),
        meta: { title: '课程章节', up: true },
        hidden: true
      },
    ]
  },
  {
    path: '/edu-train',
    component: Layout,
    children: [
      {
        path: 'progress',
        name: '学习进度',
        component: () => import('@/views/edu-train/progress'),
        meta: { title: '学习进度', up: true },
        hidden: true
      },
    ]
  },
  {
    path: '/edu-train',
    component: Layout,
    children: [
      {
        path: 'exercise',
        name: '课程练习题',
        component: () => import('@/views/edu-train/exercise'),
        meta: { title: '课程练习题', up: true },
        hidden: true
      },
    ]
  },
  {
    path: '/edu-train',
    component: Layout,
    children: [
      {
        path: 'create',
        name: '创建课程',
        component: () => import('@/views/edu-train/createSubject'),
        meta: { title: '创建课程', up: true },
        hidden: true
      },
    ]
  },
  {
    path: '/edu-train',
    component: Layout,
    children: [
      {
        path: 'chapter',
        name: '课程章节',
        component: () => import('@/views/edu-train/chapter'),
        meta: { title: '课程章节', up: true },
        hidden: true
      },
    ]
  },
  // ---------
  {
    path: '/user-subject',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '我的课程',
        component: () => import('@/views/edu-train/user'),
        meta: { title: '我的课程', requiresAuth: true }
      }
    ]
  },
  {
    path: '/subject-category',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '课程类别',
        component: () => import('@/views/edu-train/category'),
        meta: { title: '课程类别', requiresAuth: true }
      }
    ]
  },
  {
    path: '/question-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '题库列表',
        component: () => import('@/views/online-test/questionlist'),
        meta: { title: '题库列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/paper-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '试卷管理',
        component: () => import('@/views/online-test/testpaper'),
        meta: { title: '试卷管理', requiresAuth: true }
      }
    ]
  },
  {
    path: '/user-test',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '我的考试',
        component: () => import('@/views/online-test/user'),
        meta: { title: '我的考试', requiresAuth: true }
      }
    ]
  },
  {
    path: '/history-test',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '历史考试',
        component: () => import('@/views/online-test/history'),
        meta: { title: '历史考试', requiresAuth: true }
      }
    ]
  },
  {
    path: '/anno-find',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '公告管理',
        component: () => import('@/views/anno/find'),
        meta: { title: '公告管理', requiresAuth: true }
      }
    ]
  },
  {
    path: '/anno-maintain',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '公告维护',
        component: () => import('@/views/anno/maintain'),
        meta: { title: '公告维护', requiresAuth: true }
      }
    ]
  },
  {
    path: '/anno-build',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '创建公告',
        component: () => import('@/views/anno/add'),
        meta: { title: '创建公告', requiresAuth: true, name: '公告维护', up: true }
      }
    ]
  },
  {
    path: '/anno-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '公告详情',
        component: () => import('@/views/anno/desc'),
        meta: { title: '公告详情', name: '公告维护', up: true }
      }
    ]
  },
  {
    path: '/mail-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通讯录',
        component: () => import('@/views/mail-list'),
        meta: { title: '通讯录', requiresAuth: true }
      }
    ]
  },
  {
    path: '/user-cloud-disk',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '个人云盘',
        component: () => import('@/views/cloud-disk/user'),
        meta: { title: '个人云盘', requiresAuth: true }
      }
    ]
  },
  {
    path: '/part-cloud-disk',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '部门云盘',
        component: () => import('@/views/cloud-disk/company'),
        meta: { title: '部门云盘', requiresAuth: true }
      }
    ]
  },
  {
    path: '/person-center',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '个人中心',
        component: () => import('@/views/person-center'),
        meta: { title: '个人中心', requiresAuth: true },
      },
    ]
  },
  

 

 
  // {
  //   path: '/online-test',
  //   component: Layout,
  //   redirect: '/edu-train/user',
  //   name: '在线考试',
  //   meta: { title: '在线考试', icon: '云盘' },
  //   children: [
  //     {
  //       path: 'questionlist',
  //       name: '题库列表',
  //       component: () => import('@/views/online-test/questionlist'),
  //       meta: { title: '题库列表' }
  //     },
  //     {
  //       path: 'edit',
  //       name: '题库编辑',
  //       component: () => import('@/views/online-test/question_edit'),
  //       meta: { title: '题库编辑', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'testpaper',
  //       name: '试卷管理',
  //       component: () => import('@/views/online-test/testpaper'),
  //       meta: { title: '试卷管理' }
  //     },
  //     {
  //       path: 'create',
  //       name: '创建试卷',
  //       component: () => import('@/views/online-test/createPaper'),
  //       meta: { title: '创建试卷', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'refresh',
  //       name: '更新试卷',
  //       component: () => import('@/views/online-test/refreshPaper'),
  //       meta: { title: '更新试卷', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'testdesc',
  //       name: '考试详情',
  //       component: () => import('@/views/online-test/testdesc'),
  //       meta: { title: '考试详情', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'user',
  //       name: '我的考试',
  //       component: () => import('@/views/online-test/user'),
  //       meta: { title: '我的考试' }
  //     },
  //     {
  //       path: 'history',
  //       name: '历史考试',
  //       component: () => import('@/views/online-test/history'),
  //       meta: { title: '历史考试' }
  //     }
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  // mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

