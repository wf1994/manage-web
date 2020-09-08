<template>
  <div>
    <div class="pull-left">
      <div>
        <i class="title-icon"></i>
        <span class="title-text">新增组件</span>
      </div>
      <div>
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          labelAlign="left"
        >
          <a-form-item label="组件名称" :style="{ marginTop: '29px' }">
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
                  ],
                  initialValue: ediFormData.componentName
                }
              ]"
              placeholder="请输入组件名称"
              :style="{ width: '360px', height: '32px', marginLeft: '15px' }"
            />
          </a-form-item>
          <a-form-item label="图形">
            <a-select
              v-decorator="[
                'chartOption',
                {
                  rules: [{ required: true, message: '图形不能为空！' }],
                  initialValue: ediFormData.chartId.toString()
                }
              ]"
              placeholder="请选择图形"
              @change="getChartOption"
              :style="{ width: '360px', height: '32px', marginLeft: '15px' }"
            >
              <a-select-option
                v-for="item in chartOptionData"
                :key="item.value"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <div v-if="mapShow">
            <a-form-item
              label="X轴纬度"
              v-if="isConditionShowX"
              :style="{ marginTop: '29px' }"
            >
              <a-select
                v-decorator="[
                  'xDimension',
                  {
                    rules: [{ required: true, message: '纬度不能为空！' }],
                    initialValue: weidu
                  }
                ]"
                placeholder="请选择纬度"
                @change="showVector"
                :style="{ width: '360px', height: '32px', marginLeft: '15px' }"
              >
                <a-select-opt-group
                  v-for="(item, index) in xDimensionData"
                  :key="index"
                  :label="item.dimensionType"
                >
                  <a-select-option
                    v-for="children in item.dimensionList"
                    :key="children.id"
                    :value="
                      Number(children.id).toFixed() + ',' + item.dimensionTypeId
                    "
                    >{{ children.dimensionName }}</a-select-option
                  >
                  <!-- 拼接两个ID，左边是纬度ID，右边是数据集ID -->
                </a-select-opt-group>
              </a-select>
            </a-form-item>
            <a-form-item label="xxx向量" v-if="isConditionShowX">
              <a-checkbox-group
                v-decorator="[
                  'xVector',
                  {
                    rules: [{ required: true, message: '向量不能为空！' }],
                    initialValue: ediFormData.dimensions[0].vectorList.join(',')
                  }
                ]"
                :style="{ marginLeft: '15px' }"
              >
                <a-checkbox
                  v-for="item in xVectorData"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.vectorName }}</a-checkbox
                >
              </a-checkbox-group>
            </a-form-item>
            <div class="line"></div>
            <!-- 分隔线 -->
            <a-form-item
              label="Y轴纬度"
              v-if="isConditionShowY"
              :style="{ marginTop: '29px' }"
            >
              <a-select
                v-decorator="[
                  'yDimension',
                  {
                    rules: [{ required: true, message: '纬度不能为空！' }],
                    initialValue: weiduy
                  }
                ]"
                placeholder="请选择纬度"
                @change="showVectorY"
                :style="{ width: '360px', height: '32px', marginLeft: '15px' }"
              >
                <a-select-opt-group
                  v-for="(item, index) in xDimensionData"
                  :key="index"
                  :label="item.dimensionType"
                >
                  <a-select-option
                    v-for="children in item.dimensionList"
                    :key="children.id"
                    :value="
                      Number(children.id).toFixed() + ',' + item.dimensionTypeId
                    "
                    >{{ children.dimensionName }}</a-select-option
                  >
                </a-select-opt-group>
              </a-select>
            </a-form-item>
            <a-form-item label="xxx向量" v-if="isConditionShowY">
              <a-checkbox-group
                v-decorator="[
                  'yVector',
                  {
                    rules: [{ required: true, message: '向量不能为空！' }],
                    initialValue: ediFormData.dimensions[1].vectorList.join(',')
                  }
                ]"
                :style="{ marginLeft: '115px' }"
              >
                <a-checkbox
                  v-for="item in yVectorData"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.vectorName }}</a-checkbox
                >
              </a-checkbox-group>
            </a-form-item>
            <div class="line"></div>
            <!-- 分隔线 -->
            <a-form-item label="统计项" :style="{ marginTop: '29px' }">
              <a-select
                v-decorator="[
                  'statisItem',
                  {
                    rules: [{ required: true, message: '统计项不能为空！' }],
                    initialValue: ediFormData.statisItem
                  }
                ]"
                placeholder="请选择统计项"
                :style="{ width: '360px', height: '32px', marginLeft: '15px' }"
              >
                <a-select-option v-for="item in statisData" :key="item.id">{{
                  item.item_name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-form-item
            label="文本输入"
            v-if="textShow"
            :style="{ marginTop: '29px' }"
          >
            <a-textarea
              v-decorator="[
                'text',
                {
                  initialValue: ediFormData.text
                }
              ]"
              placeholder="Controlled autosize"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :style="{ width: '360px', height: '32px', marginLeft: '15px' }"
            />
          </a-form-item>
        </a-form>
        <a-button class="saveButton" type="primary" @click="showConfirm" v-if="this.$route.params.id == 'add'"
          >确定新增</a-button
        >
        <a-button class="saveButton" type="primary" @click="showConfirmEdit(this.$route.params.id)" v-if="this.$route.params.id !== 'add'"
          >确定修改</a-button
        >
      </div>
    </div>

    <!-- 组件预览 -->
    <div class="pull-right previewDiv">
      <a-button type="primary" @click="previewChart">组件预览</a-button>
      <div
        id="mychart"
        :style="{
          width: '90%',
          height: '90%',
          margin: '0 auto'
        }"
      >
        <!-- '<p style="color:red">保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字保存文字</p>' -->
      </div>

      <div class="baishanDiy">
        <div class="null"></div>
        <div class="titleShowOn">
          <!-- <span>是否显示标题</span> -->
          <a-radio-group @change="onChangeText" :ckecked="true">
            <a-radio :value="1" :style="{fontSize: '24px'}">显示标题</a-radio>
            <a-radio :value="2" :style="{fontSize: '24px'}">不显示标题</a-radio>
          </a-radio-group>
        </div>
        <div class="null"></div>
        <div class="titleText">
          <a-input-search
            placeholder="请输入标题"
            size="default"
            allow-clear
            @search="onSearch"
            class="inputTitle"
          >
            <a-button slot="enterButton">生成预览</a-button>
          </a-input-search>
        </div>
        <div class="null"></div>
        <div class="titleShowOn">
          <span>标题位置</span>
          <a-radio-group @change="onChangeTitlePosition" :ckecked="true">
            <a-radio :value="1">左边</a-radio>
            <a-radio :value="2">中间</a-radio>
            <a-radio :value="3">右边</a-radio>
          </a-radio-group>
        </div>
        <div class="null"></div>
        <div class="titleShowOn">
          <span>选择颜色</span>
          <colorPicker v-model="color" v-on:change="headleChangeColor" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataSourceId: 0,
      seriesFlag: 0, //series的标志，用于几个条形图柱状图的series的标记
      flag: 0, //初0，预览后为1,先预览再保存
      color: '#ff0000',
      isConditionShowX: true, //x轴纬度、向量显示
      isConditionShowY: true, //y轴纬度、向量显示
      mapShow: true, //地图组件，隐藏下面设置
      textShow: false, //文本组件，默认隐藏
      chartOptionData: [], //基础图表下拉框列表
      statisData: [], //统计项
      currentOption: {},
      colorOption: {}, //修改颜色后的option
      textOption: {}, //标题修改后的option
      xDimensionData: [], //下拉框纬度
      xVectorData: [], //指定x纬度的向量
      yDimensionData: [], //下拉框y纬度
      yVectorData: [], //指定y纬度的向量
      chartId: '',
      ediFormData: {
        componentName: '',
        chartId: '',
        dimensions: [
          { dimensionTypeId: '', id: '', vectorList: [] },
          { dimensionTypeId: '', id: '', vectorList: [] }
        ],
        statisItem: '',
        text: ''
      }, //编辑表单
      weidu: '', //回显纬度
      weiduy: ''
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dataSourceForm' })
  },
  created() {
    this.chartId = this.$route.params.id
    //获取维度下拉框列表
    setTimeout(() => {
      this.getDimensionData()
    }, 0)
    // 获取基础图表下拉框列表
    setTimeout(() => {
      this.getChartOptionData()
    }, 200)
    //编辑回显
    if (this.$route.params.id !== 'add') {
      setTimeout(() => {
        this.getChartData(this.$route.params.id)
      }, 600)
    }
  },
  mounted() {
    //获取统计项(写在获取数据源ID接口中)
    setTimeout(() => {
      this.getDataSourceId()
    }, 1000)
  },
  methods: {
    //获取数据源ID（二期新增）
    async getDataSourceId() {
      const { data: res } = await this.$http.request({
        url: '/getCurrentDataSourceId',
        methods: 'get'
      })
      if (parseInt(res.status) === 200) {
        this.dataSourceId = res.datasourceid
        // this.$set(this.dataSourceId, res.datasourceid)
        // setTimeout(() => {this.getStatisData(res.datasourceid)}, 0)

        this.getDataSetList(this.dataSourceId)
      } else {
        this.$message.error('数据集列表获取失败！')
      }
    },
    //是否显示图标题
    onChangeText(e) {
      console.log(`图标题====${e.target.value}`)
      console.log(`textOption之前=====${JSON.stringify(this.textOption)}`)
      if (e.target.value === 1) {
        this.textOption.title.show = true
      } else {
        this.textOption.title.show = false
      }
      console.log(`textOption修改后=====${JSON.stringify(this.textOption)}`)
      this.drawMychart(this.textOption)
      this.currentOption = this.textOption
    },

    onSearch(value) {
      this.textOption.title.text = value
      console.log(`看看输入文字后的====${JSON.stringify(this.textOption)}`)
      this.drawMychart(this.textOption)
      this.currentOption = this.textOption
    },

    //修改颜色
    headleChangeColor(color) {
      console.log(`colorPicker==========${color}`)
      this.colorOption.color = color
      console.log(`colorOption==========${JSON.stringify(this.colorOption)}`)
      this.drawMychart(this.colorOption)
      this.currentOption = this.colorOption
    },
    //标题位置
    onChangeTitlePosition(e) {
      if (e.target.value === 1) {
        this.textOption.title.left = 'left'
      } else if (e.target.value === 2) {
        this.textOption.title.left = 'middle'
      } else {
        this.textOption.title.left = 'right'
      }
      this.drawMychart(this.textOption)
      this.currentOption = this.textOption
    },

    //根据 组件列表中的ID 查询组件所有信息，点击编辑调用
    async getChartData(id) {
      console.log(`this.chartId========${this.chartId}`)
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getComponent',
        params: { id }
      })
      if (res.meta.status === 200) {
        this.ediFormData = res.data
        console.log(`this.ediFormData===${JSON.stringify(this.ediFormData)}`)
        //根据dimension数组长度判断一维还是二纬
        if (res.data.dimensions.length === 2) {
          let m = new Array()
          m[0] = this.ediFormData.dimensions[0].id
          m[1] = this.ediFormData.dimensions[0].dimensionTypeId
          this.weidu = m.join(',')
          // console.log(typeof this.weidu)
          let n = new Array()
          n[0] = this.ediFormData.dimensions[1].id
          n[1] = this.ediFormData.dimensions[1].dimensionTypeId
          this.weiduy = n.join(',')
          //编辑时数据回显，预览，查询option
          this.currentOption = eval(`(${res.data.chartOption})`)
          //针对堆叠柱状图，series修改
          // console.log(`堆叠=====${this.ediFormData.chartId}`)
          if (res.data.chartId === 7) {
            let arr = new Array()
            for (
              let m = 0;
              m < this.ediFormData.dimensions[1].vectorList.length;
              m++
            ) {
              arr.push({ type: 'bar', seriesLayoutBy: 'row', stack: 1 })
            }
            this.currentOption.series = arr
          }
          //针对对比柱形图
          if (res.data.chartId === 5) {
            console.log('对比柱形图修改series====')
            let arr = new Array()
            for (
              let m = 0;
              m < this.ediFormData.dimensions[1].vectorList.length;
              m++
            ) {
              arr.push({ type: 'bar', seriesLayoutBy: 'row' })
            }
            this.currentOption.series = arr
          }
          console.log('-=-=-==-=-=-=-=-=')
          console.log(this.currentOption)

          this.drawMychart(this.currentOption)
          this.showVector(`${m[0]},0`)
          if (n[0]) {
            this.showVectorY(`${n[0]},1`)
          }
        } else {
          let m = new Array()
          m[0] = this.ediFormData.dimensions[0].id
          m[1] = this.ediFormData.dimensions[0].dimensionTypeId
          this.weidu = m.join(',')
          this.currentOption = eval(`(${res.data.chartOption})`)
          this.drawMychart(this.currentOption)
          this.showVector(`${m[0]},0`)
          this.isConditionShowY = false
        }
      } else {
        this.$message.error('失败')
      }
    },
    // 获取基础图表下拉框列表
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
      } else {
        this.$message.error('失败')
      }
    },
    //获取统计项
    async getDataSetList(id) {
      const { data: res } = await this.$http.request({
        url: '/getStatisSet',
        methods: 'get',
        params: {
          datasourceid: id
        }
      })
      if (res.status === 200) {
        this.statisData = res.data
        console.log('this.statisData', this.statisData)
        console.log('统计项列表获取成功')
      } else {
        this.$message.error('统计项列表获取失败！')
      }
    },
    //根据 ID 查询基础图表 option,图形下拉框
    async getChartOption(value) {
      console.log(`点击后的value是${value}`)
      this.textShow = false
      this.mapShow = true
      //判断是地图还是文字组件还是普通组件，地图组件：下面的内容隐藏(mapShow)，文字组件：下面显示文本输入框(textShow)
      if (value == 16) {
        //id为 ,文本组件，不需要option
        this.textShow = true
        this.mapShow = false
        // this.$message.success('文本组件成功')
        //测试，文本组件的文本信息存在option还是新建字段？
        // const { data: res } = await this.$http.request({
        //   methods: 'get',
        //   url: 'getChartOption',
        //   params: { id: value }
        // })
        // console.log('请求马上发生')
        // if (res.data.status === 200) {
        //   let tempData = eval(`(${res.data[0].chartOption})`)
        //   this.currentOption = tempData
        //   console.log("文本组件回传")
        //   console.log(this.currentOption)
        // }
        //拿到文本数据
        let tempData = '这是文本组件示例，请在下面的文本域输入内容'
        this.currentOption = tempData
        document.getElementById(
          'mychart'
        ).innerHTML = `<p>${this.currentOption}</p>`
        return
      }
      if (value == 12) {
        //地图
        this.mapShow = true
        this.isConditionShowY = false
      }
      //如果是柱状条形图等图，基础图id为5、6、7、8
      if (value == 5 || value == 6) {
        this.seriesFlag = 1
      }
      if (value == 7 || value == 8) {
        this.seriesFlag = 2
      }
      if (value == 13) {
        //饼图
        this.seriesFlag = 3
      }
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'getChartOption',
        params: { id: value }
      })
      if (res.meta.status === 200) {
        //   eval(("{}"))  用法
        let tempData = eval(`(${res.data[0].chartOption})`)
        //   let str = tempData.replace(/\s*/g,"").replace(/[\r\n]/g,"")
        //   this.currentOption = res[0].chartOption
        this.currentOption = tempData
        this.$message.success('成功')
        this.drawMychart(this.currentOption)
        //判断一维还是二维
        let tempCondition = eval(`(${res.data[0].dimensionforchart})`)
        if (tempCondition.length != 2) {
          this.isConditionShowY = false
        } else {
          this.isConditionShowY = true
        }
      } else {
        this.$message.error('失败')
      }
    },
    //画图
    drawMychart(option) {
      //初始化echarts实例
      let myChart
      myChart && myChart.dispose()
      myChart = this.$echarts.init(document.getElementById('mychart'))
      //每次出图前先清理之前的setOption的数据
      myChart.clear()
      myChart.setOption(option)
    },
    //获取维度下拉框列表
    async getDimensionData() {
      const { data: res } = await this.$http.request({
        methods: 'get',
        // url: 'getDimensionSelectList'
        url: 'getDimensionList',
        parmes: { datasourceid: this.currentDataSourceId}
      })
      // console.log(`纬度下拉框-=-=-=-=-=-=-=`)
      // console.log(res.data)
      if (res.meta.status === 200) {
        this.xDimensionData = res.data
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
        params: { id: Number(id).toFixed() }
      })
      if (res.meta.status === 200) {
        console.log(`根据纬度id查询向量${res.data}`)
        this.xVectorData = res.data.map(item => ({
          ...item,
          id: Number(item.id).toFixed()
        }))
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
        params: { id: Number(id).toFixed() }
      })
      if (res.meta.status === 200) {
        console.log(`根据纬度id查询向量${res.data}`)
        this.yVectorData = res.data.map(item => ({
          ...item,
          id: Number(item.id).toFixed()
        }))
        this.$message.success('成功')
      } else {
        this.$message.error('失败')
      }
    },
    //接口27，获取图表数据
    previewChart() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const _this = this
          console.log('Received values of form: ', values)
          //如果是文本组件，直接把form表单的text给dom的innerHTML
          console.log(values.chartOption)
          if (values.chartOption == 16) {
            document.getElementById('mychart').innerHTML = ''
            document.getElementById('mychart').innerHTML = values.text
            this.flag = 1
            return
          }
          let parmes = {}
          let dimensionXId = values.xDimension.split(',')[1]
          let dimensionYId =
            values && values.yDimension && values.yDimension.split(',')[1]
          if (this.$route.params.id !== 'add') {
            if (this.isConditionShowY) {
              //判断x纬度和y纬度是否同一个数据集
              if (dimensionXId !== dimensionYId) {
                return this.$message.error('请选择同一数据集下纬度!')
              }
              console.log(`编辑=========${values.xVector}`)
              console.log(`zhouxingy类型=========${typeof values.xVector}`)
              parmes = {
                dataId: values.xDimension.split(',')[1],
                chartId: values.chartOption,
                dimensions: JSON.stringify([
                  {
                    dimensionId: values.xDimension.split(',')[0],
                    dimensionXY: 'x',
                    // vectorList: values.xVector
                    vectorList:
                      typeof values.xVector === 'string'
                        ? values.xVector.split(',')
                        : values.xVector
                  },
                  {
                    dimensionId: values.yDimension.split(',')[0],
                    dimensionXY: 'y',
                    // vectorList: values.yVector
                    vectorList:
                      typeof values.yVector === 'string'
                        ? values.yVector.split(',')
                        : values.yVector
                  }
                ]),
                statisItem: values.statisItem
                // text: values.text
              }
              // console.log(`baishan=======${JSON.stringify(parmes)}`)
            } else {
              parmes = {
                dataId: values.xDimension.split(',')[1],
                chartId: values.chartOption,
                dimensions: JSON.stringify([
                  {
                    dimensionId: values.xDimension.split(',')[0],
                    dimensionXY: 'x',
                    vectorList:
                      typeof values.xVector === 'string'
                        ? values.xVector.split(',')
                        : values.xVector
                  }
                ]),
                statisItem: values.statisItem
                // text: values.text
              }
            }
          } else {
            if (this.isConditionShowY) {
              //判断x纬度和y纬度是否同一个数据集
              if (dimensionXId !== dimensionYId) {
                return this.$message.error('请选择同一数据集下纬度!')
              }
              console.log(`新增======${values.xVector}`)
              parmes = {
                dataId: values.xDimension.split(',')[1],
                chartId: values.chartOption,
                dimensions: JSON.stringify([
                  {
                    dimensionId: values.xDimension.split(',')[0],
                    dimensionXY: 'x',
                    vectorList:
                      typeof values.xVector === 'string'
                        ? values.xVector.split(',')
                        : values.xVector
                  },
                  {
                    dimensionId: values.yDimension.split(',')[0],
                    dimensionXY: 'y',
                    vectorList:
                      typeof values.yVector === 'string'
                        ? values.yVector.split(',')
                        : values.yVector
                  }
                ]),
                statisItem: values.statisItem
                // text: values.text
              }
            } else {
              parmes = {
                dataId: values.xDimension.split(',')[1],
                chartId: values.chartOption,
                dimensions: JSON.stringify([
                  {
                    dimensionId: values.xDimension.split(',')[0],
                    dimensionXY: 'x',
                    vectorList:
                      typeof values.xVector === 'string'
                        ? values.xVector.split(',')
                        : values.xVector
                  }
                ]),
                statisItem: values.statisItem
                // text: values.text
              }
            }
          }

          console.log(`点击前的parmes是${JSON.stringify(parmes)}`)
          this.$confirm({
            title: '预览',
            content: <div style="color:green;">确定按照此配置预览吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
              _this.getPreviewChartOption(parmes)
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      })
    },
    //获取图表数据
    async getPreviewChartOption(parmes) {
      //如果是文本组件，直接用文本包一个p标签赋值给预览div的dom的innerHTML
      // if(this.textShow === true) {
      //   document.getElementById('mychart').innerHTML = `<p>${values.text}</p>`
      //   return
      // }
      this.flag = 1
      // console.log('点击后的parmes看这里-------' + JSON.stringify(parmes))
      //qs.stringify()将对象 序列化成URL的形式，以&进行拼接
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'previewChart',
        params: parmes,
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
        // params: JSON.stringify(parmes)
      })
      if (res.meta.status === 200) {
        // let tempData = eval(`(${res.data[0].chartOption})`)
        this.currentOption.dataset.source = res.source
        console.log('预览时======', res.source)
        //加判断，条形图
        if (this.seriesFlag == 1) {
          let arr = new Array()
          for (let m = 0, length = res.source.length - 1; m < length; m++) {
            arr.push({ type: 'bar', seriesLayoutBy: 'row' })
          }
          this.currentOption.series = arr
          console.log('预览时修改了series:')
          console.log(this.currentOption)
        }
        //堆叠图
        if (this.seriesFlag == 2) {
          let arr = new Array()
          for (let m = 0, length = res.source.length - 1; m < length; m++) {
            arr.push({ type: 'bar', seriesLayoutBy: 'row', stack: 1 })
          }
          this.currentOption.series = arr
        }
        //饼图
        if (this.seriesFlag == 3) {
          this.currentOption.series[0].encode.value = res.source[0][1]
          this.currentOption.series[0].encode.tooltip = res.source[0][1]
        }
        this.$message.success('成功')
        let previewOption = this.currentOption
        //把预览的option分别给四个修改用的option
        this.colorOption = previewOption
        this.textOption = previewOption
        this.drawMychart(previewOption)
      } else {
        this.$message.error('失败')
      }
    },
    //保存所有设置数据
    showConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.flag === 0) {
            return this.$message.error('请先预览!')
          }
          const _this = this
          console.log('Received values of form: ', values)
          console.log(this.textShow)
          let parmes = {}
          //如果是文本组件，单独处理
          if (this.textShow) {
            parmes = {
              conponentName: values.conponentName,
              chartId: values.chartOption
              // text: values.text,
            }
          }
          if (!this.textShow) {
            //如果是文本组件，这里就不执行
            let dimensionXId = values.xDimension.split(',')[1]
            let dimensionYId =
              values && values.yDimension && values.yDimension.split(',')[1]
            if (this.isConditionShowY) {
              //判断x纬度和y纬度是否同一个数据集
              if (dimensionXId !== dimensionYId) {
                return this.$message.error('请选择同一数据集下纬度!')
              }
              parmes = {
                componentName: values.componentName,
                chartId: values.chartOption,
                // chartName:,
                dimensions: JSON.stringify([
                  {
                    id: values.xDimension.split(',')[0], //纬度id，拼接数组第一个
                    dimensionXY: 'x',
                    // dimensionName: ,这个去掉
                    dimensionTypeId: dimensionXId, //纬度类型id,数据集id,拼接数组第二个
                    vectorList: values.xVector //向量ID
                  },
                  {
                    id: values.yDimension.split(',')[0], //纬度id
                    dimensionXY: 'y',
                    // dimensionName: ,这个去掉
                    dimensionTypeId: dimensionYId, //纬度类型id
                    vectorList: values.yVector //向量ID
                  }
                ]),
                statisItem: values.statisItem,
                // text: values.text,
                chartOption: JSON.stringify(this.currentOption)
              }
            } else {
              parmes = {
                componentName: values.componentName,
                chartId: values.chartOption,
                // chartName:,
                dimensions: JSON.stringify([
                  {
                    id: values.xDimension.split(',')[0], //纬度id
                    dimensionXY: 'x',
                    // dimensionName: 这个去掉
                    dimensionTypeId: dimensionXId, //纬度类型id
                    vectorList: values.xVector //向量ID
                  }
                ]),
                statisItem: values.statisItem,
                // text: values.text,
                chartOption: JSON.stringify(this.currentOption)
              }
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
      //如果是文本组件
      if (this.textShow === true) {
        document.getElementById('mychart').innerHTML = ''
      }
      // console.log('看看post保存时类型===',typeof values.)
      const { data: res } = await this.$http.request({
        url: '/saveChart',
        method: 'post',
        params: values,
        //负责 `params` 序列化的函数
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
      })
      if (res.meta.status === 200) {
        this.$message.success('保存数据成功')
      } else {
        this.$message.error('保存数据失败')
      }
    },
    //修改保存
    showConfirmEdit(listId) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.flag === 0) {
            return this.$message.error('请先预览!')
          }
          const _this = this
          console.log('Received values of form: ', values)
          console.log(this.textShow)
          let parmes = {}
          //如果是文本组件，单独处理
          if (this.textShow) {
            parmes = {
              conponentName: values.conponentName,
              chartId: values.chartOption
              // text: values.text,
            }
          }
          if (!this.textShow) {
            //如果是文本组件，这里就不执行
            let dimensionXId = values.xDimension.split(',')[1]
            let dimensionYId =
              values && values.yDimension && values.yDimension.split(',')[1]
            if (this.isConditionShowY) {
              //判断x纬度和y纬度是否同一个数据集
              if (dimensionXId !== dimensionYId) {
                return this.$message.error('请选择同一数据集下纬度!')
              }
              parmes = {
                id: listId,
                componentName: values.componentName,
                chartId: values.chartOption,
                // chartName:,
                dimensions: JSON.stringify([
                  {
                    id: values.xDimension.split(',')[0], //纬度id，拼接数组第一个
                    dimensionXY: 'x',
                    // dimensionName: ,这个去掉
                    dimensionTypeId: dimensionXId, //纬度类型id,数据集id,拼接数组第二个
                    vectorList: values.xVector //向量ID
                  },
                  {
                    id: values.yDimension.split(',')[0], //纬度id
                    dimensionXY: 'y',
                    // dimensionName: ,这个去掉
                    dimensionTypeId: dimensionYId, //纬度类型id
                    vectorList: values.yVector //向量ID
                  }
                ]),
                statisItem: values.statisItem,
                // text: values.text,
                chartOption: JSON.stringify(this.currentOption)
              }
            } else {
              parmes = {
                componentName: values.componentName,
                chartId: values.chartOption,
                // chartName:,
                dimensions: JSON.stringify([
                  {
                    id: values.xDimension.split(',')[0], //纬度id
                    dimensionXY: 'x',
                    // dimensionName: 这个去掉
                    dimensionTypeId: dimensionXId, //纬度类型id
                    vectorList: values.xVector //向量ID
                  }
                ]),
                statisItem: values.statisItem,
                // text: values.text,
                chartOption: JSON.stringify(this.currentOption)
              }
            }
          }
          this.$confirm({
            title: '保存数据源',
            content: <div style="color:green;">确定保存该设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
              _this.saveDataSourceEdit(parmes)
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      })
    },
    //保存图表组件修改
    async saveDataSourceEdit(values) {
      //如果是文本组件
      if (this.textShow === true) {
        document.getElementById('mychart').innerHTML = ''
      }
      const { data: res } = await this.$http.request({
        url: '/updateChart',
        method: 'post',
        params: values,
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
      })
      if (res.meta.status === 200) {
        this.$message.success('保存数据成功')
      } else {
        this.$message.error('保存数据失败')
      }
    },
  },
  computed: {
    currentDataSourceId() {
      let tempId = parseInt(this.dataSourceId)
      console.log('computed时的数据源ID：', tempId)
      return tempId
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
.null {
  height: 40px;
}
.line {
  background: #e2e3e6;
  height: 1px;
  width: 100%;
}
.saveButton {
  display: block;
  margin: 0 auto;
}
.Button2 {
  background: #ffffff;
  border: 1px solid #d1d3d8;
  color: gray;
}
.previewDiv {
  margin-top: 15px;
  width: 50%;
  height: 450px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  border-radius: 2px;
}
.baishanDiy {
  margin-top: 35px;
  width: 100%;
  height: 300px;
  background: #f7f8fa;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  border-radius: 2px;
}
.titleShowOn {
  margin-left: 34%;
  font-family: PingFangSC-Regular;
  font-size: 24px;
}
.inputTitle {
  display: block;
  width: 400px;
  margin: 0 auto;
}
</style>
