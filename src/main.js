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
  Cascader,
} from 'element-ui';
Vue.use(Cascader);
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
Vue.prototype.$get = api.get;
Vue.prototype.$post = api.post;
Vue.prototype.$delete = api.deleteItem;
//导入自定义提示框
import Swal from "sweetalert2";
Vue.prototype.$swal = Swal;
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
Vue.directive('drag',Drag);
//注册一个按钮波纹动画
import Wave from "@/directive/waves"
Vue.directive('wave',Wave);
//住

// import '@/permission' // permission control
import '@/session'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
