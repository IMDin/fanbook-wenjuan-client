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
                @change="radioClick"
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
              <el-checkbox
                v-if="
                  scope.column.label && scope.row.colName == tableItem.colName
                "
              >
                {{ "" }}
              </el-checkbox>
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
    radioClick() {
      console.log(999);
    },
    cellClick(row, column, cell, event) {
      if (event.target.tagName == "SPAN") return;
      if (this.data.multiple) {
        if (Object.keys(this.selectedData).length !== this.tableData.length) {
          this.tableData.forEach((item) => {
            this.selectedData[item.colName] = [];
          });
        }
        if (
          this.selectedData[row.colName].indexOf(Number(column.property)) < 0
        ) {
          this.selectedData[row.colName].push(Number(column.property));
        } else {
          // this.selectedData[row.colName] = this.selectedData[
          //   row.colName
          // ].filter((item) => {
          //   console.log('kkk',item,Number(column.property))
          //   return item !== Number(column.property);
          // });
          console.log("sss", this.selectedData[row.colName]);
          // let index = this.selectedData[row.colName].indexOf(
          //   Number(column.property)
          // );
          // this.selectedData[row.colName].splice(index, 1);
        }
        this.selectedData[row.colName].sort();
        //重构数据结构
        let data = {};
        this.data.__slot__.table.rows.forEach((item, index) => {
          Object.keys(this.selectedData).forEach((selectItem) => {
            if (selectItem == item.label) {
              data[String(index + 1)] = this.selectedData[selectItem];
            }
          });
        });
        console.log("dddd", this.selectedData,data);
      } else {
        if (Object.keys(this.selectedData).length !== this.tableData.length) {
          this.tableData.forEach((item) => {
            // this.selectedData[item.colName] = "";
            this.selectedData[item.colName] = [];
          });
        }
        this.selectedData[row.colName] = [Number(column.property)];
        //重构数据结构
        let data = {};
        this.data.__slot__.table.rows.forEach((item, index) => {
          Object.keys(this.selectedData).forEach((selectItem) => {
            if (selectItem == item.label) {
              data[String(index + 1)] = this.selectedData[selectItem];
            }
          });
        }),
          // let value = JSON.stringify(this.selectedData);
          console.log(2222, this.selectedData, data);
        this.update(this.selectedData);
      }
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
