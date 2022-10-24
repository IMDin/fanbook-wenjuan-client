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
            @click="dd(scope)"
            style="margin: 0"
            v-if="scope.$index == 1"
          >
            非常不满意
          </p>
          <p
            style="margin: 0"
            v-if="scope.$index == tableData.length"
          >
            非常满意
          </p>
          <span>{{ scope.column.label }}</span>
        </template>
        <template slot-scope="scope">
          <!-- <i
            v-if="scope.column.label"
            @click="dd(scope)"
            class="el-icon-star-on iconStyle"
          /> -->
          <el-radio
            v-model="radio"
            :label="scope.row.colName + scope.column.label"
            v-if="scope.column.label"
          >
            {{ "" }}
          </el-radio>
          {{ scope.column.label ? "" : scope.row.colName }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "MatrixSelect",
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
      selectedData: {},
    };
  },
  methods: {
    dd(e) {
      console.log(e);
    },
    cellClick(row, column) {
      if (Object.keys(this.selectedData).length !== this.tableData.length) {
        this.tableData.forEach((item) => {
          this.selectedData[item.colName] = "";
        });
      }
      this.selectedData[row.colName] = column.label;
      console.log(1111, this.selectedData);
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
