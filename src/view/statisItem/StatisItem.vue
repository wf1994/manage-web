<template>
  <div style="padding: 15px 40px">
    <a-row type="flex" justify="start" align="middle">
      <a-col :span="4">
        <i class="title-icon"></i>
        <span class="title-text">统计项</span>
      </a-col>
    </a-row>
    <a-row class="form-row">
      <a-col :span="15">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 10 }"
          labelAlign="left"
        >
          <h3 class="subTittle">编制数量</h3>
          <a-form-item :labelCol="{ span: 8 }" label="编制数量名称">
            <a-input
              v-decorator="[
                'standardNum',
                {
                  rules: [
                    {
                      required: true,
                      message: '名称不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入编制数量名称..."
            />
          </a-form-item>
          <p class="tips">编制数量为单位下岗位编制员额相加得出</p>
          <h3 class="subTittle">现有数量</h3>
          <a-form-item :labelCol="{ span: 8 }" label="现有数量名称">
            <a-input
              v-decorator="[
                'exisitNum',
                {
                  rules: [
                    {
                      required: true,
                      message: '名称不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入现有数量名称..."
            />
          </a-form-item>
          <p class="tips">现有数量为当前维度数量相加得出</p>
          <!--          <a-form-item label="用户名">-->
          <!--            <a-input-->
          <!--                    v-decorator="[-->
          <!--                'username',-->
          <!--                {-->
          <!--                  rules: [-->
          <!--                    {-->
          <!--                      required: true,-->
          <!--                      message: '用户名不能为空！'-->
          <!--                    }-->
          <!--                  ]-->
          <!--                }-->
          <!--              ]"-->
          <!--                    placeholder="请输入用户名..."-->
          <!--            />-->
          <!--          </a-form-item>-->
          <!--          <a-form-item label="密码">-->
          <!--            <a-input-->
          <!--                    v-decorator="[-->
          <!--                'password',-->
          <!--                {-->
          <!--                  rules: [-->
          <!--                    {-->
          <!--                      required: true,-->
          <!--                      message: '密码不能为空！'-->
          <!--                    }-->
          <!--                  ]-->
          <!--                }-->
          <!--              ]"-->
          <!--                    type="password"-->
          <!--                    placeholder="请输入密码..."-->
          <!--            />-->
          <!--          </a-form-item>-->
          <!--          <a-form-item label="数据库类型">-->
          <!--            <a-select-->
          <!--                    v-decorator="[-->
          <!--                'databasetype',-->
          <!--                {-->
          <!--                  rules: [{ required: true, message: '数据库类型不能为空！' }]-->
          <!--                }-->
          <!--              ]"-->
          <!--                    placeholder="请选择数据库类型..."-->
          <!--            >-->
          <!--              <a-select-option value="kingbase">-->
          <!--                金仓数据库-->
          <!--              </a-select-option>-->
          <!--            </a-select>-->
          <!--          </a-form-item>-->
          <!--          <a-form-item label="数据库名称">-->
          <!--            <a-input-->
          <!--                    v-decorator="[-->
          <!--                'databasename',-->
          <!--                {-->
          <!--                  rules: [-->
          <!--                    {-->
          <!--                      required: true,-->
          <!--                      message: '数据库名不能为空！'-->
          <!--                    }-->
          <!--                  ]-->
          <!--                }-->
          <!--              ]"-->
          <!--                    placeholder="请输入数据库名..."-->
          <!--            />-->
          <!--          </a-form-item>-->
        </a-form>
        <a-button class="saveButton" type="primary" @click="showConfirm"
          >保存</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>
<script type="text/jsx">
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'StatisItemForm' })
  },
  methods: {
    showConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this);
          const _this = this
          console.log('Received values of form: ', values);
          this.$confirm({
            title: '保存统计项',
            content: <div style="color:green;">确定保存该统计项设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk () {
            _this.saveStatisItem(values)
            },
            onCancel() {
            console.log('Cancel')
            }
          })
        }
      });
    },
    async saveStatisItem(values){
      console.log('+++++++++++++++++')
      const { data: res } = await this.$http.request({
        url:'/saveStatisSet',
        method:'post',
        params:values
      })
      if(res.meta.status === 200){
        this.$message.success('保存数据源成功')
      }
      else {
        this.$message.error('保存数据源失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
.form-row {
  margin-top: 15px;
}
.saveButton {
  display: block;
  margin: 0 auto;
}
.tips {
  color: #7c8191;
  background-color: #f6f7f9;
  padding: 5px 15px;
  margin-bottom: 60px;
}
.subTittle {
  color: #606a95;
  margin: 20px 0px;
  font-weight: bolder;
}
</style>
