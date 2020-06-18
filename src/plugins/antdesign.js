import Vue from 'vue'
import {
  Button,
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Select,
  Table,
  Pagination,
  Modal
} from 'ant-design-vue'

// 全局注册antd组件
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Breadcrumb)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(Select)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Modal)

Vue.prototype.$confirm = Modal.confirm
