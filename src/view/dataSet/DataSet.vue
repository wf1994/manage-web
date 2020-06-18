<template>
  <div>
    <a-table :columns="columns" :data-source="data">
      <span slot="dataType" slot-scope="dataType">
        {{ dataType % 2 === 0 ? '表' : 'SQL' }}
      </span>
      <span slot="createTime" slot-scope="createTime">
        {{ createTime | dateformat('YYYY-MM-DD') }}
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {
    title: '数据集名称',
    width: 100,
    dataIndex: 'dataSetName',
    key: 'dataSetName'
  },
  {
    title: '数据类型',
    width: 100,
    dataIndex: 'dataType',
    key: 'age',
    scopedSlots: { customRender: 'dataType' }
  },
  { title: '数据内容', dataIndex: 'dataContent', key: '1', width: 150 },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: '2',
    width: 150,
    scopedSlots: { customRender: 'createTime' }
  },
  { title: '操作', dataIndex: 'address', key: '3', width: 80 }
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    dataSetName: `数据集 ${i}`,
    dataType: `${i}`,
    dataContent: `London Park no. ${i}`,
    createTime: new Date().getTime()
  })
}

export default {
  data() {
    return {
      data,
      columns
    }
  }
}
</script>
<style lang="less" scoped></style>
