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
import store from '@/store'
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/message/index',
    name: '主页',
    hidden: true,
    children: [{
      path: '主页',
      component: () => import('@/views/dashboard/index')
    }]
  },


  // {
  // 	path: '/example',
  // 	component: Layout,
  // 	redirect: '/example/table',
  // 	name: 'Example',
  // 	meta: { title: 'Example', icon: 'example' },
  // 	children: [
  // 		{
  // 			path: 'table',
  // 			name: 'Table',
  // 			component: () => import('@/views/table/index'),
  // 			meta: { title: 'Table', icon: 'table' }
  // 		},
  // 		{
  // 			path: 'tree',
  // 			name: 'Tree',
  // 			component: () => import('@/views/tree/index'),
  // 			meta: { title: 'Tree', icon: 'tree' }
  // 		}
  // 	]
  // },
  {
    path: '/message',
    component: Layout,
    meta: { title: '我的消息', icon: '消息' },
    children: [
      {
        path: 'index',
        name: '息',
        component: () => import('@/views/my-message'),
        meta: { title: '我的消息', icon: '消息' },

      },
      {
        path: 'desc',
        name: '举报详情',
        component: () => import('@/views/my-message/desc'),
        meta: { title: '举报详情', icon: '消息', hidden: true, up: true },
        hidden: true
      },
      {
        path: 'report-desc',
        name: '举报详情描述',
        component: () => import('@/views/my-message/report-desc'),
        meta: { title: '详情列表', icon: '消息', hidden: true, up: true },
        hidden: true
      },

    ]
  },
  {
    path: '/user-manager',
    component: Layout,
    redirect: '/user-manager/field',
    name: '用户管理',
    meta: { title: '用户管理', icon: '用户' },
    children: [

      {
        path: 'field',
        name: '域管理',
        component: () => import('@/views/user-manager/field'),
        meta: { title: '域管理' },
      },
      {
        path: 'part',
        name: '部门管理',
        component: () => import('@/views/user-manager/part'),
        meta: { title: '部门管理' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/user-manager/role'),
        meta: { title: '角色管理' }
      },
      {
        path: 'user',
        name: '用户管理-用户管理',
        component: () => import('@/views/user-manager/user'),
        meta: { title: '用户管理' }
      },
      {
        path: 'field-desc',
        name: '域管理-子列表',
        component: () => import('@/views/user-manager/fieldDesc'),
        meta: { title: store.getters.field_manager_data.title, hidden: true, temp: true, up: true },
        hidden: true,
      },
      {
        path: 'field-auth',
        name: '域管理-授权管理',
        component: () => import('@/views/user-manager/fieldAuth.vue'),
        meta: { title: '授权管理', hidden: true, up: true },
        hidden: true,
      }
    ]
  },
  {
    path: '/system-set',
    component: Layout,
    redirect: '/system-set/app',
    name: '系统设置',
    meta: { title: '系统设置', icon: '设置' },
    children: [
      {
        path: 'app',
        name: '应用字典',
        component: () => import('@/views/system-set/app'),
        meta: { title: '应用字典' }
      },
      {
        path: 'resource',
        name: '应用管理',
        component: () => import('@/views/system-set/resource'),
        meta: { title: '应用管理', up: true, },
        hidden: true
      },
      {
        path: 'data',
        name: '数据字典',
        component: () => import('@/views/system-set/data'),
        meta: { title: '数据字典' }
      },
    ]
  },

  {
    path: '/public',
    component: Layout,
    redirect: '/public/title1',
    name: '公务通',
    meta: { title: '公务通', icon: 'example' },
    children: [
      {
        path: 'title1',
        name: '公务通资源名称1',
        component: () => import('@/views/public/title1'),
        meta: { title: '公务通资源名称1' }
      },
      {
        path: 'title2',
        name: '公务通资源名称2',
        component: () => import('@/views/public/title2'),
        meta: { title: '公务通资源名称2' }
      },
      {
        path: 'title3',
        name: '公务通资源名称3',
        component: () => import('@/views/public/title3'),
        meta: { title: '公务通资源名称3' }
      },
      {
        path: 'title4',
        name: '公务通资源名称4',
        component: () => import('@/views/public/title4'),
        meta: { title: '公务通资源名称4' }
      },
      {
        path: 'title5',
        name: '公务通资源名称5',
        component: () => import('@/views/public/title5'),
        meta: { title: '公务通资源名称5' }
      },
    ]
  },
  {
    path: '/public-notice',
    component: Layout,
    redirect: '/public-notice/meeting',
    name: '公务通知',
    meta: { title: '公务通知', icon: 'example' },
    children: [
      {
        path: 'meeting',
        name: '创建会议',
        component: () => import('@/views/public-notice/meeting'),
        meta: { title: '创建会议' }
      },
      {
        path: 'notice',
        name: '创建通知1',
        component: () => import('@/views/public-notice/notice'),
        meta: { title: '创建通知' }
      },
      {
        path: 'stuff',
        name: '材料征集1',
        component: () => import('@/views/public-notice/stuff'),
        meta: { title: '材料征集' }
      },
      {
        path: 'drafts',
        name: '草稿箱1',
        component: () => import('@/views/public-notice/drafts'),
        meta: { title: '草稿箱' }
      },
      {
        path: 'signin',
        name: '通知签收1',
        component: () => import('@/views/public-notice/signin'),
        meta: { title: '通知签收' }
      },
      {
        path: 'active',
        name: '已发通知1',
        component: () => import('@/views/public-notice/active'),
        meta: { title: '已发通知' }
      },
      {
        path: 'forwarded',
        name: '已转发通知1',
        component: () => import('@/views/public-notice/forwarded'),
        meta: { title: '已转发通知' }
      },
      {
        path: 'role',
        name: '权限维护1',
        component: () => import('@/views/public-notice/role'),
        meta: { title: '权限维护' }
      },
      {
        path: 'maintain',
        name: '通知维护1',
        component: () => import('@/views/public-notice/maintain'),
        meta: { title: '通知维护' }
      },
    ]
  },
  {
    path: '/website',
    component: Layout,
    redirect: '/website/notice',
    name: '网站信息',
    meta: { title: '网站信息', icon: '电脑' },
    children: [
      {
        path: 'notice',
        name: '创建通知',
        component: () => import('@/views/web-info/notice'),
        meta: { title: '创建通知' }
      },
      {
        path: 'drafts',
        name: '草稿箱',
        component: () => import('@/views/web-info/drafts'),
        meta: { title: '草稿箱' }
      },
      {
        path: 'signin',
        name: '通知签收',
        component: () => import('@/views/web-info/signin'),
        meta: { title: '通知签收' }
      },
      {
        path: 'active',
        name: '已发通知',
        component: () => import('@/views/web-info/active'),
        meta: { title: '已发通知' }
      },
      {
        path: 'forwarded',
        name: '已转发通知',
        component: () => import('@/views/web-info/forwarded'),
        meta: { title: '已转发通知' }
      },
      {
        path: 'role',
        name: '权限维护',
        component: () => import('@/views/web-info/role'),
        meta: { title: '权限维护' }
      },
      {
        path: 'maintain',
        name: '通知维护',
        component: () => import('@/views/web-info/maintain'),
        meta: { title: '通知维护' }
      },
    ]
  },
  {
    path: '/message-list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '通讯录',
        component: () => import('@/views/my-message'),
        meta: { title: '通讯录', icon: '通讯录' }
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
        meta: { title: '个人中心'},
      },
    ]
  },
  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

