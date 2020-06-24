<template>
  <div>
    <a-row :gutter="[16, 24]">
      <a-col :span="4">
        <a-input
          placeholder="请输入维度名称查询"
          v-model="searchDimensionName"
          allow-clear
          @change="clearSearchDimensionName"
        ></a-input>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="searchByDimensionName">查询</a-button>
      </a-col>
      <a-col :span="6" :offset="10" :style="{ textAlign: 'right' }">
        <a-button
          type="primary"
          @click="handleShowAddDimension"
          :style="{ marginRight: '15px' }"
          >新增维度</a-button
        >
        <a-button type="info" @click="handleShowRemoveDimensionConfirm()"
          >删除</a-button
        >
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :rowKey="record => record.dimensionId"
          :columns="dimensionColumns"
          :data-source="computeDimensionListData"
          @expand="tableExpand"
          :expandedRowKeys="expandedRowKeys"
          :row-selection="rowSelection"
          :scroll="{ y: 600 }"
        >
          <span slot="operation" slot-scope="row">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item @click="handleShowAddVector">
                  添加向量
                </a-menu-item>
                <a-menu-item @click="handleShowEditDimension(row)">
                  修改
                </a-menu-item>
                <a-menu-item @click="removeDimensionByIds(row.dimensionId)">
                  删除
                </a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()"
                ><a-icon type="dash"></a-icon
              ></a>
            </a-dropdown>
          </span>
          <a-table
            :rowKey="record => record.vectorId"
            slot="expandedRowRender"
            :columns="vectorColumns"
            :data-source="vectorData"
            :pagination="false"
          >
            <span slot="vectorOperation" slot-scoped="vectorOperation">
              <a-dropdown :trigger="['click']">
                <a-menu slot="overlay">
                  <a-menu-item>
                    修改
                  </a-menu-item>
                  <a-menu-item>
                    删除
                  </a-menu-item>
                </a-menu>
                <a @click="e => e.preventDefault()"><a-icon type="dash"/></a>
              </a-dropdown>
            </span>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <!-- 新增维度Modal -->
    <a-modal
      title="新增维度"
      :visible="addDimensionVisible"
      :confirm-loading="addDimensionLoading"
      @ok="handleAddDimension"
      @cancel="handleAddDimensionCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="addDimensionForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
      >
        <a-form-item label="维度名称">
          <a-input
            v-decorator="[
              'dimensionName',
              {
                rules: [
                  {
                    required: true,
                    message: '维度名称不能为空！'
                  }
                ]
              }
            ]"
            placeholder="请输入维度名称..."
          />
        </a-form-item>
        <a-form-item label="维度分类">
          <a-input
            v-decorator="[
              'dimensionType',
              {
                rules: [
                  {
                    required: true,
                    message: '维度分类不能为空！'
                  }
                ]
              }
            ]"
            placeholder="请输入维度分类..."
          />
        </a-form-item>
        <a-form-item label="字段名">
          <a-textarea
            v-decorator="[
              'fieldName',
              {
                rules: [
                  {
                    required: true,
                    message: '字段名不能为空！'
                  }
                ]
              }
            ]"
            placeholder="请输入字段名..."
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改维度Modal -->
    <a-modal
      title="修改维度"
      :visible="editDimensionVisible"
      :confirm-loading="editDimensionLoading"
      @ok="handleEditDimension"
      @cancel="handleEditDimensionCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="editDimensionForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
      >
        <a-form-item label="维度名称">
          <a-input
            v-decorator="[
              'dimensionName',
              {
                rules: [
                  {
                    required: true,
                    message: '维度名称不能为空！'
                  }
                ],
                initialValue: editDimensionFormData.dimensionName
              }
            ]"
            placeholder="请输入维度名称..."
          />
        </a-form-item>
        <a-form-item label="维度分类">
          <a-input
            v-decorator="[
              'dimensionType',
              {
                rules: [
                  {
                    required: true,
                    message: '维度分类不能为空！'
                  }
                ],
                initialValue: editDimensionFormData.dimensionType
              }
            ]"
            placeholder="请输入维度分类..."
          />
        </a-form-item>
        <a-form-item label="字段名">
          <a-textarea
            v-decorator="[
              'fieldName',
              {
                rules: [
                  {
                    required: true,
                    message: '字段名不能为空！'
                  }
                ],
                initialValue: editDimensionFormData.fieldName
              }
            ]"
            placeholder="请输入字段名..."
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增向量Modal -->
    <a-modal
      title="新增向量"
      width="50%"
      :visible="addVectorVisible"
      :confirm-loading="addVectorLoading"
      @ok="handleAddVector"
      @cancel="handleAddVectorCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form :form="addVectorForm" labelAlign="left">
        <a-form-item label="向量名称">
          <a-input
            v-decorator="[
              'vectorName',
              {
                rules: [
                  {
                    required: true,
                    message: '向量名称不能为空！'
                  }
                ]
              }
            ]"
            placeholder="请输入维度名称..."
          />
        </a-form-item>
        <a-form-item
          :label-col="{ span: 0 }"
          :wrapper-col="{ span: 5 }"
          class="conditionType"
        >
          <a-radio-group v-decorator="['conditionType']">
            <a-radio :style="radioStyle" value="精准属性">
              精准属性
            </a-radio>
            <a-radio :style="radioStyle" value="范围属性">
              范围属性
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <div class="condition">
          <a-form-item>
            <a-input
              v-decorator="[
                'fieldName',
                {
                  rules: [
                    {
                      required: true,
                      message: '字段名不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入字段名..."
            />
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
    <!-- 修改向量Modal -->
    <a-modal
      title="修改向量"
      :visible="editVectorVisible"
      :confirm-loading="editVectorLoading"
      @ok="handleEditVector"
      @cancel="handleEditVectorCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="editVectorForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
      >
        <a-form-item label="维度名称">
          <a-input
            v-decorator="[
              'dimensionName',
              {
                rules: [
                  {
                    required: true,
                    message: '维度名称不能为空！'
                  }
                ],
                initialValue: editDimensionFormData.dimensionName
              }
            ]"
            placeholder="请输入维度名称..."
          />
        </a-form-item>
        <a-form-item label="维度分类">
          <a-input
            v-decorator="[
              'dimensionType',
              {
                rules: [
                  {
                    required: true,
                    message: '维度分类不能为空！'
                  }
                ],
                initialValue: editDimensionFormData.dimensionType
              }
            ]"
            placeholder="请输入维度分类..."
          />
        </a-form-item>
        <a-form-item label="字段名">
          <a-textarea
            v-decorator="[
              'fieldName',
              {
                rules: [
                  {
                    required: true,
                    message: '字段名不能为空！'
                  }
                ],
                initialValue: editDimensionFormData.fieldName
              }
            ]"
            placeholder="请输入字段名..."
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchDimensionName: '', // 查询维度名称
      dimensionListData: [], // 维度向量列表数据
      dimensionColumns: [
        { title: '维度名称', dataIndex: 'dimensionName', key: 'dimensionName' },
        { title: '维度类型', dataIndex: 'dimensionType', key: 'dimensionType' },
        { title: '字段名', dataIndex: 'fieldName', key: 'fieldName' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ], // 维度列
      vectorColumns: [
        { title: '向量名称', dataIndex: 'vectorName', key: 'vectorName' },
        { title: '属性条件', dataIndex: 'condition', key: 'condition' },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'vectorOperation',
          key: 'vectorOperation',
          scopedSlots: { customRender: 'vectorOperation' }
        }
      ], // 向量列
      vectorData: [], // 向量列表数据
      expandedRowKeys: [], // 展开行
      addDimensionVisible: false, // 添加维度Modal显示
      addDimensionLoading: false, // 添加维度确定按钮loading
      editDimensionVisible: false, // 修改维度Modal显示
      editDimensionLoading: false, // 修改维度确定按钮loading
      editDimensionFormData: {}, // 修改维度回显数据
      addVectorVisible: false, // 新增向量Modal显示
      addVectorLoading: false, // 新增向量确定按钮loading
      selectedRowKeys: [], // 选中的行的id数组
      radioStyle: {
        display: 'block',
        height: '60px',
        lineHeight: '60px'
      }
    }
  },
  beforeCreate() {
    this.addDimensionForm = this.$form.createForm(this, {
      name: 'addDimensionForm'
    })
    this.editDimensionForm = this.$form.createForm(this, {
      name: 'editDimensionForm'
    })
    this.addVectorForm = this.$form.createForm(this, {
      name: 'addVectorForm'
    })
  },
  created() {
    this.getDimensionList()
  },
  methods: {
    // table展开操作
    tableExpand(expanded, record) {
      console.log(expanded, record)
      if (expanded) {
        this.expandedRowKeys = []
        this.expandedRowKeys.push(record.dimensionId)
      } else {
        this.expandedRowKeys = []
      }
      this.vectorData = record.vectorList.map(item => {
        return {
          ...item,
          key: item.vectorId
        }
      })
      console.log(this.vectorData)
    },
    // 通过维度名称查询列表
    async searchByDimensionName() {
      const { data: res } = await this.$http.request({
        url: '/filterDimensionList',
        methods: 'get',
        params: { dimensionName: this.searchDimensionName }
      })
      if (res.meta.status === 200) {
        this.dimensionListData = res.data
        this.$message.success('查询成功！')
      } else {
        this.$message.error('查询失败！')
      }
    },
    // 清除查询维度名称
    clearSearchDimensionName(e) {
      if (e.type === 'click') {
        this.searchDimensionName = ''
        this.getDimensionList()
      }
    },
    // 新增维度Moda显示
    handleShowAddDimension() {
      this.addDimensionVisible = true
    },
    // 新增维度Modal提交
    handleAddDimension(id) {
      this.addDimensionForm.validateFields(async (err, values) => {
        // 如果表单没有错误
        if (!err) {
          console.log('values=============', values)
          // 确定按钮loading状态开启
          this.addDimensionLoading = true
          const { data: res } = await this.$http.request({
            url: `/getDataSetData/${id}`,
            methods: 'get',
            params: values
          })

          // 新增成功
          if (res.meta.status === 200) {
            this.addDimensionVisible = false
            this.addDimensionLoading = false
            this.$message.success('新增维度成功！')
          } else {
            // 新增失败
            this.addDimensionLoading = false
            this.$message.error('新增维度失败！')
          }
        }
      })
    },
    // 新增维度Modal取消
    handleAddDimensionCancel() {
      this.addDimensionVisible = false
      this.addDimensionLoading = false
      this.addDimensionForm.resetFields()
    },
    // 删除维度确认框显示
    handleShowRemoveDimensionConfirm() {
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
          title: '删除维度',
          content: '确定删除该维度吗？删除后将不可恢复，请谨慎操作！',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDimensionByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择维度进行删除！')
      }
    },
    // 通过ids删除维度提交
    async removeDimensionByIds(ids) {
      console.log('params', ids)
      const { data: res } = await this.$http.request({
        url: '/removeDimension',
        methods: 'post',
        params: {
          ids
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
      })
      if (res.meta.status === 200) {
        this.$message.success('删除维度成功！')
      } else {
        this.$message.error('删除维度失败！')
      }
    },
    // 修改维度按钮点击事件
    handleShowEditDimension(row) {
      this.editDimensionVisible = true
      // const { data: res } = await this.$http.request({
      //   url: `/getDimension/${row.id}`,
      //   methods: 'get'
      // })
      // console.log('res===', res)
      // if(res.meta.status === 200){

      // }
      // this.editDimensionForm.setFieldsValue({
      //   dimensionName: 'weqr',
      //   dimensionType: 'weqr',
      //   fieldName: 'weqr'
      // })
      this.editDimensionFormData = row
      console.log('row===', row)
    },
    // 修改维度提交事件
    handleEditDimension() {
      this.editDimensionForm.validateFields(async (err, values) => {
        if (!err) {
          this.editDimensionLoading = true
          console.log(values)
          const { data: res } = await this.$http.request({
            url: '/editDimension',
            methods: 'put',
            params: {
              ...values,
              id: this.editDimensionFormData.dimensionId
            }
          })

          if (res.meta.status === 200) {
            this.$message.success('修改维度成功！')
          } else {
            this.$message.error('修改维度失败！')
          }
          this.editDimensionVisible = false
          this.editDimensionLoading = false
          this.editDimensionFormData = {}
        }
      })
    },
    // 修改维度Modal取消
    handleEditDimensionCancel() {
      this.editDimensionVisible = false
      this.editDimensionLoading = false
      this.editDimensionFormData = {}
      this.editDimensionForm.resetFields()
    },
    // 新增向量Modal显示
    handleShowAddVector() {
      this.addVectorVisible = true
    },
    // 新增向量Modal取消
    handleAddVectorCancel() {
      this.addVectorVisible = false
      this.addVectorLoading = false
      this.addVectorForm.resetFields()
    },
    // 获取维度向量列表
    async getDimensionList() {
      const { data: res } = await this.$http.request({
        url: '/getDimensionList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.dimensionListData = res.data
        console.log('this.dimensionListData', this.dimensionListData)
        console.log('维度列表获取成功')
      } else {
        this.$message.error('维度向量列表获取失败！')
      }
    }
  },
  computed: {
    computeDimensionListData() {
      const tempList = this.dimensionListData.map(item => {
        return {
          ...item,
          key: item.dimensionId
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
            disabled: record.name === 'Disabled User',
            name: record.name
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.conditionType {
  width: 20%;
  margin-bottom: 0;
  display: inline-block;
  position: relative;
}
.condition {
  position: absolute;
  left: 20px;
  top: 0;
}
</style>
