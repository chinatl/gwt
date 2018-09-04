import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import edu_train from './modules/edu_train'

import getters from './getters'
import { setItem, getItem } from '@/utils/auth'
import { SET_USER_INFO, SET_USER_SIGN, SET_USER_TOKEN } from './mutations'
Vue.use(Vuex)
const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development' ? true : false,
  modules: {
    app,
    user,
    tagsView,
    edu_train
  },
  getters,
  state: {
    field_manager_data: {
      title: 'temp'
    },
    // 面包屑导航条
    levelList: [],
    //分页数组
    page_list: [5, 10, 15, 20],
    user_info: {

    },
    sign: '',//签名,
    token: ''
  },
  mutations: {
    SET_FIELD_MANAGER_DATA: (state, data) => {
      state.field_manager_data = data;
      setItem('field_manager_data', data)
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

  }
})

export default store
