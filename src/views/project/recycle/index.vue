<template>
  <div class="content">
    <el-row 
      type="flex" 
      ustify="space-between"
    >
      <el-col 
        :span="12" 
        class="col12"
      >
        <p>回收站</p>
      </el-col>
      <el-col 
        :span="12" 
        class="col12"
      >
        <div class="demo-input-suffix">
          <el-button>清空回收站</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      class="my-table"
    >
      <el-table-column
        prop="describe"
        label="标题"
        width="400"
        show-overflow-tooltip
      />
      <el-table-column 
        prop="mun" 
        label="答卷数量" 
      />
      <el-table-column 
        prop="createTime" 
        label="创建时间" 
      />
      <el-table-column 
        prop="updateTime" 
        label="更新时间"
      >
        <template slot-scope="{ row }">
          <span v-time="row.updateTime" />
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        width="180"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            class="btn-befo"
            @click="restoreProject(row.key, 'editor')"
          >
            恢复
          </el-button>
          <el-button 
            type="text" 
            class="btn-befo" 
            @click="deleteProject(row.key)"
          >
            彻底删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="project-page-view">
      <el-pagination
        v-if="total > 10"
        :current-page.sync="queryParams.current"
        :page-size.sync="queryParams.size"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="getData"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      queryParams: {
        current: 1,
        size: 10,
        name: "",
        beginDateTime: null,
        endDateTime: null,
        status: null,
      },
      projectList: [],
      projectListLoading: true,
    };
  },
  mounted() {
    this.queryParams.fbUser = localStorage.getItem("user_id");
    this.queryRecycleProjectPage();
  },
  methods: {
    restoreProject(key) {
      this.$api
        .post("/user/project/recycle/restore", { key: key })
        .then((res) => {
          if (res.data) {
            this.msgSuccess("恢复成功");
            this.queryRecycleProjectPage();
          }
        });
    },
    deleteProject(key) {
      this.$api
        .post("/user/project/recycle/delete", { key: key })
        .then((res) => {
          if (res.data) {
            this.msgSuccess("刪除成功");
            this.queryRecycleProjectPage();
          }
        });
    },
    queryRecycleProjectPage() {
      this.$api
        .get("/user/project/recycle/page", {
          params: this.queryParams,
        })
        .then((res) => {
          let { records, total, size } = res.data;
          this.projectList = records;
          this.total = total;
          this.queryParams.size = size;
          this.projectListLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .col12 {
    display: flex;
    align-items: center;
    &:nth-child(2) {
      justify-content: flex-end;
    }
  }
  .my-table {
    .btn-befo {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 8px;
        right: -12px;
        width: 1px;
        height: 12px;
        background-color: #ccc;
      }
      & + .el-button {
        margin-left: 20px;
      }
    }
    .icon-left {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #67c23a;
    }
    .iconq {
      margin-left: 6px;
    }
    .icon-left.Warning {
      background-color: #e6a23c;
    }
    .icon-left.Info {
      background-color: #909399;
    }
  }
  .project-page-view {
    margin-top: 30px;
    text-align: center;
  }
}
</style>