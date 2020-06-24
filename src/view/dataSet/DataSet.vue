<template>
  <div>
    <a-row :gutter="[16, 24]">
      <a-col :span="4">
        <a-input placeholder="请输入数据集名称查询"></a-input>
      </a-col>
      <a-col :span="4">
        <a-button type="primary">查询</a-button>
      </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button
          type="primary"
          @click="showModal"
          :style="{ marginright: '25px' }"
          >新增</a-button
        >
        <a-button type="info">删除</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :columns="DataSetColumns"
          :data-source="DataSetData"
          :row-selection="rowSelection"
          :scroll="{ y: 600 }"
        >
          <span slot="dataType" slot-scope="dataType">
            {{ dataType % 2 === 0 ? '表' : 'SQL' }}
          </span>
          <span slot="createTime" slot-scope="createTime">
            {{ createTime | dateformat('YYYY-MM-DD') }}
          </span>
        </a-table>
      </a-col>
    </a-row>
    <!-- 新增维度Modal -->
    <a-modal
      title="新增数据集"
      :visible="addDataSetVisible"
      :confirm-loading="addDataSetLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
      >
        <a-form-item label="数据集名称">
          <a-input
            :style="{
              width: '300px'
            }"
            v-decorator="[
              'dataSetName',
              {
                rules: [
                  {
                    required: true,
                    message: '数据集名称不能为空！'
                  }
                ]
              }
            ]"
            placeholder="请输入数据集名称..."
          ></a-input>
        </a-form-item>
        <a-Form-Item name="radio-group" label="数据集类型">
          <a-Radio-Group
            defaultValue="表"
            v-decorator="[
              'dataType',
              {
                rules: [
                  {
                    required: true,
                    message: '数据集类型不能为空！'
                  }
                ]
              }
            ]"
          >
            <a-Radio
              value="表"
              :style="{
                display: 'block',
                height: '30px',
                lineHeight: '30px'
              }"
              >表</a-Radio
            >
            <a-Radio
              value="SQL"
              :style="{
                display: 'block',
                height: '30px',
                lineHeight: '30px'
              }"
              >SQL</a-Radio
            >
            <a-textarea
              :row="4"
              :style="{
                width: '300px'
              }"
              v-decorator="[
                'dataContent',
                {
                  rules: [
                    {
                      required: true,
                      message: '数据集内容不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入数据集内容"
            ></a-textarea>
          </a-Radio-Group>
        </a-Form-Item>
      </a-form>
    </a-modal>
    >
  </div>
</template>
<script>
const DataSetColumns = [
  {
    title: '数据集名称',
    width: 100,
    dataIndex: 'dataSetName',
    key: 'dataSetName'
  },
  {
    title: '数据集类型',
    width: 100,
    dataIndex: 'dataType',
    key: 'dataType',
    scopedSlots: { customRender: 'dataType' }
  },
  {
    title: '数据集内容',
    dataIndex: 'dataContent',
    key: 'dataContent',
    width: 150
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
    // scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '操作',
    // dataIndex: 'address',
    key: 'operation',
    width: 80,
    scopedSlots: { customRender: 'operation' }
  }
]

const DataSetData = []
for (let i = 0; i < 100; i++) {
  DataSetData.push({
    key: 'id',
    dataSetName: 'dataSetName',
    dataType: `dataType`,
    dataContent: `dataContent`,
    createTime:'createTime'
  })
}

export default {
  data() {
    return {
      DataSetData, // 列表数据
      DataSetColumns, // 维度列
      addDataSetVisible: false,
      addDataSetLoading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'addDataSetForm' })
  },
  created() {
    this.getDataSetData()
  },
  methods: {
    // 新增数据集model显示
    showModal() {
      this.addDataSetVisible = true
    },
    // 新增数据集Modal提交
    handleOk(id) {
      this.form.validateFields(async (err, values) => {
        // 如果表单没有错误
        if (!err) {
          console.log('values=============', values)
          // 确定按钮loading状态开启
          this.addDataSetLoading = true
          const { data: res } = await this.$http.request({
            url: `/addDataSet/${id}`,
            methods: 'get',
            params: values
          })

          // 新增成功
          if (res.meta.status === 200) {
            this.addDataSetVisible = false
            this.addDataSetLoading = false
            this.$message.success('新增维度成功！')
          } else {
            // 新增失败
            this.addDataSetLoading = false
            this.$message.error('新增维度失败！')
          }
        }
      })
    },
    // 新增数据集Modal取消
    handleCancel() {
      this.addDataSetVisible = false
      this.addDataSetLoading = false
      this.form.resetFields()
    },
    // 获取列表数据
    async getDataSetData() {
      const { data: res } = await this.$http.request({
        url: '/getDataSetList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.DataSetData = res.data
        console.log('维度列表获取成功')
      } else {
        this.$message.error('维度向量列表获取失败！')
      }
    }
    //  通过数据集名称查询列表

    // 清除查询维度名称

    // 删除数据集
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
<style lang="less" scoped></style>
