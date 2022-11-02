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
        {{ index + 1 }}. {{ item.titleName }}【{{ item.type }}】
      </p>
      <!-- :summary-method="getSummaries"  -->
      <div v-if="item.type == 'MATRIX_SCALE' || item.type == 'MATRIX_SELECT' ">
        <div
          v-for="(innerItem, index) in item.table"
          :key="index"
        >
          <p>{{ innerItem.titie }}</p>
          <el-table
            border
            :data="innerItem.options"
            style="width: 100%"
          >
            <el-table-column
              prop="key"
              label="选项"
              width="500px"
            />
            <el-table-column
              prop="value"
              label="小记"
            />
            <el-table-column
              prop="percent"
              label="比例"
            />
            <el-row 
              slot="append"
              type="flex"
              class="table-append-flex"
            >
              <el-col>本题有效填写人数</el-col>
              <el-col>{{ innerItem.num }}</el-col> 
            </el-row>
          </el-table>
        </div>
      </div>
      <el-table
        border
        v-if="item.options"
        :data="item.options"
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="选项"
          width="500px"
        />
        <el-table-column
          prop="value"
          label="小记"
        />
        <el-table-column
          prop="percent"
          label="比例"
        />
        <el-row 
          slot="append"
          type="flex"
          class="table-append-flex"
        >
          <el-col>本题有效填写人数</el-col>
          <el-col>{{ item.num }}</el-col> 
        </el-row>
      </el-table>
      <el-row
        type="flex"
        class="sum-box"
        v-if="!item.table && !item.options"
      >
        <el-col :span="12">
          本题有效填写人数
        </el-col>
        <el-col :span="12">
          {{ item.num || 0 }}
        </el-col>
      </el-row>
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
  .sum-box {
    background-color: #F5F7FA;
    color: #606266;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
  }
  .table-append-flex {
    height: 40px;
    background-color: #F5F7FA;
    div {
      line-height: 40px;
      font-size: 16px;  
      padding: 0 5px;
    }
  }
}
</style>