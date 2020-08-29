<template>
  <div>
		<!-- 菜单栏 -->
    <a-row :gutter="[16, 24]">
      <a-col :span="4">
        <a-input
          placeholder="请输入数据源名称查询"
          v-model="searchDataSourceName"
          allow-clear
          @change="clearSearchDataSourceName"
        ></a-input>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="getListByDataSourceName">查询</a-button>
      </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button
          type="primary"
          @click="showModal"
          :style="{ marginRight: '15px' }"
          >新增</a-button
        >
        <a-button type="info" @click="showModalDelete()">删除</a-button>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <a-table
          :rowKey="record => record.id"
          :columns="DataSourceColumns"
          :data-source="computeDataSourceList"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            onChange: onChange
          }"
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

    <!-- 新增数据源Modal -->
    <a-modal
      title="新增数据源"
      :visible="addDataSourceVisible"
      :confirm-loading="addDataSourceLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
    >
			<a-radio-group v-model="dataSourceTypeValue" @change="onDataSourceTypeChange">
				<a-radio :style="radioStyle" :value="1">
					sql
				</a-radio>
				<a-radio :style="radioStyle" :value="2">
					excel
				</a-radio>
			</a-radio-group>
    </a-modal>

    <!-- 修改数据源Modal -->
    <a-modal
      title="修改数据源"
      :visible="editDataSourceVisible"
      :confirm-loading="editDataSourceLoading"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="editDataSourceForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
      >
        <a-form-item label="数据源名称">
          <a-input
            :style="{
              width: '300px'
            }"
            v-decorator="[
              'DataSourceName',
              {
                rules: [
                  {
                    required: true,
                    message: '数据源名称不能为空！'
                  }
                ],
                initialValue: editDataSourceFormData.DataSourceName
              }
            ]"
            placeholder="请输入数据源名称..."
          ></a-input>
        </a-form-item>
        <a-form-item label="ID名称">
          <a-input
            :style="{
              width: '300px'
            }"
            disabled
            v-decorator="[
              'id',
              {
                rules: [
                  {
                    required: true,
                    message: '数据源名称不能为空！'
                  }
                ],
                initialValue: editDataSourceFormData.id
              }
            ]"
            placeholder="请输入数据源名称..."
          ></a-input>
        </a-form-item>
        <a-Form-Item name="radio-group" label="数据源类型">
          <a-Radio-Group
            option.initialValue="表"
            v-decorator="[
              'dataBaseType',
              {
                initialValue: editDataSourceFormData.dataBaseType
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
                'note',
                {
                  rules: [
                    {
                      required: true,
                      message: '数据源内容不能为空！'
                    }
                  ],
                  initialValue: editDataSourceFormData.note
                }
              ]"
              placeholder="请输入数据源内容"
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
      DataSourceList: [], // 数据源列表
      searchDataSourceName: '', //查询数据源名称输入框的内容
      DataSourceColumns: [
        { title: '数据源名称', dataIndex: 'databasename', key: 'databasename' },
        { title: '数据源类型', dataIndex: 'databasetype', key: 'databasetype' },
        { title: '备注', dataIndex: 'note', key: 'note' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        // { title: 'id', dataIndex: 'id', key: 'id' },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 数据源列
      addDataSourceVisible: false, // 添加数据源Modal显示
      addDataSourceLoading: false, // 添加数据源确定按钮loading
      editDataSourceVisible: false, // 修改数据源Modal显示
      editDataSourceLoading: false, // 修改数据源确定按钮loading
      editDataSourceFormData: {}, // 修改数据源回显数据
      selectedRowKeys: [], // 选中的行的id数组
			selectedRows: [], // 选中行的数据
			
			// 数据源类型
			dataSourceTypeValue: 1,
			radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
    }
	},
	
  beforeCreate() {
    this.editDataSourceForm = this.$form.createForm(this, {
      name: 'editDataSourceForm'
		});
	},
	
  created() {
		this.getDataSourceList()
		console.log(this);
	},
	
  methods: {
    // 新增数据源modal显示
    showModal() {
      this.addDataSourceVisible = true
		},
		
		// 数据源类型单选框处理
		onDataSourceTypeChange(e) {
			this.dataSourceTypeValue = e.target.value;
			// console.log(this.dataSourceTypeValue);
		},

    // 新增数据源Modal提交
    handleOk() {
			this.$router.push({
				path: '/dataSource',
				query: {
					dataSourceTypeValue: this.dataSourceTypeValue,
					operation: "addDataSource"
				}
			})
		},
		
    // 新增数据源Modal取消
    handleCancel() {
      this.addDataSourceVisible = false
      this.addDataSourceLoading = false
    },

    // 删除数据源modal显示
    showModalDelete() {
      // 接收this对象，因为在$confirm()中无法取到this
      const _this = this
      // 函数参数对象
      const args = arguments
      // 待拼装参数
      let params = []
      // 该函数未传入参数，说明是点击的多选删除，将已选则行的数据直接赋值给params
      if (args.length === 0) {
        params = this.selectedRowKeys
        console.log(params)
      } else {
        params = [args[0]]
        this.selectedRows = [args[0]]
      }
      // 删除提示中，具体的维度名称
      const removeText = this.selectedRows
        .map(item => item.DataSourceName)
        .join('、')
      if (params.length !== 0) {
        this.$confirm({
          title: '删除数据源',
          content: (
            <div>
              <p>
                确定删除：<a>{removeText}</a>
                &nbsp;吗？
              </p>
              <p>
                <em>删除后无法恢复，请谨慎操作！</em>
              </p>
            </div>
          ),
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDataSourceByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择数据源进行删除！')
      }
		},
		
    // 通过ids删除数据源提交
    async removeDataSourceByIds(ids) {
      console.log('params', ids)
      const { data: res } = await this.$http
        .request({
          url: '/removeDataSource',
          methods: 'post',
          params: {
            ids
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false })
          }
        })
        // 返回的错误信息用catch接
        .catch(error => {
          this.$message.error('删除数据源失败！' + error)
          this.selectedRowKeys = []
        })
      if (res.meta.status === 200) {
        this.$message.success('删除数据源成功！')
      } else {
        this.$message.error('删除数据源失败！')
      }
      this.selectedRowKeys = []
      this.getDataSourceList()
    },

    // 获取数据源列表数据
    async getDataSourceList() {
      const { data: res } = await this.$http.request({
        url: '/getDataList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
				console.log(res);
        this.DataSourceList = res.data
        console.log('this.DataSourceList', this.DataSourceList)
        console.log('数据源列表获取成功')
      } else {
        this.$message.error('数据源列表获取失败！')
      }
    },

    //  通过数据源名称查询列表
    async getListByDataSourceName() {
      const { data: res } = await this.$http.request({
        url: '/getDataByDataSourceName',
        methods: 'get',
        params: {
          dataSourceName: this.searchDataSourceName
        }
      })
      if (res.msg.status === 200) {
        console.log('查询数据', res.data)
				this.DataSourceList = res.data
				console.log('this.DataSourceList', this.DataSourceList)
        this.$message.success('查询成功！')
      } else {
        this.$message.error('查询失败！')
      }
    },

    // 清除查询数据源名称
    clearSearchDataSourceName(e) {
      if (e.type === 'click') {
        this.searchDataSourceName = ''
        this.getDataSourceList()
      }
    },

    // 点击修改按钮出现modal
    handleShowEdit(row) {
			this.$router.replace({
				path: '/dataSource',
				query: {
					id: row.id,
					dataSourceTypeValue: this.dataSourceTypeValue,
					operation: "editDataSource"
				}
			})
      // this.editDataSourceVisible = true
      // this.getDataSource(row)
      // this.editDataSourceFormData = row
      // console.log('row===', row)
    },

    //
    async getDataSource(row) {
      console.log('row', row)
      const { data: res } = await this.$http.request({
        url: `/getDataSource/:id`,
        methods: 'get',
        params: {
          id: row.id
        }
      })
      console.log('res===', res)
      if (res.meta.status === 200) {
        this.editDataSourceFormData = res.data
        // this.editDataSourceForm.setFieldsValue({
        //   id: res.data.id,
        //   DataSourceName: res.data.DataSourceName,
        //   dataBaseType: res.data.dataBaseType,
        //   note: res.data.note
        // })
      } else {
        this.$message.error('获取数据源失败！')
      }
		},
		
    // 修改数据源Modal提交
    handleEditOk() {
      this.editDataSourceForm.validateFields(async (err, values) => {
        // 如果表单没有错误
        if (!err) {
          // 确定按钮loading状态开启
          console.log('values=============', values)
          console.log(
            'editDataSourceFormDataId=============',
            this.editDataSourceFormData.id
          )
          this.editDataSourceLoading = true
          const { data: res } = await this.$http.request({
            url: `/editDataSource`,
            methods: 'put',
            params: {
              ...values
            }
          })

          // 修改成功
          if (res.meta.status === 200) {
            this.$message.success('修改数据源成功！')
          } else {
            // 修改失败
            this.$message.error('修改数据源失败！')
          }
          this.editDataSourceLoading = false
          this.editDataSourceVisible = false
          this.editDataSourceFormData = {}
          this.editDataSourceForm.resetFields()
          this.getDataSourceList()
          this.selectedRowKeys = []
        }
      })
    },
    // 修改数据源Modal取消
    handleEditCancel() {
      this.editDataSourceVisible = false
      this.editDataSourceLoading = false
      this.editDataSourceFormData = {}
      this.editDataSourceForm.resetFields()
		},
		
    // 单条数据源的删除
    RowDelete() {
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
          title: '删除数据源',
          content: '确定删除该数据源吗？删除后将不可恢复，请谨慎操作！',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDataSourceByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择数据源进行删除！')
      }
    },
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  computed: {
    computeDataSourceList() {

      const tempList = this.DataSourceList.map(item => {
        return {
          ...item,
          key: item.id
        }
      })
      return tempList
    }
    // rowSelection() {
    //   return {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       this.selectedRowKeys = selectedRowKeys
    //       console.log(
    //         `selectedRowKeys: ${selectedRowKeys}`,
    //         'selectedRows: ',
    //         selectedRows
    //       )
    //     },
    //     getCheckboxProps: record => ({
    //       props: {
    //         disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //         name: record.name
    //       }
    //     })
    //   }
    // }
  }
}
</script>
<style lang="less" scoped></style>
