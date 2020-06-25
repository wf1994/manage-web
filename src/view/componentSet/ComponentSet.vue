<template>
  <div>
    <!-- 查询 新增 删除 -->
    <a-row>
      <a-col :span="4">
        <a-input
          class="search"
          placeholder="请输入组件名称查询"
          v-model="searchComponentName"
          allow-clear
          @change="clearSearchComponentName"
        ></a-input>
      </a-col>
      <a-col :span="4">
        <a-button @click="searchByComponentName" class="searchWord">查询</a-button>
      </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button @click="doAddComponent" class="addButton">新增</a-button>
        <a-button class="delButton">删除</a-button>
      </a-col>
    </a-row>
    <div class="back-space-30"></div>
    <!-- table -->
    <a-row>
      <a-col :span="24">
        <a-table
          class="table"
          :rowKey="row => row.id"
          :columns="componentColumns"
          :data-source="componentListData"
          :row-selection="rowSelection"
          :pagination="false"
        >
          <span slot="operation">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item>修改</a-menu-item>
                <a-menu-item>删除</a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()">
                <a-icon type="dash"></a-icon>
              </a>
            </a-dropdown>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <!-- 分页 -->
    <a-row>
      <a-col :span="24">
        <a-pagination
          class="pull-right footer"
          v-model="current"
          show-quick-jumper
          show-size-changer
          :page-size.sync="pageSize"
          :total="500"
          :show-total="total => `Total ${total} items`"
          @showSizeChange="onShowSizeChange"
        />
      </a-col>
    </a-row>
  </div>
</template>
<script>
const componentColumns = [
  { title: '组件名称', dataIndex: 'component_name', key: 'component_name' },
  { title: '维度', dataIndex: 'dimensions', key: 'dimensions' },
  { title: '统计项', dataIndex: 'statisItem', key: 'statisItem' },
  { title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  data() {
    return {
      pageSize: 20,
      current: 4,
      searchComponentName: '', // 查询组件名称
      componentListData:[], // 组件列表数据
      componentColumns // 组件列
    }
  },
  beforeCreate() {
    
  },
  created() {
    this.getComponentList()
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize)
    },
    // 获取组件列表
    async getComponentList() {
      const { data: res } = await this.$http.request({
        url: '/getComponentList',
        methods: 'get'
      })
      
      if (res.meta.status === 200) {
        this.componentListData = res.data
        // console.log('res.data======================='+res.data)
        console.log('组件列表获取成功')
      } else {
        this.$message.error('组件列表获取失败！')
      }
    },
    // 通过组件名称查询列表
    async searchByComponentName() {
      const { data: res } = await this.$http.request({
        url: '/filterComponentList',
        methods: 'get',
        params: { component_name: this.searchComponentName }
      })
      if (res.meta.status === 200) {
        this.componentListData = res.data
        this.$message.success('查询成功！')
      } else {
        this.$message.error('查询失败！')
      }
    },
    // 清除查询组件名称
    clearSearchComponentName(e) {
      if (e.type === 'click') {
        this.searchComponentName = ''
        this.getComponentList()
      }
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          )
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.pull-right {
  float: right;
}
.back-space-30 {
  height: 30px;
}
.search {
  width: 240px;
  height: 32px;
}
.searchWord {
  width: 85px;
  height: 32px;
  background: #1c857a;
  border-radius: 2px;
  color: white;
  font-size: 12px;
}
.addButton {
  margin-right: 12px;
  width: 80px;
  height: 32px;
  background: #128075;
  color: white;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  text-align: center;
  line-height: 14px;
}
.delButton {
  width: 80px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e2e3e6;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  text-align: center;
  line-height: 14px;
}
.table {
  width: 1572px;
  height: 760px;
  background: #ffffff;
  border: 1px solid #e2e3e6;
  font-size: 14px;
}
// .footer {
//   width: 560px;
//   height: 18px;
//   font-size: 12px;
// }
</style>
