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
import { SET_USER_INFO, SET_USER_SIGN, SET_USER_TOKEN, SET_FIELD_MANAGER_DATA, SET_FIELD_APP_LIST, SET_TREE_DATE } from './mutations'
Vue.use(Vuex);
import { post } from '@/utils/fetch'
const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development' ? true : false,
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
    tree_data: []
  },
  mutations: {
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
      state.user_info = data.loginInfo.sysUser;
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
    set_field_appList: (state, { index, isActive }) => {
      state.field_app_list[index].isActive = isActive;
      sessionStorage.setItem(SET_FIELD_APP_LIST, JSON.stringify(state.field_app_list));
    }
  },
  actions: {
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
