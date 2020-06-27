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
              :value="value"
              :change="drawMychart()"
            >
              <el-option
                v-for="item in chartOptionData"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </a-select>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <a-form-item label="X轴纬度">
            <a-select
              v-decorator="[
                'chartOption',
                {
                  rules: [{ required: true, message: '纬度不能为空！' }]
                }
              ]"
              placeholder="请选择纬度"
              :value="value"
            >
              <el-option
                v-for="item in chartOptionData"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </a-select>
          </a-form-item>
          <a-form-item label="xxx向量">
            <a-checkbox-group @change="onChange">
              <a-row>
                <a-col :span="8">
                  <a-checkbox value="A">A</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="B">B</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="C">C</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="D">D</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="E">E</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <a-form-item label="Y轴纬度">
            <a-select
              v-decorator="[
                'chartOption',
                {
                  rules: [{ required: true, message: '纬度不能为空！' }]
                }
              ]"
              placeholder="请选择纬度"
              :value="value"
            >
              <el-option
                v-for="item in chartOptionData"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </a-select>
          </a-form-item>
          <a-form-item label="xxx向量">
            <a-checkbox-group @change="onChange">
              <a-row>
                <a-col :span="8">
                  <a-checkbox value="A">A</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="B">B</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="C">C</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="D">D</a-checkbox>
                </a-col>
                <a-col :span="8">
                  <a-checkbox value="E">E</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
          <div class="line"></div>
          <!-- 分隔线 -->
          <a-form-item label="统计项">
            <a-select
              v-decorator="[
                'chartOption',
                {
                  rules: [{ required: true, message: '统计项不能为空！' }]
                }
              ]"
              placeholder="请选择统计项"
              :value="value"
            >
              <el-option
                v-for="item in chartOptionData"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-button
          class="saveButton"
          type="primary"
          @click="showConfirm"
          >
          确定
        </a-button>
        <a-button
          class="Button2"
          type="primary"
          @click="showConfirm"
          >
          取消
        </a-button>
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
      <div class="">样式设置</div>
    </div>
  </div>
</template>
<script>
const plainOptions = ['Apple', 'Pear', 'Orange']
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' }
]
export default {
  data() {
    return {
      plainOptions,
      options,
      chartOptionData: [] //基础图表下拉框列表
    }
  },
  created() {
    this.getChartOptionData()
  },
  mounted() {
    //   this.drawMychart()
  },
  methods: {
    // 获取基础图表下拉框列表,第一次选择下拉框的图后，先生成一次预览图
    async getChartOptionData() {
      const res = await this.$http.request({
        methods: 'get',
        url: 'getChartSelectList'
      })
      if (res.status === 200) {
        this.chartOptionData = res.data.map(item => {
          return {
            value: item.chartId,
            label: item.chartName
          }
        })
      } else {
        //失败返回啥
      }
    },
    //画图
    drawMychart() {
      //初始化echarts实例
      // myChart = this.$echarts.init(document.getElementById('mychart'))
      //获取下拉框的option
      //myChart.setOption(option)
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
.saveButton{
  margin: 0 auto;
}
.Button2 {
    background: #FFFFFF;
    border: 1px solid #D1D3D8;
    color: gray;
}
</style>