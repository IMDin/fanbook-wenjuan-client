<template>
  <div class="matrixScale">
    <el-table
      :data="tableData"
      style="width: 100%"
      @cell-click="cellClick"
    >
      <el-table-column
        v-for="(item, index) in trData"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <div
            v-for="(tableItem, i) in tableData"
            :key="i"
          >
            <div v-if="!data.multiple">
              <el-radio
                v-model="radioList[i]"
                :label="scope.column.label"
                v-if="
                  scope.column.label && scope.row.colName == tableItem.colName
                "
              >
                {{ "" }}
              </el-radio>
            </div>
            <div v-else>
              <el-checkbox-group v-model="tableItem.colName">
                <el-checkbox
                  v-if="
                    scope.column.label && scope.row.colName == tableItem.colName
                  "
                >
                  {{ "" }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          {{ scope.column.label ? "" : scope.row.colName }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "MatrixSelect",
  props: ["data", "update"],
  data() {
    return {
      trData: [],
      tableData: [],
      selectedData: {},
      radioList: [""],
    };
  },
  watch: {
    data: {
      handler(newV) {
        console.log("newV", newV);
        //行处理
        this.trData = [
          {
            prop: "colName",
            label: "",
          },
        ];
        newV.__slot__.table.columns.forEach((item) => {
          this.trData.push({
            prop: String(item.id),
            label: item.label,
          });
        });
        //列处理
        this.tableData = [];
        newV.__slot__.table.rows.forEach((item) => {
          this.tableData.push({
            colName: item.label,
          });
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    cellClick(row, column) {
      if (Object.keys(this.selectedData).length !== this.tableData.length) {
        this.tableData.forEach((item) => {
          this.selectedData[item.colName] = "";
        });
      }
      this.selectedData[row.colName] = column.label;
      let value = JSON.stringify(this.selectedData);
      console.log(1111, value, this.selectedData);
      this.update(value);
    },
  },
};
</script>
<style scoped>
.matrixScale {
  padding-bottom: 45px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  color: red;
}
.iconStyle {
  font-size: 18px;
}
::v-deep .el-table tbody tr:hover > td {
  background-color: unset !important;
}
::v-deep th {
  padding: 0;
}
::v-deep .cell {
  text-align: center;
}
</style>
