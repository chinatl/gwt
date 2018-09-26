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
      },
      {
        path: 'identity',
        name: '验证身份',
        component: () => import('@/views/forget-pwd/identity'),
      },
      {
        path: 'reset',
        name: '重置密码',
        component: () => import('@/views/forget-pwd/reset'),
      },
      {
        path: 'finish',
        name: '成功',
        component: () => import('@/views/forget-pwd/finish'),
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
        meta: { title: '通知详情' },
      }
    ]
  },
  {
    path: '/stuff-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '材料详情',
        component: () => import('@/views/desc/stuff'),
        meta: { title: '材料详情' },
      }
    ]
  },
  {
    path: '/meeting-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '会议详情',
        component: () => import('@/views/desc/meeting'),
        meta: { title: '会议详情' },
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
        meta: { title: '通知详情' },
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
        meta: { title: '转发通知'  },
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
        meta: { title: '我的消息' },
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
        meta: { title: '举报详情' },
      }
    ]
  },
  {
    path: '/report-desc',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '详情',
        name: '举报详情描述',
        component: () => import('@/views/my-message/report-desc'),
        meta: { title: '详情列表', icon: '消息', up: true },
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
        meta: { title: '域管理' }
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
        meta: { title: '域详情' }
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
        meta: { title: '授权管理' }
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
        meta: { title: '部门管理' }
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
        meta: { title: '角色管理' }
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
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/app-set',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '应用字典',
        component: () => import('@/views/system-set/app'),
        meta: { title: '应用字典' }
      },
    ]
  },
  {
    path: '/resoure-manager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '应用管理',
        component: () => import('@/views/system-set/resource'),
        meta: { title: '资源管理', up: true, },
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
        meta: { title: '数据字典' }
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
        meta: { title: '创建会议' }
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
        meta: { title: '创建通知' }
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
        meta: { title: '材料征集' }
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
        meta: { title: '草稿箱' }
      }
    ]
  },
  {
    path: '/re-drafts',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '草稿编辑',
        component: () => import('@/views/public-notice/re-drafts'),
        meta: { title: '草稿编辑' }
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
        meta: { title: '通知签收' }
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
        meta: { title: '已发通知' }
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
        meta: { title: '通知变更' }
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
        meta: { title: '已转发通知' }
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
        meta: { title: '权限维护' }
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
        meta: { title: '通知维护' }
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
        meta: { title: '创建通知' }
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
        meta: { title: '材料征集' }
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
        component: () => import('@/views/public-notice/drafts'),
        meta: { title: '草稿箱' }
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
        component: () => import('@/views/public-notice/signin'),
        meta: { title: '通知签收' }
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
        meta: { title: '已发通知' }
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
        component: () => import('@/views/public-notice/forwarded'),
        meta: { title: '已转发通知' }
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
        component: () => import('@/views/public-notice/role'),
        meta: { title: '权限维护' }
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
        component: () => import('@/views/public-notice/maintain'),
        meta: { title: '通知维护' }
      }
    ]
  },
  {
    path: '/subject-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '课程列表',
        component: () => import('@/views/edu-train/list'),
        meta: { title: '课程列表' }
      }
    ]
  },
  {
    path: '/user-subject',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '我的课程',
        component: () => import('@/views/edu-train/user'),
        meta: { title: '我的课程' }
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
        meta: { title: '课程类别' }
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
        meta: { title: '题库列表' }
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
        meta: { title: '题库列表' }
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
        meta: { title: '试卷管理' }
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
        meta: { title: '我的考试' }
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
        meta: { title: '历史考试' }
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
        meta: { title: '通讯录' }
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
        meta: { title: '个人云盘' }
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
        meta: { title: '部门云盘' }
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
        meta: { title: '个人中心' },
      },
    ]
  },
  // {
  //   path: '/message',
  //   component: Layout,
  //   meta: { title: '我的消息', icon: '消息' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: '我的消息',
  //       component: () => import('@/views/my-message'),
  //       meta: { title: '我的消息', icon: '消息' },
  //     },
  //     {
  //       path: 'desc',
  //       name: '举报详情',
  //       component: () => import('@/views/my-message/desc'),
  //       meta: { title: '举报详情', icon: '消息', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'report-desc',
  //       name: '举报详情描述',
  //       component: () => import('@/views/my-message/report-desc'),
  //       meta: { title: '详情列表', icon: '消息', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'notice-desc',
  //       name: '通知详情',
  //       component: () => import('@/views/my-message/notice-desc'),
  //       meta: { title: '通知详情', icon: '消息', up: true },
  //       hidden: true
  //     },

  //   ]
  // },
  // {
  //   path: '/public-notice',
  //   component: Layout,
  //   redirect: '/public-notice/meeting',
  //   name: '公务通知',
  //   meta: { title: '公务通知', icon: 'example' },
  //   children: [
  //     {
  //       path: 'meeting',
  //       name: '创建会议',
  //       component: () => import('@/views/public-notice/meeting'),
  //       meta: { title: '创建会议' }
  //     },
  //     {
  //       path: 'notice',
  //       name: '创建通知1',
  //       component: () => import('@/views/public-notice/notice'),
  //       meta: { title: '创建通知' }
  //     },
  //     {
  //       path: 'stuff',
  //       name: '材料征集1',
  //       component: () => import('@/views/public-notice/stuff'),
  //       meta: { title: '材料征集' }
  //     },
  //     {
  //       path: 'drafts',
  //       name: '草稿箱1',
  //       component: () => import('@/views/public-notice/drafts'),
  //       meta: { title: '草稿箱' }
  //     },
  //     {
  //       path: 'signin',
  //       name: '通知签收1',
  //       component: () => import('@/views/public-notice/signin'),
  //       meta: { title: '通知签收' }
  //     },
  //     {
  //       path: 'active',
  //       name: '已发通知1',
  //       component: () => import('@/views/public-notice/active'),
  //       meta: { title: '已发通知' }
  //     },
  //     {
  //       path: 'forwarded',
  //       name: '已转发通知1',
  //       component: () => import('@/views/public-notice/forwarded'),
  //       meta: { title: '已转发通知' }
  //     },
  //     {
  //       path: 'role',
  //       name: '权限维护1',
  //       component: () => import('@/views/public-notice/role'),
  //       meta: { title: '权限维护' }
  //     },
  //     {
  //       path: 'maintain',
  //       name: '通知维护1',
  //       component: () => import('@/views/public-notice/maintain'),
  //       meta: { title: '通知维护' }
  //     },
  //   ]
  // },
  // {
  //   path: '/website',
  //   component: Layout,
  //   redirect: '/website/notice',
  //   name: '网站信息',
  //   meta: { title: '网站信息', icon: '电脑' },
  //   children: [
  //     {
  //       path: 'notice',
  //       name: '创建通知',
  //       component: () => import('@/views/web-info/notice'),
  //       meta: { title: '创建通知' }
  //     },
  //     {
  //       path: 'drafts',
  //       name: '草稿箱',
  //       component: () => import('@/views/web-info/drafts'),
  //       meta: { title: '草稿箱' }
  //     },
  //     {
  //       path: 'signin',
  //       name: '通知签收',
  //       component: () => import('@/views/web-info/signin'),
  //       meta: { title: '通知签收' }
  //     },
  //     {
  //       path: 'active',
  //       name: '已发通知',
  //       component: () => import('@/views/web-info/active'),
  //       meta: { title: '已发通知' }
  //     },
  //     {
  //       path: 'forwarded',
  //       name: '已转发通知',
  //       component: () => import('@/views/web-info/forwarded'),
  //       meta: { title: '已转发通知' }
  //     },
  //     {
  //       path: 'role',
  //       name: '权限维护',
  //       component: () => import('@/views/web-info/role'),
  //       meta: { title: '权限维护' }
  //     },
  //     {
  //       path: 'maintain',
  //       name: '通知维护',
  //       component: () => import('@/views/web-info/maintain'),
  //       meta: { title: '通知维护' }
  //     },
  //   ]
  // },
  // {
  //   path: '/edu-train',
  //   component: Layout,
  //   redirect: '/edu-train/user',
  //   name: '教育培训',
  //   meta: { title: '教育培训', icon: '云盘' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: '课程列表',
  //       component: () => import('@/views/edu-train/list'),
  //       meta: { title: '课程列表' }
  //     },
  //     {
  //       path: 'user',
  //       name: '我的课程',
  //       component: () => import('@/views/edu-train/user'),
  //       meta: { title: '我的课程' }
  //     },
  //     {
  //       path: 'category',
  //       name: '课程类别',
  //       component: () => import('@/views/edu-train/category'),
  //       meta: { title: '课程类别' }
  //     },
  //     {
  //       path: 'chapter',
  //       name: '课程章节',
  //       component: () => import('@/views/edu-train/chapter'),
  //       meta: { title: '课程章节', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'progress',
  //       name: '学习进度',
  //       component: () => import('@/views/edu-train/progress'),
  //       meta: { title: '学习进度', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'exercise',
  //       name: '课程练习题',
  //       component: () => import('@/views/edu-train/exercise'),
  //       meta: { title: '课程练习题', up: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'create',
  //       name: '创建课程',
  //       component: () => import('@/views/edu-train/createSubject.vue'),
  //       meta: { title: '创建课程', up: true },
  //       hidden: true
  //     },
  //   ]
  // },
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
  {
    path: '/mail-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通讯录',
        component: () => import('@/views/mail-list'),
        meta: { title: '通讯录', icon: '通讯录', requiresAuth: true }
      }
    ]
  },
  {
    path: '/cloud-disk',
    component: Layout,
    redirect: '/cloud-disk/user',
    name: '云盘',
    meta: { title: '云盘', icon: '云盘' },
    children: [
      {
        path: 'user',
        name: '个人云盘',
        component: () => import('@/views/cloud-disk/user'),
        meta: { title: '个人云盘' }
      },
      {
        path: 'company',
        name: '部门云盘',
        component: () => import('@/views/cloud-disk/company'),
        meta: { title: '部门云盘' }
      }
    ]
  },
  {
    path: '/person-center',
    component: Layout,
    redirect: '/person-center/index',
    name: '个人中心',
    meta: { title: '', icon: '云盘' },
    hidden: true,
    children: [
      {
        path: 'index',
        name: '个人中心-字属性',
        component: () => import('@/views/person-center'),
        meta: { title: '个人中心' },
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  // mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

