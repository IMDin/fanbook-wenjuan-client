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
          <p @click="dd(scope)">
            操作
          </p>
          <span>{{ scope.column.label }}</span>
        </template>
        <template slot-scope="scope">
          <i
            v-if="scope.column.label"
            @click="dd(scope)"
            class="el-icon-star-off iconStyle"
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
  props: {},
  data() {
    return {
      trData: [
        {
          prop: "colName",
          label: "",
        },
        {
          prop: "date",
          label: "1",
        },
        {
          prop: "name",
          label: "2",
        },
        {
          prop: "address",
          label: "3",
        },
      ],
      tableData: [
        {
          colName: "矩阵行1",
          date: "",
          name: "",
          address: "",
        },
        {
          colName: "矩阵行2",
          date: "",
          name: "",
          address: "",
        },
        {
          colName: "矩阵行3",
          date: "",
          name: "",
          address: "",
        },
      ],
      class: {
        color: "",
      },
      currentRow: "",
      currentCol: "",
      selectedData: [],
    };
  },
  methods: {
    dd(e) {
      console.log(e);
    },
    cellClick(row, column, cell, event) {
      console.log(111, row, column, cell, event);
      this.tableData.forEach((item) => {
        this.selectedData.push({ row: item.colName, col: "" });
      });
      if (this.selectedData.indexOf(row.colName) < 0) {
        this.selectedRow.push(row.colName);
      }
      this.selectedCol = column.label;
      console.log(1111, this.selectedCol, this.selectedRow);
    },
    hoverEnterClass(row, column) {
      this.currentRow = row.colName;
      this.currentCol = column.label;
      // this.class.color = "rgb(247, 186, 42)";
      console.log(333, row, column);
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
          Number(column.label) < Number(this.selectedCol) + 1 &&
          row.colName == this.selectedRow[0])
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
}
</style>
