<template>
  <div>
    <div class="pull-left">
      <div>
        <i class="title-icon"></i>
        <span class="title-text">新增组件</span>
      </div>
      <div>
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" labelAlign="left">
          <a-form-item label="组件名称">
            <!-- 通过ant-design-vue去获取表单的数据是使用v-decorator的方式去给每个项去注册，
            这样才能通过组件去拉取表单的数据，同时对必填项做校验-->
            <a-input
              v-decorator="[
                'componentName',
                {
                  rules: [
                    {
                      required: true,
                      message: '组件名称不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入组件名称"
            />
          </a-form-item>
          <a-form-item label="图形">
            <a-select
              v-decorator="[
                'chartOption',
                {
                  rules: [{ required: true, message: '图形不能为空！' }]
                }
              ]"
              placeholder="请选择图形"
              @change="getChartOption"
            >
              <a-select-option v-for="item in chartOptionData" :key="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <a-form-item label="X轴纬度" v-if="isConditionShowX">
            <a-select
              v-decorator="[
                'xDimension',
                {
                  rules: [{ required: true, message: '纬度不能为空！' }]
                }
              ]"
              placeholder="请选择纬度"
              @change="showVector"
            >
              <a-select-opt-group
                v-for="(item, index) in xDimensionData"
                :key="index"
                :label="item.dimensionType"
              >
                <a-select-option
                  v-for="children in item.dimensionList"
                  :key="children.id"
                  :value="children.id+','+item.dimensionTypeId"
                >{{ children.dimensionName }}</a-select-option>
              </a-select-opt-group>
            </a-select>
          </a-form-item>
          <a-form-item label="xxx向量" v-if="isConditionShowX">
            <a-checkbox-group
              v-decorator="[
                'xVector',
                {
                  rules: [{ required: true, message: '向量不能为空！' }]
                }
              ]"
            >
              <a-checkbox
                v-for="item in xVectorData"
                :key="item.id"
                :value="item.id"
              >{{ item.vectorName }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <a-form-item label="Y轴纬度" v-if="isConditionShowY">
            <a-select
              v-decorator="[
                'yDimension',
                {
                  rules: [{ required: true, message: '纬度不能为空！' }]
                }
              ]"
              placeholder="请选择纬度"
              @change="showVectorY"
            >
              <a-select-opt-group
                v-for="(item, index) in xDimensionData"
                :key="index"
                :label="item.dimensionType"
              >
                <a-select-option
                  v-for="children in item.dimensionList"
                  :key="children.id"
                  :value="children.id+','+item.dimensionTypeId"
                >{{ children.dimensionName }}</a-select-option>
              </a-select-opt-group>
            </a-select>
          </a-form-item>
          <a-form-item label="xxx向量" v-if="isConditionShowY">
            <a-checkbox-group
              v-decorator="[
                'yVector',
                {
                  rules: [{ required: true, message: '向量不能为空！' }]
                }
              ]"
            >
              <a-checkbox
                v-for="item in yVectorData"
                :key="item.id"
                :value="item.id"
              >{{ item.vectorName }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <a-form-item label="统计项">
            <a-select
              v-decorator="[
                'statisItem',
                {
                  rules: [{ required: true, message: '统计项不能为空！' }]
                }
              ]"
              placeholder="请选择统计项"
            >
              <a-select-option value="currentNum">现有数量</a-select-option>
              <a-select-option value="standardNum">编制数量</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-button class="saveButton" type="primary" @click="showConfirm">确定</a-button>
        <!-- <a-button class="Button2" type="primary" @click="showConfirm">取消</a-button> -->
      </div>
    </div>

    <!-- 组件预览 -->
    <div class="pull-right">
      <div
        id="mychart"
        :style="{
                    width: '70%',
                    height: '70%',
                    marginTop: '20px'
                }"
      >组件预览</div>

      <!-- 样式设置 -->
      <div class>样式设置</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isConditionShowX: true, //x轴纬度、向量显示
      isConditionShowY: true, //x轴纬度、向量显示
      chartOptionData: [], //基础图表下拉框列表
      currentOption: {},
      xDimensionData: [], //下拉框x纬度
      xVectorData: [], //指定x纬度的向量
      yDimensionData: [], //下拉框y纬度
      yVectorData: [] //指定y纬度的向量
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dataSourceForm' })
  },
  created() {
    this.getChartOptionData()
    this.getDimensionData()
  },
  mounted() {
    //   this.drawMychart()
  },
  methods: {
    // 获取基础图表下拉框列表,第一次选择下拉框的图后，先生成一次预览图
    async getChartOptionData() {
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getChartSelectList'
      })
      if (res.meta.status === 200) {
        this.chartOptionData = res.data.map(item => {
          return {
            value: item.chartId,
            label: item.chartName
          }
        })
        // console.log(`this.chartOptionData是${this.chartOptionData}`)
      } else {
        this.$message.error('失败')
      }
    },
    //根据 ID 查询基础图表 option,传入chartId
    async getChartOption(value) {
      console.log(`点击后的value是${value}`)
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getChartOption',
        params: { id: value }
      })
      if (res.meta.status === 200) {
        //   eval(("{}"))  用法
        let tempData = eval(`(${res.data[0].chartOption})`)
        //   let str = tempData.replace(/\s*/g,"").replace(/[\r\n]/g,"")
        // console.log(`tempData是------${tempData}`)
        //   this.currentOption = res[0].chartOption
        this.currentOption = tempData
        // console.log(`currentOption是${this.currentOption.tooltip}`)
        this.$message.success('成功')
        this.drawMychart()
        //判断一维还是二维
        let tempCondition = eval(`(${res.data[0].dimensionforchart})`)
        if (tempCondition.length != 2) {
          this.isConditionShowY = false
        }
        // console.log(this.isConditionShowX)
      } else {
        this.$message.error('失败')
      }
    },
    //画图
    drawMychart() {
      //初始化echarts实例
      let myChart
      myChart && myChart.dispose()
      myChart = this.$echarts.init(document.getElementById('mychart'))
      //获取下拉框的option
      myChart.setOption(this.currentOption)
    },

    //获取维度下拉框列表
    async getDimensionData() {
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getDimensionSelectList'
      })
      if (res.meta.status === 200) {
        this.xDimensionData = res.data
        // console.log(`dimensionList是${this.xDimensionData.dimensionList.dimensionName}`)
      } else {
        this.$message.error('失败')
      }
    },
    //根据维度 ID 查询X向量
    async showVector(value) {
      console.log(`点击后的value是${value}`)
      let id = value.split(',')[0]
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getVectorList',
        params: { id }
      })
      if (res.meta.status === 200) {
        console.log(`根据纬度id查询向量${res.data}`)
        this.xVectorData = res.data
        this.$message.success('成功')
      } else {
        this.$message.error('失败')
      }
    },
    //根据维度 ID 查询Y向量
    async showVectorY(value) {
      console.log(`点击后的value是${value}`)
      let id = value.split(',')[0]
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getVectorList',
        params: { id }
      })
      if (res.meta.status === 200) {
        console.log(`根据纬度id查询向量${res.data}`)
        this.yVectorData = res.data
        this.$message.success('成功')
      } else {
        this.$message.error('失败')
      }
    },
    //接口27，获取图表数据
    // async previewChart(){
    //   let params
    //   if(isConditionShowY){
    //     //
    //   }else {
    //     params = {
    //       dataId:
    //     }
    //   }
    //   const { data: res } = await this.$http.request({
    //     methods: 'get',
    //     url: 'previewChart',
    //     params: {
    //     }
    //   })
    // },

    //保存所有设置数据
    showConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this)
          const _this = this
          console.log('Received values of form: ', values)

          let parmes = {}
          let dimensionXId = values.xDimension.split(',')[1]
          let dimensionYId = values.yDimension.split(',')[1]
          //判断x纬度和y纬度是否同一个数据集
          if (dimensionXId !== dimensionYId) {
            return this.$message.error('请选择同一数据集下纬度!')
          }
          if (this.isConditionShowY) {
            parmes = {
              dataId: values.xDimension.split(',')[1],
              chartId: values.chartOption,
              dimensions: [
                {
                  dimensionId: dimensionXId,
                  dimensionXY: 'x',
                  vectorList: values.xVector
                },
                {
                  dimensionId: dimensionYId,
                  dimensionXY: 'y',
                  vectorList: values.yVector
                }
              ],
              statisItem: values.statisItem
            }
          } else {
            parmes = {
              dataId: values.xDimension.split(',')[1],
              chartId: values.chartOption,
              dimensions: [
                {
                  dimensionId: dimensionXId,
                  dimensionXY: 'x',
                  vectorList: values.xVector
                }
              ],
              statisItem: values.statisItem
            }
          }
          this.$confirm({
            title: '保存数据源',
            content: <div style="color:green;">确定保存该设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
              _this.saveDataSource(parmes)
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      })
    },
    //保存图表组件
    async saveDataSource(values) {
      const { data: res } = await this.$http.request({
        url: '/saveChart',
        method: 'post',
        params: values
      })
      if (res.meta.status === 200) {
        this.$message.success('保存数据源成功')
      } else {
        this.$message.error('保存数据源失败')
      }
    }
  }
}
</script>
<style scoped>
.title-icon {
  display: inline-block;
  width: 4px;
  height: 1rem;
  background-color: #128075;
  vertical-align: middle;
}
.title-text {
  font-size: 1rem;
  vertical-align: middle;
  margin-left: 5px;
}
.pull-right {
  float: right;
  width: 50%;
  height: 910px;
}
.pull-left {
  float: left;
  width: 50%;
}
.line {
  background: #e2e3e6;
  height: 1px;
  width: 640px;
}
.saveButton {
  margin: 0 auto;
}
.Button2 {
  background: #ffffff;
  border: 1px solid #d1d3d8;
  color: gray;
}
</style>