<template>
  <div>
    <a-row :gutter="[16, 24]">
      <a-col :span="4">
        <a-input
          placeholder="请输入数据集名称查询"
          v-model="searchDataSetName"
          allow-clear
          @change="clearsearchDataSetName"
        ></a-input>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="searchBYDataSetName">查询</a-button>
      </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button
          type="primary"
          @click="showModal"
          :style="{ marginright: '25px' }"
          >新增</a-button
        >
        <a-button type="info" @click="showModalDelete()">删除</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :rowKey="record => record.id"
          :columns="DataSetColumns"
          :data-source="computeDataSetData"
          :row-selection="rowSelection"
          :scroll="{ y: 600 }"
        >
          <span slot="operation" slot-scope="row">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item @click="handleShowEdit(row)">
                  修改
                </a-menu-item>
                <a-menu-item @click="RowDelete(row.id)">
                  删除
                </a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()"
                ><a-icon type="dash"></a-icon
              ></a>
            </a-dropdown>
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
        :form="addDataSetform"
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
    <!-- 修改数据集Modal -->
    <a-modal
      title="修改数据集"
      :visible="editDataSetVisible"
      :confirm-loading="editDataSetLoading"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="editDataSetForm"
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
                ],
                initialValue: editDataSetFormData.dataSetName
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
                ],
                initialValue: editDataSetFormData.dataType
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
                  ],
                  initialValue: editDataSetFormData.dataContent
                }
              ]"
              placeholder="请输入数据集内容"
            ></a-textarea>
          </a-Radio-Group>
        </a-Form-Item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      DataSetData: [], // 列表数据
      searchDataSetName: '', //查询数据集名称输入框的内容
      DataSetColumns: [
        { title: '数据集名称', dataIndex: 'dataSetName', key: 'dataSetName' },
        { title: '数据集类型', dataIndex: 'dataType', key: 'dataType' },
        { title: '数据集内容', dataIndex: 'dataContent', key: 'dataContent' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        { title: 'id', dataIndex: 'id', key: 'id' },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 维度列
      addDataSetVisible: false, // 添加数据集Modal显示
      addDataSetLoading: false, // 添加数据集确定按钮loading
      editDataSetVisible: false, // 修改维度Modal显示
      editDataSetLoading: false, // 修改维度确定按钮loading
      editDataSetFormData: {}, // 修改维度回显数据
      selectedRowKeys: [] // 选中的行的id数组
    }
  },
  beforeCreate() {
    this.addDataSetForm = this.$form.createForm(this, {
      name: 'addDataSetForm'
    })
    this.editDataSetForm = this.$form.createForm(this, {
      name: 'editDataSetForm'
    })
  },
  created() {
    this.getDataSetList()
  },
  methods: {
    // 新增数据集model显示
    showModal() {
      this.addDataSetVisible = true
    },
    // 新增数据集Modal提交
    handleOk() {
      this.addDataSetForm.validateFields(async (err, values) => {
        // 如果表单没有错误
        if (!err) {
          console.log('values=============', values)
          // 确定按钮loading状态开启
          this.addDataSetLoading = true
          const { data: res } = await this.$http.request({
            url: `/addDataSet`,
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
      this.addDataSetForm.resetFields()
    },
    // 删除数据集modal显示
    showModalDelete() {
      const _this = this
      const args = arguments
      let params = []
      if (args.length === 0) {
        params = this.selectedRowKeys
      } else {
        params = [args[0]]
      }
      if (params.length !== 0) {
        this.$confirm({
          title: '删除数据集',
          content: '确定删除该数据集吗？删除后将不可恢复，请谨慎操作！',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDataSetByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择数据集进行删除！')
      }
    },
    // 通过ids删除数据集提交
    async removeDataSetByIds(ids) {
      console.log('params', ids)
      const { data: res } = await this.$http.request({
        url: '/removeDataSet',
        methods: 'post',
        params: {
          ids
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
      })
      if (res.meta.status === 200) {
        this.$message.success('删除数据集成功！')
        this.getDataSetList()
      } else {
        this.$message.error('删除数据集失败！')
      }
    },
    // 获取列表数据
    async getDataSetList() {
      const { data: res } = await this.$http.request({
        url: '/getDataSetList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.DataSetData = res.data
        console.log('this.DataSetData', this.DataSetData)
        console.log('维度列表获取成功')
      } else {
        this.$message.error('维度向量列表获取失败！')
      }
    },
    //  通过数据集名称查询列表
    async searchBYDataSetName() {
      const { data: res } = await this.$http.request({
        url: '/filterDataSetList',
        methods: 'get',
        params: {
          dataSetName: this.searchDataSetName
        }
      })
      if (res.meta.status === 200) {
        console.log('查询数据', res.data)
        this.DataSetData = res.data
        this.$message.success('查询成功！')
      } else {
        this.$message.error('查询失败！')
      }
    },
    // 清除查询维度名称
    clearsearchDataSetName(e) {
      if (e.type === 'click') {
        this.searchDataSetName = ''
        this.getDataSetList()
      }
    },
    // 点击修改按钮出现modal
    handleShowEdit(row) {
      this.editDataSetVisible = true
      this.editDataSetFormData = row
      console.log('row===', row)
    },
    // 修改数据集Modal提交
    handleEditOk() {
      this.editDataSetForm.validateFields(async (err, values) => {
        // 如果表单没有错误
        if (!err) {
          // 确定按钮loading状态开启
          console.log('values=============', values)
          this.editDataSetLoading = true
          const { data: res } = await this.$http.request({
            url: `/editDataSet`,
            methods: 'put',
            params: {
              ...values,
              id: this.editDataSetFormData.id
            }
          })

          // 修改成功
          if (res.meta.status === 200) {
            this.editDataSetVisible = false
            this.editDataSetLoading = false
            this.editDataSetFormData = {}
            this.$message.success('新增维度成功！')
          } else {
            // 修改失败
            this.editDataSetLoading = false
            this.$message.error('新增维度失败！')
          }
        }
      })
    },
    // 修改数据集Modal取消
    handleEditCancel() {
      this.editDataSetVisible = false
      this.editDataSetLoading = false
      this.editDataSetFormData = {}
      this.editDataSetForm.resetFields()
    }
  },
  computed: {
    computeDataSetData() {
      const tempList = this.DataSetData.map(item => {
        return {
          ...item,
          key: item.id
        }
      })
      return tempList
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
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
