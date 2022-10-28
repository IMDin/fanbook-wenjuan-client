<template>
  <div class="statistics-tabs">
    <div class="statistics-tabs-centent">
      <el-tabs 
        v-model="activeName" 
        type="border-card"
      >
        <el-tab-pane 
          label="统计视图" 
          name="chart"
        >
          <chart />
        </el-tab-pane>
        <!-- <el-tab-pane label="数据分析" name="analysis">
          <analysis />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import chart from './chart'
export default {
    name: 'ProjectStatistics',
    components: {
        chart,
    },
    data() {
        return {
            activeName: 'chart',
            projectKey: '',
            tableData:[]
        }
    },
    mounted() {
      this.projectKey = this.$route.query?.key
    }, 
    methods: {
  
    }

}
</script>

<style lang="scss" scoped>
.statistics-tabs {
  padding: 20px;
  height: 100vh;
  .statistics-tabs-centent {
    width: 1200px;
    margin: 0 auto;
  }
}

::v-deep .el-tabs__content {
  padding: 0;
}
</style>
