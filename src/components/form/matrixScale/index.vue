<template>
  <div class="matrixScale">
    <el-table
      :data="tableData"
      @cell-mouse-enter="hoverEnterClass"
      @cell-mouse-leave="hoverLeaveClass"
      style="width: 100%"
      @cell-click="cellClick"
      :cell-style="changeIconStyle"
    >
      <el-table-column
        v-for="(item, index) in trData"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <template
          slot="header"
          slot-scope="scope"
        >
          <p
            style="margin: 0"
            v-if="scope.$index == 1"
          >
            {{ maxTipData.min }}
          </p>
          <p
            style="margin: 0"
            v-if="scope.$index == level"
          >
            {{ maxTipData.max }}
          </p>
          <span>{{ scope.column.label }}</span>
        </template>
        <template slot-scope="scope">
          <i
            v-if="scope.column.label"
            class="iconStyle"
            :class="showIcon"
          />
          {{ scope.column.label ? "" : scope.row.colName }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "MatrixScale",
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
        };
      },
    },
    maxTip: {
      type: String,
      default: "satisfaction",
    },
    maxTipData: {
      type: Object,
      default: function () {
        return { min: "非常不满意", max: "非常满意" };
      },
    },
    showIcon: {
      type: String,
      default: "el-icon-star-off",
    },
    level: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      trData: [],
      tableData: [],
      class: {
        color: "",
      },
      currentRow: "",
      currentCol: "",
      selectedData: {},
    };
  },
  computed: {
    data() {
      let { table, maxTip, maxTipData, showIcon, level } = this;
      return { table, maxTip, maxTipData, showIcon, level };
    },
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
        for (let i = 1; i <= newV.level; i++) {
          this.trData.push({ prop: String(i), label: String(i) });
        }
        //列处理
        this.tableData = [];
        newV.table.rows.forEach((item) => {
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
          this.selectedData[item.colName] = 0;
        });
      }
      this.selectedData[row.colName] = Number(column.label);
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
      this.$emit("input", [{ ...this.selectedData }, data]);
    },
    hoverEnterClass(row, column) {
      this.currentRow = row.colName;
      this.currentCol = column.label;
    },
    hoverLeaveClass() {
      this.currentRow = "";
      this.currentCol = "";
      this.class.color = "";
    },
    changeIconStyle({ row, column }) {
      let iconClass = {};
      if (
        (column.label &&
          Number(column.label) < Number(this.currentCol) + 1 &&
          row.colName == this.currentRow) ||
        (column.label &&
          Number(column.label) < Number(this.selectedData[row.colName]) + 1 &&
          this.selectedData[row.colName])
      ) {
        this.class.color = "rgb(247, 186, 42)";
        iconClass = this.class;
      }
      return iconClass;
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
  /* color: red; */
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
