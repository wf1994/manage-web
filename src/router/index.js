import Vue from 'vue'
import VueRouter from 'vue-router'
import MyLayout from '../layout/MyLayout.vue'
import DataSource from '../view/dataSource/DataSource.vue'
import DataSet from '../view/dataSet/DataSet.vue'
import DataDimension from '../view/dataDimension/DataDimension.vue'
import ComponentSet from '../view/componentSet/ComponentSet.vue'
import StatisItem from '../view/statisItem/StatisItem.vue'

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
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
