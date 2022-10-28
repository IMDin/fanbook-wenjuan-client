<template>
  <el-row class="main-data">
    <el-col class="main-data-top">
      <div>答题情况</div>
      <div>
        <el-button @click="projectExport">
          下载答题数据
        </el-button>
      </div>
    </el-col>
    <el-col 
      v-for="(item, index) in tableData" 
      :key="index"
    >
      <p>
        {{ index }}. {{ item.titleName }}【{{ item.type }}】
      </p>
      <!-- :summary-method="getSummaries"  -->
      <el-table
        border
        show-summary
        sum-text="本题有效填写人数"
        :data="item.options"
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="选项1"
          width="500px"
        />
        <el-table-column
          prop="value"
          label="小记"
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
  props:{
    tableData:{
      type: Array,
      default: () => []
    }
  },
  data(){
    return {

    }
  },
  mounted() {
    console.log(this.tableData, 'tableData');
  },
  methods:{
    projectExport() {
      this.$emit('projectExport')
    }
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