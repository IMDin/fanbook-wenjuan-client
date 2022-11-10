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
            <div v-if="!multiple">
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
  props: {
    table: {
      type: Object,
      default: function () {
        return {
          rows: [
            {
              label: "矩阵行1",
              id: 1,
            },
            {
              label: "矩阵行2",
              id: 2,
            },
            {
              label: "矩阵行3",
              id: 3,
            },
          ],
          columns: [
            {
              label: "选项1",
              id: 1,
            },
            {
              label: "选项2",
              id: 2,
            },
            {
              label: "选项3",
              id: 3,
            },
          ],
        };
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      trData: [],
      tableData: [],
      selectedData: {},
      radioList: [""],
    };
  },
  watch: {
    table: {
      handler(newV) {
        //行处理
        this.trData = [
          {
            prop: "colName",
            label: "",
          },
        ];
        newV.columns.forEach((item) => {
          this.trData.push({
            prop: String(item.id),
            label: item.label || "选项" + newV.columns.length,
          });
        });
        //列处理
        this.tableData = [];
        newV.rows.forEach((item) => {
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
    cellClick(row, column, cell, event) {
      if (event.target.tagName == "INPUT") {
        if (this.multiple) {
          if (Object.keys(this.selectedData).length !== this.tableData.length) {
            this.tableData.forEach((item) => {
              this.selectedData[item.colName] = [];
            });
          }
          //数据传递使用值
          if (
            this.selectedData[row.colName].indexOf(Number(column.property)) < 0
          ) {
            this.selectedData[row.colName].push(Number(column.property));
          } else {
            this.selectedData[row.colName] = this.selectedData[
              row.colName
            ].filter((item) => {
              return item !== Number(column.property);
            });
          }
          this.selectedData[row.colName].sort();
          //数据传递使用label
          // if (this.selectedData[row.colName].indexOf(column.label) < 0) {
          //   this.selectedData[row.colName].push(column.label);
          // } else {
          //   this.selectedData[row.colName] = this.selectedData[
          //     row.colName
          //   ].filter((item) => {
          //     return item !== column.label;
          //   });
          // }
          // this.selectedData[row.colName].sort();
          //重构数据结构
          let data = {};
          this.table.rows.forEach((item, index) => {
            Object.keys(this.selectedData).forEach((selectItem) => {
              if (selectItem == item.label) {
                data[String(index + 1)] = this.selectedData[selectItem];
              }
            });
          });
          this.$emit("input", [{ ...this.selectedData }, data]);
        } else {
          if (Object.keys(this.selectedData).length !== this.tableData.length) {
            this.tableData.forEach((item) => {
              // this.selectedData[item.colName] = "";
              this.selectedData[item.colName] = [];
            });
          }
          this.selectedData[row.colName] = [Number(column.property)];
          // this.selectedData[row.colName] = [column.label];
          //重构数据结构
          let data = {};
          this.table.rows.forEach((item, index) => {
            Object.keys(this.selectedData).forEach((selectItem) => {
              if (selectItem == item.label) {
                data[String(index + 1)] = this.selectedData[selectItem];
              }
            });
          }),
            // let value = JSON.stringify(this.selectedData);
            console.log(2222, this.selectedData, data);
          this.$emit("input", [{ ...this.selectedData }, data]);
        }
      } else {
        return;
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
.matrixScale ::v-deep .el-radio {
  margin-right: 0;
}
</style>
