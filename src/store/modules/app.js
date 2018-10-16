import Cookies from 'js-cookie'
import { post } from '@/utils/fetch'
import store from '../index'
import config from '@/config'
const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    slider_list: [
      {
        resName: "我的消息",
        resUrl: "/user-message/index"
      }, {
        resName: "通讯录",
        resUrl: "/mail-list/index"
      },
      {
        resName: "云盘",
        children: [
          {
            resName: "个人云盘",
            resUrl: "/user-cloud-disk/index"
          },
          {
            resName: "部门云盘",
            resUrl: "/part-cloud-disk/index"
          }
        ]
      }
    ],
    all_slider_list: [],
    slider_loading: false,
    user_img: ''
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SLIDER_LIST: (state, data) => {
      state.slider_list = data;
      sessionStorage.setItem('SET_SLIDER_LIST', JSON.stringify(data));
    },
    SET_ALL_SLIDER_LIST: (state, data) => {
      state.all_slider_list = data;
      sessionStorage.setItem('SET_ALL_SLIDER_LIST', JSON.stringify(data));
    },
  },
  actions: {
    reset_slider_list: ({ state }) => {
      state.slider_list = [
        {
          resName: "我的消息",
          resUrl: "/user-message/index"
        }, {
          resName: "通讯录",
          resUrl: "/mail-list/index"
        },
        {
          resName: "云盘",
          children: [
            {
              resName: "个人云盘",
              resUrl: "/user-cloud-disk/index"
            },
            {
              resName: "部门云盘",
              resUrl: "/part-cloud-disk/index"
            }
          ]
        }
      ]
    },
    get_user_head: ({ state }) => {
      post("gwt/system/sysUserAttachRelation/getHead", {}, "json")
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          if (!res.data.headInfo) {
            state.user_img = "";
            return;
          }
          state.user_img =
            config +
            res.data.headInfo.attaPath +
            "/" +
            res.data.headInfo.smallImgName;
        })
        .catch(res => {
          console.log(res);
        });
    },
    get_slider_list: ({ commit, state }) => {
      state.slider_loading = true;
      var current = sessionStorage.getItem("gwt-current-silder");
      var child_current = sessionStorage.getItem("gwt-current-silder-child");
      current = current ? current - 0 : 0;
      child_current = child_current ? child_current - 0 : -1;
      post("gwt/system/sysResource/getMenu", {}, "json")
        .then(res => {
          state.slider_loading = false;
          if (res.result !== "0000") {
            return;
          }
          commit('SET_ALL_SLIDER_LIST', res.data.hashMap)
          var slierbar_list = res.data.hashMap;
          var newArr = [];
          var appArr = [];
          for (var i = 0; i < slierbar_list.length; i++) {
            if (slierbar_list[i].remark === "0") {
              if (slierbar_list[i].parentId === "-1") {
                newArr.push(slierbar_list[i]);
              }
            } else {
              if (store.getters.is_admin) {
                if (slierbar_list[i].parentId === "0") {
                  appArr.push(slierbar_list[i]);
                }
              } else {
                appArr.push(slierbar_list[i]);
              }
            }
          }
          for (var k = 0; k < appArr.length; k++) {
            appArr[k].children = [];
            appArr[k].isShow = false;
            for (var i = 0; i < slierbar_list.length; i++) {
              if (slierbar_list[i].parentId === appArr[k].resId) {
                appArr[k].children.push(slierbar_list[i]);
              }
            }
          }
          for (var j = 0; j < newArr.length; j++) {
            newArr[j].children = [];
            newArr[j].isShow = false;
            for (var i = 0; i < slierbar_list.length; i++) {
              if (
                slierbar_list[i].appId === newArr[j].resId &&
                slierbar_list[i].resId !== newArr[j].resId
              ) {
                newArr[j].children.push(slierbar_list[i]);
              }
            }
          };
          var slider_list = [
            {
              resName: "我的消息",
              resUrl: "/user-message/index"
            },
            ...appArr,
            ...newArr,
            {
              resName: "通讯录",
              resUrl: "/mail-list/index"
            },
            {
              resName: "云盘",
              children: [
                {
                  resName: "个人云盘",
                  resUrl: "/user-cloud-disk/index"
                },
                {
                  resName: "部门云盘",
                  resUrl: "/part-cloud-disk/index"
                }
              ]
            }
          ];
          slider_list[current].isShow = true;
          commit('SET_SLIDER_LIST', slider_list)
        })
        .catch(res => {
          state.slider_loading = false;
        });
    },
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    }
  }
}

export default app
