import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import edu_train from './modules/edu_train'
import meeting from './modules/meeting'
import message from './modules/message'
import part from './modules/part'

import getters from './getters'
import { setItem, getItem } from '@/utils/auth'
import { SET_ORG_ROLE_LIST, SET_GROUP_LIST, SET_USER_INFO, SET_USER_SIGN, SET_USER_TOKEN, SET_FIELD_MANAGER_DATA, SET_FIELD_APP_LIST, SET_TREE_DATE, SET_IS_ADMIN } from './mutations'
Vue.use(Vuex);
import { post } from '@/utils/fetch'
const store = new Vuex.Store({
  // strict: process.env.NODE_ENV === 'development' ? true : false,
  modules: {
    app,
    user,
    tagsView,
    edu_train,
    meeting,
    message,
    part
  },
  getters,
  state: {
    field_manager_data: {
      name: 'temp'
    },
    // 面包屑导航条
    levelList: [],
    //分页数组
    page_list: [5, 10, 15, 20],
    user_info: {

    },
    sign: '',//签名,
    token: '',
    field_app_list: [],
    tree_data: [],
    group_list: [],
    org_role_list: [],
    is_admin: false,
    is_permisssion: false,
  },
  mutations: {
    [SET_GROUP_LIST](state, data) {
      state.group_list = data;
      setItem(SET_GROUP_LIST, data)
    },
    [SET_FIELD_MANAGER_DATA](state, data) {
      state.field_manager_data = data;
      setItem(SET_FIELD_MANAGER_DATA, data)
    },
    SET_FIELD_MANAGER_DATA_VALUE: (state, name) => {
      state.field_manager_data.name = name;
      setItem(SET_FIELD_MANAGER_DATA, state.field_manager_data)
    },
    SET_LEVELLIST: (state, data) => {
      //解决json 序列化的问题
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr[i] = {};
        arr[i].meta = data[i].meta;
        arr[i].name = data[i].name;
        arr[i].path = data[i].path;
      };
      state.levelList = arr;
      setItem('levelList', arr);
    },
    [SET_USER_INFO]: (state, data) => {
      state.user_info = data;
      sessionStorage.setItem(SET_USER_INFO, JSON.stringify(data));
    },
    [SET_USER_SIGN]: (state, data) => {
      state.sign = data;
      sessionStorage.setItem(SET_USER_SIGN, JSON.stringify(data));
    },
    [SET_USER_TOKEN]: (state, data) => {
      state.token = data;
      sessionStorage.setItem(SET_USER_TOKEN, JSON.stringify(data));
    },
    [SET_FIELD_APP_LIST]: (state, data) => {
      state.field_app_list = data;
      sessionStorage.setItem(SET_FIELD_APP_LIST, JSON.stringify(data));
    },
    [SET_TREE_DATE]: (state, data) => {
      state.tree_data = data;
      sessionStorage.setItem(SET_TREE_DATE, JSON.stringify(data));
    },
    set_field_appList: (state, { index, isShow }) => {
      state.field_app_list[index].isShow = isShow;
      sessionStorage.setItem(SET_FIELD_APP_LIST, JSON.stringify(state.field_app_list));
    },
    [SET_IS_ADMIN](state, data) {
      state.is_admin = data;
      sessionStorage.setItem(SET_IS_ADMIN, JSON.stringify(data));
    },
    [SET_ORG_ROLE_LIST](state, data) {
      state.org_role_list = data;
      sessionStorage.setItem(SET_ORG_ROLE_LIST, JSON.stringify(data));
    }
  },
  actions: {
    get_org_role_list({ commit }) {
      post('gwt/system/sysOrg/getAllAdminOrgByUserId', {}, 'json').then(res => {
        if (res.result !== '0000') {
          return
        }
        var arr = [];
        for (var i = 0; i < res.data.backOrgsList.length; i++) {
          arr.push(...res.data.backOrgsList[i])
        }
        commit(SET_ORG_ROLE_LIST, arr.map(res => res.orgId))
      }).catch(res => {
        console.log(res)
      })
    },
    get_user_send_permission({ state }) {
      post('gwt/notice/tbNotice/checkPermission', {}, 'json').then(res => {
        if (res.result !== '0000') {
          return
        }
        state.is_permisssion = res.data.permission;
      }).catch(res => {
        console.log(res)
      })
    },
    readSession: ({
      commit
    }, key) => {
      var data = getItem(key);
      if (data) {
        store.commit(key, data)
      }
    },
    get_all_app_list: ({ commit }, domainId) => {
      post('gwt/system/sysDomain/getAppByDomainId', {
        domainId
      }, 'json').then(res => {
        if (res.result !== '0000') {
          return
        };
        commit(SET_FIELD_APP_LIST, res.data.appList)
      }).catch(res => {
        console.log(res)
      });
    },
    get_all_tree_data: ({ commit }) => {
      post('gwt/system/sysOrg/getAreaOrgTreeData', {
        showAllOrgFlag: 'N'
      }, 'json').then(res => {
        if (res.result !== '0000') {
          return
        };
        commit(SET_TREE_DATE, res.data.nodes)
      }).catch(res => {
        console.log(res)
      });
    }
  }
})

export default store
