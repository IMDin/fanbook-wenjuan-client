<template>
  <div class="rc-bin-container content">
    <el-row 
      type="flex" 
      justify="space-between"
      style="width:100%"
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
          <el-button @click="allDeleted">
            清空回收站
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-if="projectList && projectList.length > 0"
      :data="projectList"
      v-loading="loading"
      style="width: 100%;background-color:#fff"
      empty-text="暂无数据"
    >
      <el-table-column
        prop="name"
        show-overflow-tooltip
        align="center"
        label="标题"
      />
      <el-table-column 
        prop="resultCount" 
        align="center" 
        label="收集数" 
      />
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        align="center"
        prop="updateTime"
        label="删除时间"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="restoreProject(scope.row.key, 1, scope.row.name)"
          >
            恢复
          </el-button>
          <el-button
            type="text"
            @click="deleteProject(scope.row.key, scope.row.name)"
          >
            彻底删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="project-page-view">
      <el-pagination
        v-if="total > 10"
        background
        :page-size.sync="queryParams.size"
        :current-page.sync="queryParams.current"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="queryRecycleProjectPage"
      />
    </div>
    <data-empty v-if="!projectList || projectList.length == 0" />
  </div>
</template>
<script>
export default {
  name: "RecycleBin",
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
        fbUser: ''
      },
      loading: true,
      projectList: [],
      projectListLoading: true,
    };
  },
  computed: {},
  created() {
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
    deleteProject(key, name) {
       this.$confirm( `确定将《${name}》从回收站中彻底删除吗？删除后问卷将无法恢复` , '彻底删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.$api
          .post("/user/project/recycle/delete", { key: key, fbUser: this.queryParams.fbUser })
          .then((res) => {
            if (res.data) {
              this.msgSuccess("刪除成功");
              this.queryRecycleProjectPage();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    queryRecycleProjectPage() {
      this.loading = true
      this.$api
        .get("/user/project/recycle/page", {
          params: this.queryParams,
        })
        .then((res) => {
          this.loading = false
          let { records, total, size } = res.data;
          this.projectList = records;
          this.total = Number(total);
          this.queryParams.size = Number(size);
          this.projectListLoading = false;
        }).catch(err => {
          console.log(err);
          this.loading = false
        })
    },
    allDeleted() {
      if (this.projectList.length == 0) {
        this.msgInfo("回收站已清空");
        return
      }
      this.$confirm( `确定将从回收站中所有数据彻底删除吗？` , '清空回收站确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.$api
          .post("/user/project/recycle/clear", { fbUser: this.queryParams.fbUser, deleted: true})
          .then((res) => {
            if (res.data) {
              this.msgSuccess("清空成功");
              this.queryRecycleProjectPage();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.rc-bin-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  align-content: center;
}
.back-view {
  display: flex;
  width: 80%;
  align-content: flex-start;
  margin: 10px;
}
.project-page-view {
  margin-top: 30px;
}
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
</style>
