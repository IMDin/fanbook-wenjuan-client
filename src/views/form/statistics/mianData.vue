<template>
  <el-row class="main-data">
    <el-col class="main-data-top">
      <div>答题情况</div>
      <div>
        <el-button>
          下载答题数据
        </el-button>
      </div>
    </el-col>
    <el-col>
      <p>01. 这是第一题题目名称【单选题】</p>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="选项1"
          width="180"
        />
        <el-table-column
          prop="name"
          label="小记"
          width="180"
        />
        <el-table-column
          prop="address"
          label="比例"
        />
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "MainData",
  data(){
    return {
      tableData:[
        {
          date:'选项1',
          name: 1,
          address: '100%'
        },
        {
          date:'选项2',
          name: 1,
          address: '100%'
        },
        {
          date:'选项3',
          name: 1,
          address: '100%'
        }
      ]
    }
  },
  methods:{
    
  }
}
</script>

<style lang="scss" scoped>
.main-data {
  display: flex;
  flex-direction: column;
  padding: 15px;
  .main-data-top {
    display: flex;
    justify-content: space-between;
  }
}
</style>