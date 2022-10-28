<template>
  <div class="form-index-container">
    <el-card class="header-container">
      <el-row
        align="middle"
        type="flex"
        :gutter="5"
      >
        <i
          class="el-icon-back"
          @click="$router.back(-1)"
        />
        <!-- <img
          class="header-logo"
          src="@/assets/images/blue.png"
          @click="$router.push({path:'/home'})"
        > -->
        <div class="textTip">
          <span>{{ projectTitle }}</span>
          <br>
          <span>已保存至草稿</span>
        </div>
        <!-- <el-col /> -->
        <el-col class="showGuide">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              :class="currentTab == 'editor' ? 'activeClass' : 'normalClass'"
              :to="{ path: '/project/form/editor', query: { key: this.projectKey } }"
              @click.native="editorBreadClick"
            >
              编辑问卷
            </el-breadcrumb-item>
            <el-breadcrumb-item
              :class="currentTab == 'publish' ? 'activeClass' : 'normalClass'"
              @click.native="publishBreadClick"
            >
              发布问卷
            </el-breadcrumb-item>
            <el-breadcrumb-item
              :class="
                currentTab == 'statistics' ? 'activeClass' : 'normalClass'
              "
              :to="{ path: '/project/form/statistics', query: { key: this.projectKey } }"
              @click.native="statisticsBreadClick"
            >
              数据统计
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-button
          icon="el-icon-view"
          @click="previewDialogVisible = true"
          style="border: none"
        >
          预览
        </el-button>
        <el-button
          type="primary"
          @click="publishProject"
        >
          发布问卷
        </el-button>
        <!-- <el-button
          type="success"
          icon="el-icon-folder-add"
          @click="saveProjectAsTemplateHandle"
        >
          保存为模板
        </el-button> -->
      </el-row>
    </el-card>
    <div class="main-container">
      <div
        class="left-menu-container"
      >
        <el-menu
          :collapse="isCollapse"
          :default-active="defaultActiveMenu"
          class="el-menu-vertical"
          @select="menuSelectHandle"
        >
          <el-menu-item
            v-for="menuItem in menuItemLists"
            :key="menuItem.route"
            :index="menuItem.route"
          >
            <i :class="menuItem.icon" />
            <span slot="title">{{ menuItem.title }}</span>
          </el-menu-item>
        </el-menu>
        <!-- <i
          v-if="!isCollapse"
          class="el-icon-d-arrow-left"
          @click="collapseHandle"
        />
        <i
          v-else
          class="el-icon-d-arrow-right"
          @click="collapseHandle"
        /> -->
      </div>
      <div class="right-content-container">
        <router-view @getProjectTitle="changeTitle" />
      </div>
    </div>
    <el-dialog
      :visible.sync="previewDialogVisible"
      destroy-on-close
      fullscreen
    >
      <pre-view
        :key="previewKey"
        :preview-qrcode="true"
      />
    </el-dialog>
  </div>
</template>

<script>
import PreView from "@/views/form/preview";
// import store from "@/store";
import { reqPublishProject } from "@/api/myProject"

export default {
  name: "NewIndex",
  components: { PreView },
  data() {
    return {
      previewKey: +new Date(),
      previewDialogVisible: false,
      defaultActiveMenu: "editor",
      projectKey: null,
      isCollapse: false,
      menuItemLists: [],
      menuItemList: [
        {
          title: "题目",
          icon: "el-icon-edit",
          route: "/project/form/editor",
        },
        {
          title: "逻辑",
          icon: "el-icon-menu",
          route: "/project/form/logic",
        },
        {
          title: "外观",
          icon: "el-icon-view",
          route: "/project/form/theme",
        },
        {
          title: "设置",
          icon: "el-icon-setting",
          route: "/project/form/setting",
        },
        // {
        //   title: "发布",
        //   icon: "el-icon-video-play",
        //   route: "/project/form/publish",
        // },
        // {
        //     title: '统计',
        //     icon: 'el-icon-data-line',
        //     route: '/project/form/statistics'
        // }
      ],
      publishMenuItemList: [
         {
          title: "链接",
          icon: "el-icon-edit",
          route: "/project/form/publish",
        },
        {
          title: "推送",
          icon: "el-icon-edit",
          route: "/project/form/pushChannelPage",
        },
      ],
      statisticsMenuItemList: [
        {
          title: "数据",
          icon: "el-icon-edit",
          route: "/project/form/statistics",
        },
        {
          title: "统计",
          icon: "el-icon-edit",
          route: "/project/form/mianStatistics",
        },
      ],
      //新增问卷名称字段
      projectTitle: "问卷名称",
      //当前页面
      currentTab: "editor",
      isPublish: 0
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.path = route.path
        console.log(route.path, 'route.path');
        if (route.path == '/project/form/publish' || route.path ==  '/project/form/pushChannelPage' ) {
          this.menuItemLists = this.publishMenuItemList
          this.currentTab = 'publish'
          this.defaultActiveMenu = route.path
        }else if( route.path  == '/project/form/statistics' || route.path == '/project/form/mianStatistics') {
          this.menuItemLists = this.statisticsMenuItemList
          this.currentTab = 'statistics'
          this.defaultActiveMenu = route.path
        }else{
          this.menuItemLists = this.menuItemList
          this.currentTab = 'editor'
          this.defaultActiveMenu = route.path
        }
      },
      immediate: true
    }
  },
  created() {
    this.isPublish = this.$route.query.status
    this.projectKey = this.$route.query.key;
    this.defaultActiveMenu = this.$route.path;
    this.isCollapse = this.$store.state.form.isCollapse;
  },
  methods: {
    menuSelectHandle(index) {
      this.$router.replace({ path: index, query: { key: this.projectKey } });
    },
    openPreviewHandle() {
      this.previewKey = +new Date();
      this.previewDialogVisible = true;
    },
    saveProjectAsTemplateHandle() {
      this.$api
        .post("/user/project/template/save", {
          key: this.projectKey,
          fbUser: localStorage.getItem("user_id"),
        })
        .then(() => {
          this.msgSuccess("保存成功");
        });
    },
    collapseHandle() {
      let isCollapse = !this.isCollapse;
      this.$store.dispatch("form/setIsCollapse", isCollapse).then(() => {
        this.isCollapse = isCollapse;
      });
    },

    //新增发布问卷按钮
    publishProject() {
      if( this.isPublish == 2 ) {
        this.msgInfo('该问卷已发布')
        // this.$router.push({ path: "/project/form/publish", query: { key: this.projectKey } });
        return;
      }
      console.log("点击发布按钮");
      this.$confirm("请确认是否发布问卷?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          reqPublishProject({key: this.projectKey}).then(res => {
            console.log(res);
            this.msgSuccess('发布成功')
            this.$router.push({ path: "/project/form/publish", query: { key: this.projectKey } });
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    //更改问卷名称
    changeTitle(val) {
      console.log(val);
      if (val && val !== "问卷标题") {
        this.projectTitle = val;
      } else {
        this.projectTitle = "问卷名称";
      }
    },

    //控制tab页签
    editorBreadClick() {
      console.log(111, this.$route.name);
      if (this.$route.name == "editor") {
        this.currentTab = "editor";
      }
    },
    publishBreadClick() {
      if (this.$route.name == "publish") {
        this.currentTab = "publish";
      }
      this.publishProject()
      // this.$router.push({ path: '/project/form/publish', query: { key: this.projectKey } })
    },
    statisticsBreadClick() {
      if (this.$route.name == "statistics") {
        this.currentTab = "statistics";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-index-container {
  height: 100%;
  width: 100%;
}

::v-deep .el-card__body {
  padding: 0;
}

::v-deep .el-menu {
  border: none;
  background-color: transparent;
}

.header-container {
  width: 100%;
  height: 50px;
  padding: 0 30px;

  .el-icon-back {
    font-size: 22px;
    font-weight: 550;
    cursor: pointer;
    color: #000;
    margin-right: 25px;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }

  .header-logo {
    height: 45px;
    // width: 200px;
    padding: 5px;
  }
  .textTip2 {
    font-size: 18px;
  }
  .textTip {
    flex: none;
    :nth-last-child(1) {
      font-size: 12px;
      color: rgb(117, 117, 117);
    }
  }

  .showGuide {
    display: flex;
    justify-content: center;
  }

  .activeClass {
    ::v-deep .el-breadcrumb__inner {
      border-bottom: 2px solid rgb(77, 166, 255);
      padding-bottom: 15px;
    }
    font-size: 16px;
  }
  .normalClass {
    font-size: 16px;
  }
}

.main-container {
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: row;

  .right-content-container {
    width: calc(100vw - 100px);
    height: calc(100vh - 60px);
    overflow-x: hidden;

    background-color: rgb(242, 242, 242);
  }
}

.left-menu-container {
  max-width: 100px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: solid 1px #e6e6e6;

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 100px;
    min-height: 400px;
  }

  .el-icon-d-arrow-left,
  .el-icon-d-arrow-right {
    font-size: 19px;
    cursor: pointer;
    font-weight: 550;
    color: #000;
    margin-bottom: 100px;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}

::v-deep.preview-container {
  background-color: #ffffff;
}
::v-deep .el-breadcrumb__inner {
  color: rgb(58, 58, 58);
}
::v-deep .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: rgb(58, 58, 58);
  cursor: pointer;
  font-weight: 700;
}
::v-deep .el-breadcrumb__item:last-child :hover {
  color: rgb(64, 158, 255);
}
::v-deep .el-menu-item {
  display: inline-grid;
  height: 80px;
  i {
    margin: 15px 0 0 2px;
  }
  span {
    margin-top: -10px;
  }
}
</style>
