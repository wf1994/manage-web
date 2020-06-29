import Vue from 'vue'
import VueRouter from 'vue-router'
import { Modal } from 'ant-design-vue'
import MyLayout from '../layout/MyLayout.vue'
import DataSource from '../view/dataSource/DataSource.vue'
import DataSet from '../view/dataSet/DataSet.vue'
import DataDimension from '../view/dataDimension/DataDimension.vue'
import ComponentSet from '../view/componentSet/ComponentSet.vue'
import StatisItem from '../view/statisItem/StatisItem.vue'
import ComponentAdd from '../view/componentAdd/ComponentAdd.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dataSource',
    component: MyLayout,
    children: [
      {
        path: '/dataSource',
        component: DataSource
      },
      {
        path: '/dataSet',
        component: DataSet
      },
      {
        path: '/dataDimension',
        component: DataDimension
      },
      {
        path: '/componentSet',
        component: ComponentSet
      },
      {
        path: '/statisItem',
        component: StatisItem
      },
      {
        path: '/componentAdd',
        name: "ComponentAdd",
        component: ComponentAdd
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航守卫
router.beforeEach((to, from, next) => {
  // 路由前进、后退销毁提示框
  Modal.destroyAll()
  next()
})

export default router
