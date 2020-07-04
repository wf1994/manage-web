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
          :loading="tableLoading"
          @expand="tableExpand"
          :expandedRowKeys="expandedRowKeys"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            onChange: onChange
          }"
          :scroll="{ y: 600 }"
        >
          <span slot="operation" slot-scope="row">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay" :style="{ textAlign: 'center' }">
                <a-menu-item @click="handleShowAddVector(row.dimensionId)">
                  添加向量
                </a-menu-item>
                <a-menu-item @click="handleShowEditDimension(row.dimensionId)">
                  修改
                </a-menu-item>
                <a-menu-item @click="handleShowRemoveDimensionConfirm(row)">
                  删除
                </a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()"><a-icon type="ellipsis"/></a>
            </a-dropdown>
          </span>
          <a-table
            :rowKey="record => record.vectorId"
            slot="expandedRowRender"
            :columns="vectorColumns"
            :data-source="row.vectorList"
            :pagination="false"
            slot-scope="row"
          >
            <span slot="vectorOperation" slot-scope="text, vectorRow">
              <a-dropdown :trigger="['click']">
                <a-menu slot="overlay" :style="{ textAlign: 'center' }">
                  <a-menu-item
                    @click="handleShowEditVector(vectorRow.vectorId)"
                  >
                    修改
                  </a-menu-item>
                  <a-menu-item
                    @click="handleShowRemoveVectorConfirm(vectorRow)"
                  >
                    删除
                  </a-menu-item>
                </a-menu>
                <a @click="e => e.preventDefault()"
                  ><a-icon type="ellipsis"
                /></a>
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
          <a-select
            v-decorator="[
              'dimensionType',
              {
                rules: [{ required: true, message: '维度分类不能为空！' }]
              }
            ]"
            placeholder="请选择维度分类..."
            @change="handleSelectChange"
          >
            <a-select-option value="">
              请选择
            </a-select-option>
            <a-select-option
              v-for="item in dimensionTypeList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.dataSetName }} -
              {{ item.dataType === 0 ? '表' : 'SQL' }}
            </a-select-option>
          </a-select>
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
          <a-select
            v-decorator="[
              'dimensionType',
              {
                rules: [{ required: true, message: '维度分类不能为空！' }],
                initialValue: Number(editDimensionFormData.dimensionType)
              }
            ]"
            placeholder="请选择维度分类..."
            @change="handleSelectChange"
          >
            <a-select-option value="">
              请选择
            </a-select-option>
            <a-select-option
              v-for="item in dimensionTypeList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.dataSetName }} -
              {{ item.dataType === 0 ? '表' : 'SQL' }}
            </a-select-option>
          </a-select>
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
      width="40%"
      :visible="addVectorVisible"
      :confirm-loading="addVectorLoading"
      @ok="handleAddVector"
      @cancel="handleAddVectorCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form-model
        ref="addVectorFormRef"
        :model="addVectorForm"
        :rules="addVectorFormRules"
        labelAlign="left"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <a-form-model-item ref="vectorName" label="向量名称" prop="vectorName">
          <a-input v-model="addVectorForm.vectorName" />
        </a-form-model-item>
        <a-form-model-item label="条件类型" prop="conditionType">
          <a-radio-group
            v-model="addVectorForm.conditionType"
            @change="handleRadioChange"
          >
            <a-radio value="0">
              精准属性
            </a-radio>
            <a-radio value="1">
              范围属性
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="isConditionShow"
          label="属性条件"
          prop="condition"
        >
          <a-input v-model="addVectorForm.condition" />
        </a-form-model-item>
        <div v-else>
          <a-form-model-item label="属性条件下限" prop="conditionMin">
            <a-input v-model="addVectorForm.conditionMin"></a-input>
          </a-form-model-item>
          <a-form-model-item label="属性条件上限" prop="conditionMax">
            <a-input v-model="addVectorForm.conditionMax"></a-input>
          </a-form-model-item>
        </div>
      </a-form-model>
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
      <a-form-model
        ref="editVectorFormRef"
        :model="editVectorForm"
        :rules="editVectorFormRules"
        labelAlign="left"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <a-form-model-item ref="vectorName" label="向量名称" prop="vectorName">
          <a-input v-model="editVectorForm.vectorName" />
        </a-form-model-item>
        <a-form-model-item label="条件类型" prop="conditionType">
          <a-radio-group
            v-model="editVectorForm.conditionType"
            @change="handleRadioChange"
          >
            <a-radio value="0">
              精准属性
            </a-radio>
            <a-radio value="1">
              范围属性
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="isConditionShow"
          label="属性条件"
          prop="condition"
        >
          <a-input v-model="editVectorForm.condition" />
        </a-form-model-item>
        <div v-else>
          <a-form-model-item label="属性条件下限" prop="conditionMin">
            <a-input v-model="editVectorForm.conditionMin"></a-input>
          </a-form-model-item>
          <a-form-model-item label="属性条件上限" prop="conditionMax">
            <a-input v-model="editVectorForm.conditionMax"></a-input>
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchDimensionName: '', // 查询维度名称
      dimensionListData: [], // 维度向量列表数据
      dimensionTypeList: [], // 维度类型下拉框列表
      // 维度列
      dimensionColumns: [
        {
          title: '维度名称',
          dataIndex: 'dimensionName',
          key: 'dimensionName',
          align: 'center'
        },
        {
          title: '维度类型',
          dataIndex: 'dimensionType',
          key: 'dimensionType',
          align: 'center'
        },
        {
          title: '字段名',
          dataIndex: 'fieldName',
          key: 'fieldName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '80px'
        }
      ],
      // 向量列
      vectorColumns: [
        {
          title: '向量名称',
          dataIndex: 'vectorName',
          key: 'vectorName',
          align: 'center'
        },
        {
          title: '属性条件',
          dataIndex: 'condition',
          key: 'condition',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'vectorOperation',
          key: 'vectorOperation',
          scopedSlots: { customRender: 'vectorOperation' },
          align: 'center',
          width: '80px'
        }
      ],
      // vectorData: [], // 向量列表数据
      expandedRowKeys: [], // 展开行
      tableLoading: false, // 表格加载spin
      addDimensionVisible: false, // 添加维度Modal显示
      addDimensionLoading: false, // 添加维度确定按钮loading
      editDimensionVisible: false, // 修改维度Modal显示
      editDimensionLoading: false, // 修改维度确定按钮loading
      editDimensionFormData: {}, // 修改维度回显数据
      addVectorVisible: false, // 新增向量Modal显示
      addVectorLoading: false, // 新增向量确定按钮loading
      editVectorVisible: false, // 修改向量Modal显示
      editVectorLoading: false, // 修改向量确定按钮loading
      selectedRowKeys: [], // 选中的行的id数组
      selectedRows: [], // 选中行的数据
      isConditionShow: true, // 属性条件切换
      addVectorDimensionId: '', // 添加向量传的维度id
      // 新增向量表单数据
      addVectorForm: {
        vectorName: '',
        conditionType: '0',
        condition: '',
        conditionMin: '',
        conditionMax: ''
      },
      // 新增向量表单校验规则
      addVectorFormRules: {
        vectorName: [
          {
            required: true,
            message: '向量名称不能为空！',
            trigger: 'blur'
          }
        ],
        conditionType: [
          {
            required: true,
            message: '条件类型不能为空！'
          }
        ],
        condition: [
          {
            required: true,
            message: '属性条件不能为空！'
          }
        ],
        conditionMin: [
          {
            required: true,
            message: '属性条件下限值不能为空！'
          }
        ],
        conditionMax: [
          {
            required: true,
            message: '属性条件上限值不能为空！'
          }
        ]
      },
      // 修改向量表单校验规则
      editVectorFormRules: {
        vectorName: [
          {
            required: true,
            message: '向量名称不能为空！',
            trigger: 'blur'
          }
        ],
        conditionType: [
          {
            required: true,
            message: '条件类型不能为空！'
          }
        ],
        condition: [
          {
            required: true,
            message: '属性条件不能为空！'
          }
        ],
        conditionMin: [
          {
            required: true,
            message: '属性条件下限值不能为空！'
          }
        ],
        conditionMax: [
          {
            required: true,
            message: '属性条件上限值不能为空！'
          }
        ]
      },
      editVectorForm: {} // 修改向量表单数据
    }
  },
  beforeCreate() {
    // 新增维度表单注册
    this.addDimensionForm = this.$form.createForm(this, {
      name: 'addDimensionForm'
    })
    // 修改维度表单组册
    this.editDimensionForm = this.$form.createForm(this, {
      name: 'editDimensionForm'
    })
  },
  created() {
    this.getDimensionList()
  },
  methods: {
    // 维度table展开操作
    tableExpand(expanded, record) {
      if (expanded) {
        this.expandedRowKeys = []
        this.expandedRowKeys.push(record.dimensionId)
      } else {
        this.expandedRowKeys = []
      }
      // this.vectorData = record.vectorList.map(item => {
      //   return {
      //     ...item,
      //     key: item.vectorId
      //   }
      // })
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
    // 维度分类数据Select下拉列表获取
    async getDimensionTypeList() {
      const { data: res } = await this.$http.request({
        url: '/getDataSetList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.dimensionTypeList = res.data
      } else {
        this.$message.info('未查询到维度类型！')
      }
    },
    // 维度类型下拉框选择事件
    handleSelectChange(value) {
      console.log('select-value', value)
    },
    // 新增维度Moda显示
    handleShowAddDimension() {
      this.addDimensionVisible = true
      this.getDimensionTypeList()
    },
    // 新增维度Modal提交
    handleAddDimension() {
      // 表单数据校验
      this.addDimensionForm.validateFields(async (err, values) => {
        // 如果表单没有错误
        if (!err) {
          // 确定按钮loading状态开启
          this.addDimensionLoading = true
          const { data: res } = await this.$http.post(
            'addDimension',
            this.$qs.stringify(values)
          )

          // 新增成功
          if (res.meta.status === 200) {
            this.addDimensionVisible = false
            this.addDimensionLoading = false
            this.getDimensionList()
            this.$message.success('新增维度成功！')
          } else {
            // 新增失败
            this.addDimensionLoading = false
            this.$message.error('新增维度失败！')
          }
          this.addDimensionForm.resetFields()
        }
      })
    },
    // 新增维度Modal取消
    handleAddDimensionCancel() {
      // 关闭Modal
      this.addDimensionVisible = false
      // 关闭loading状态
      this.addDimensionLoading = false
      // 重置表单域
      this.addDimensionForm.resetFields()
    },
    // 删除维度确认框显示
    handleShowRemoveDimensionConfirm() {
      // 接收this对象，因为在$confirm()中无法取到this
      const _this = this
      // 函数参数对象
      const args = arguments
      // 待拼装参数
      let params = []
      // 该函数未传入参数，说明是点击的多选删除，将已选则行的数据直接赋值给params
      if (args.length === 0) {
        params = this.selectedRowKeys
        // 该函数传入一个参数，说明是点击的行内删除，将获取的行的数据拼成数组赋值给params
      } else {
        params = [args[0].dimensionId]
        // 用作删除显示维度名称
        this.selectedRows = [args[0]]
      }
      // 删除提示中，具体的维度名称
      const removeText = this.selectedRows
        .map(item => item.dimensionName)
        .join('、')
      // 点击删除前校验时候已选择删除项
      if (params.length !== 0) {
        this.$confirm({
          title: '删除维度',
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
      // const { data: res } = await this.$http.post(
      //   'removeDimension',
      //   { ids },
      //   {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      //   }
      // )
      // 传递数组，需要将参数转化成json字符串
      const { data: res } = await this.$http
        .request({
          url: 'removeDimension',
          methods: 'post',
          params: {
            ids
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false })
          }
        })
        .catch(error => {
          this.$message.error('删除维度失败！' + error)
          this.selectedRowKeys = []
        })
      if (res.meta.status === 200) {
        this.$message.success('删除维度成功！')
      } else {
        this.$message.error('删除维度失败！')
      }
      // 清空已选行
      this.selectedRowKeys = []
      this.getDimensionList()
    },
    // 修改维度按钮点击事件
    async handleShowEditDimension(id) {
      // 获取维度分类列表
      this.getDimensionTypeList()
      this.editDimensionVisible = true
      const { data: res } = await this.$http.request({
        url: 'getDimension',
        methods: 'get',
        params: {
          id
        }
      })
      if (res.meta.status === 200) {
        this.editDimensionFormData = res.data
      } else {
        this.$message.info('查询维度信息失败！')
      }
      this.selectedRowKeys = []
    },
    // 修改维度提交事件
    handleEditDimension() {
      this.editDimensionForm.validateFields(async (err, values) => {
        if (!err) {
          this.editDimensionLoading = true
          const params = {
            ...values,
            id: this.editDimensionFormData.id
          }
          const { data: res } = await this.$http.post(
            'editDimension',
            this.$qs.stringify(params)
          )

          if (res.meta.status === 200) {
            this.$message.success('修改维度成功！')
          } else {
            this.$message.error('修改维度失败！')
          }
          this.editDimensionVisible = false
          this.editDimensionLoading = false
          // 修改维度回显数据清空
          this.editDimensionFormData = {}
          // 重置修改维度表单域
          this.editDimensionForm.resetFields()
          this.getDimensionList()
          this.selectedRowKeys = []
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
    handleShowAddVector(id) {
      this.addVectorVisible = true
      this.addVectorDimensionId = id
    },
    // 切换条件类型Radio
    handleRadioChange(e) {
      const radioValue = e.target.value
      // 0:精准条件=>isConditionShow:true; 1:范围条件=>isConditionShow:false
      this.isConditionShow = radioValue === '0'
    },
    // 新增向量Modal取消
    handleAddVectorCancel() {
      this.addVectorVisible = false
      this.addVectorLoading = false
      this.isConditionShow = true
      this.addVectorDimensionId = ''
      this.$refs.addVectorFormRef.resetFields()
    },
    // 新增向量提交事件
    handleAddVector() {
      this.$refs.addVectorFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        this.addVectorLoading = true
        let params = {}
        // 根据条件类型，拼装不同的参数
        if (!this.isConditionShow) {
          params = {
            dimensionId: this.addVectorDimensionId,
            vectorName: this.addVectorForm.vectorName,
            conditionType: this.addVectorForm.conditionType,
            condition: `${this.addVectorForm.conditionMin},${this.addVectorForm.conditionMax}`
          }
        } else {
          params = {
            dimensionId: this.addVectorDimensionId,
            vectorName: this.addVectorForm.vectorName,
            conditionType: this.addVectorForm.conditionType,
            condition: this.addVectorForm.condition
          }
        }
        const { data: res } = await this.$http.post(
          'addVector',
          this.$qs.stringify(params)
        )
        if (res.meta.status === 200) {
          this.$message.success('新增向量成功！')
        } else {
          this.$message.error('新增向量失败！')
        }
        this.addVectorVisible = false
        this.addVectorLoading = false
        this.addVectorDimensionId = ''
        this.isConditionShow = true
        this.$refs.addVectorFormRef.resetFields()
        this.addVectorForm = {
          vectorName: '',
          conditionType: '0',
          condition: '',
          conditionMin: '',
          conditionMax: ''
        }
        this.getDimensionList()
      })
    },
    // 修改向量Modal显示
    async handleShowEditVector(id) {
      this.editVectorVisible = true
      const { data: res } = await this.$http.request({
        url: 'getVector',
        methods: 'get',
        params: {
          id
        }
      })
      if (res.meta.status === 200) {
        // 根据条件类型，进行数据回显
        // 精准条件
        if (res.data.conditionType === '0') {
          this.editVectorForm = res.data
          this.isConditionShow = true
          // 范围条件
        } else {
          this.isConditionShow = false
          this.editVectorForm = {
            conditionMin: res.data.condition.split(',')[0],
            createTime: res.data.createTime,
            vectorId: res.data.vectorId,
            vectorName: res.data.vectorName,
            conditionType: res.data.conditionType,
            conditionMax: res.data.condition.split(',')[1]
          }
        }
      }
    },
    // 修改向量提交事件
    handleEditVector() {
      this.$refs.editVectorFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        this.editVectorLoading = true
        let params = {}
        if (!this.isConditionShow) {
          params = {
            id: this.editVectorForm.vectorId,
            vectorName: this.editVectorForm.vectorName,
            conditionType: this.editVectorForm.conditionType,
            condition: `${this.editVectorForm.conditionMin},${this.editVectorForm.conditionMax}`
          }
        } else {
          params = {
            id: this.editVectorForm.vectorId,
            vectorName: this.editVectorForm.vectorName,
            conditionType: this.editVectorForm.conditionType,
            condition: this.editVectorForm.condition
          }
        }
        const { data: res } = await this.$http.post(
          'editVector',
          this.$qs.stringify(params)
        )
        if (res.meta.status === 200) {
          this.$message.success('修改向量成功！')
        } else {
          this.$message.error('修改向量失败！')
        }
        this.editVectorVisible = false
        this.editVectorLoading = false
        this.isConditionShow = true
        this.$refs.editVectorFormRef.resetFields()
        this.editVectorForm = {}
        this.getDimensionList()
      })
    },
    // 修改向量Modal取消
    handleEditVectorCancel() {
      this.editVectorVisible = false
      this.editVectorLoading = false
      this.$refs.editVectorFormRef.resetFields()
      this.editVectorForm = {}
    },
    // 根据ID删除向量
    handleShowRemoveVectorConfirm(row) {
      const _this = this
      this.$confirm({
        title: '删除向量',
        content: (
          <div>
            <p>
              确定删除：<a>{row.vectorName}</a>&nbsp;吗？
            </p>
            <em>删除后不可恢复，请谨慎操作！</em>
          </div>
        ),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          _this.removeVectorById(row.vectorId)
        },
        onCancel() {
          _this.$message.info('已取消删除操作！')
        }
      })
    },
    // 根据ID删除向量确定
    async removeVectorById(id) {
      const { data: res } = await this.$http.request({
        url: 'removeVector',
        methods: 'get',
        params: {
          id
        }
      })
      if (res.meta.status === 200) {
        this.$message.success('删除向量成功！')
      } else {
        this.$message.error('删除向量失败！')
      }
      this.getDimensionList()
    },
    // 获取维度向量列表
    async getDimensionList() {
      this.tableLoading = true
      const { data: res } = await this.$http.request({
        url: 'getDimensionList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.tableLoading = false
        this.dimensionListData = res.data
      } else {
        this.$message.error('维度向量列表获取失败！')
      }
    },
    // rowSelection() {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: selectedRowKeys => {
    //       this.selectedRowKeys = selectedRowKeys
    //       console.log('typeof rowkeys===', selectedRowKeys instanceof Array)
    //       console.log(`selectedRowKeys: ${selectedRowKeys}`)
    //     }
    //   }
    // }
    // 表格多选事件
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  computed: {
    // 维度列表数据
    computeDimensionListData() {
      const tempList = this.dimensionListData.map(item => {
        return {
          ...item,
          key: item.dimensionId
        }
      })
      return tempList
    }
  }
}
</script>
<style lang="less" scoped></style>
