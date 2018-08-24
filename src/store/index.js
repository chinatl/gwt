import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'

import getters from './getters'
import { setItem, getItem } from '@/utils/auth'
Vue.use(Vuex)
const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development' ? true : false,
  modules: {
    app,
    user,
    tagsView
  },
  getters,
  state: {
    field_manager_data: {
      title: 'temp'
    },
    // 面包屑导航条
    levelList: []
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
    }
  }
})

export default store
