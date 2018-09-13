import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
//按需引入 element-ui

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import 'element-ui/lib/theme-chalk/index.css';
import {
  Button,
  Select,
  Pagination,
  Checkbox,
  Table,
  TableColumn,
  DatePicker, Icon, Upload,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Tree,
  Scrollbar,
  Loading,
  Message,
  Dialog,
  CheckboxButton,
  CheckboxGroup,
  Option,
  Collapse,
  CollapseItem,
  Switch,
  Radio
} from 'element-ui';
Vue.use(Radio);
Vue.use(Switch);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TableColumn);
Vue.use(Upload);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Tree);
Vue.use(Scrollbar);
Vue.use(Loading.directive);
Vue.prototype.$message = Message;
//---------------------
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
//导入自定义图标组件
import '@/icons' // icon
//导入先后天发请求 api
import * as api from '@/utils/fetch'
import axios from 'axios'
Vue.prototype.$axios = axios;
Vue.prototype.$get = api.get;
Vue.prototype.$post = api.post;
Vue.prototype.$delete = api.deleteItem;
//导入自定义提示框
import VueSweetalert2 from 'vue-sweetalert2';
// import Swal from "sweetalert2";
// import 'sweetalert2/src/sweetalert2.scss'
// Vue.prototype.$swal = Swal;
Vue.use(VueSweetalert2)
//导出一个公用的标题
import tTitle from "@/components/NavTitle";
Vue.component('tTitle', tTitle);
//一个左右布局
import tLayout from "@/components/TwoLayout";
Vue.component('tLayout', tLayout)
import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
//注册一个弹框可拖拽的指令
import Drag from "@/directive/el-dragDialog"
Vue.directive('drag', Drag);
//注册一个按钮波纹动画
import Wave from "@/directive/waves"
Vue.directive('wave', Wave);
//住
import { get_color_number } from "@/utils";
Vue.prototype.$get_color_number = get_color_number;

// import '@/permission' // permission control
import '@/session'
//放到事件队列中 优化
setTimeout(res => {
  console.log("%c\n  ", "font-size:41px;background:url('data:image/png;base64,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') no-repeat center center;padding:0;margin:0;padding-bottom:12px");
}, 1000)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
