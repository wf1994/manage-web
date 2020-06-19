<template>
  <div>
    <a-row type="flex" justify="start" align="middle">
      <a-col :span="4">
        <i class="title-icon"></i>
        <span class="title-text">数据源设置</span>
      </a-col>
    </a-row>
    <a-row class="form-row">
      <a-col :span="12">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          labelAlign="left"
        >
          <a-form-item label="IP">
            <a-input
              v-decorator="[
                'ip',
                {
                  rules: [
                    {
                      required: true,
                      message: 'IP不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入IP地址..."
            />
          </a-form-item>
          <a-form-item label="端口号">
            <a-input
              v-decorator="[
                'port',
                {
                  rules: [
                    {
                      required: true,
                      message: '端口号不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入端口号..."
            />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input
              v-decorator="[
                'username',
                {
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入用户名..."
            />
          </a-form-item>
          <a-form-item label="密码">
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '密码不能为空！'
                    }
                  ]
                }
              ]"
              type="password"
              placeholder="请输入密码..."
            />
          </a-form-item>
          <a-form-item label="数据库类型">
            <a-select
              v-decorator="[
                'databasetype',
                {
                  rules: [{ required: true, message: '数据库类型不能为空！' }]
                }
              ]"
              placeholder="请选择数据库类型..."
            >
              <a-select-option value="kingbase">
                金仓数据库
              </a-select-option>
              <a-select-option value="other">
                其他数据库
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="数据库名称">
            <a-input
              v-decorator="[
                'databasename',
                {
                  rules: [
                    {
                      required: true,
                      message: '数据库名不能为空！'
                    }
                  ]
                }
              ]"
              placeholder="请输入数据库名..."
            />
          </a-form-item>
        </a-form>
        <a-button type="primary" @click="showConfirm">保存</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dataSourceForm' })
  },
  methods: {
    showConfirm() {
      this.$confirm({
        title: '保存数据源',
        content: <div style="color:green;">确定保存该数据源设置吗？</div>,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        }
      })
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
</style>
