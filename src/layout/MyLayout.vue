<template>
  <a-layout>
    <!-- 头部区域 -->
    <a-layout-header class="header">
      <img src="../assets/logo.png" alt="" />
      <span>BI可视化工具系统</span>
    </a-layout-header>
    <a-layout>
      <!-- 侧边栏，菜单区域 -->
      <a-layout-sider width="260" collapsible v-model="collapsed">
        <a-menu
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
          theme="dark"
          @click="linkTo"
        >
          <a-menu-item key="/dataSource">
            <a-icon type="user" />
            <span>数据源设置</span>
          </a-menu-item>
          <a-menu-item key="/dataSet">
            <a-icon type="user" />
            <span>数据集设置</span>
          </a-menu-item>
          <a-menu-item key="/dataDimension">
            <a-icon type="user" />
            <span>维度向量设置</span>
          </a-menu-item>
          <a-menu-item key="/statisItem">
            <a-icon type="user" />
            <span>统计项设置</span>
          </a-menu-item>
          <a-menu-item key="/componentSet">
            <a-icon type="user" />
            <span>组件设置</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <!-- 面包屑区域 -->
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>BI工具</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 主题内容区域 -->
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px'
          }"
        >
          <!-- 导航视图 -->
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false, // 侧边栏折叠
      activePath: '/dataSource' // 当前点击路由
    }
  },
  methods: {
    // 点击菜单项跳转事件
    linkTo(link) {
      if (this.activePath !== link.key) {
        this.$router.push(link.key)
        this.activePath = link.key
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ant-layout {
  height: 100%;
}
.ant-layout-header {
  height: 48px;
  padding: 0 0.8%;
  line-height: 48px;
  color: #fff;
  font-size: 1.125rem;
  background-color: #128075;
}
.header {
  span {
    margin-left: 0.4%;
  }
}
</style>
