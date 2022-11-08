<template>
  <div class="form-edit-container">
    <div class="left-board">
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div
            v-for="(item, listIndex) in leftComponents"
            :key="listIndex"
          >
            <div class="components-title">
              <!-- 大图标 -->
              <!-- <svg-icon name="component" /> -->
              {{ item.title }}
            </div>
            <draggable
              :clone="cloneComponent"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :list="item.list"
              :sort="false"
              class="components-draggable"
              draggable=".components-item"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <!-- 小图标tagIcon -->
                  <svg-icon :name="element.__config__.tagIcon" />
                  {{ element.__config__.labelDescription }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="center-board">
      <el-scrollbar 
        class="center-scrollbar scrollbars" 
      >
        <el-row
          v-if="formConf"
          :gutter="formConf.gutter"
          class="center-board-row"
        >
          <div class="headerTip">
            <el-row
              align="middle"
              justify="center"
              type="flex"
            >
              <el-col class="form-head-title">
                <h4
                  class="form-name-text"
                  contenteditable="true"
                  @blur="
                    (event) => {
                      this.formConf.title = event.target.innerText;
                      this.saveProjectInfo();
                      this.$emit('getProjectTitle', this.formConf.title);
                    }
                  "
                >
                  {{ formConf.title }}
                </h4>
              </el-col>
            </el-row>
            <el-row
              align="middle"
              justify="center"
              type="flex"
            >
              <el-col class="form-head-desc">
                <Tinymce
                  v-if="editDescription"
                  @blur="editDescription = false"
                  v-model="formConf.description"
                  placeholder="请输入问卷描述"
                  @input="saveProjectInfo"
                />
                <div
                  v-else
                  class="projectNameText"
                  @click="editDescription = true"
                  v-html="formConf.description"
                />
                <!--                            <p class="form-name-text" contenteditable="true"-->
                <!--                               @blur="(event)=>{-->
                <!--                                   formConf.description=event.target.innerText;-->
                <!--                                   this.saveProjectInfo()}">-->
                <!--                                {{ formConf.description }}-->
                <!--                            </p>-->
              </el-col>
            </el-row>
          </div>
          <!-- <el-divider class="form-head-divider" /> -->
          <el-form
            :disabled="formConf.disabled"
            :label-position="formConf.labelPosition"
            :label-width="formConf.labelWidth + 'px'"
            :size="formConf.size"
          >
            <draggable
              :animation="340"
              :list="drawingList"
              class="drawing-board"
              group="componentsGroup"
              @end="onItemEnd"
            >
              <draggable-item
                v-for="(item, index) in drawingList"
                :key="item.renderKey"
                :active-id="activeId"
                :current-item="item"
                :drawing-list="drawingList"
                :form-conf="formConf"
                :index="index"
                @activeItem="activeFormItem"
                @changeLabel="changeLabel"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
              <!-- 拖拽下方区域 -->
              <div
                class="contentTip"
                v-show="!drawingList.length"
              >
                <div class="empty-info">
                  <!-- <img
                style="width: 20%"
                src="@/assets/images/form-bg.png"
              > -->
                  <svg-icon
                    style="color: #409eff"
                    name="component"
                  />
                  <span>点击左侧题型</span>
                  <span>&nbsp;或&nbsp;</span>
                  <svg-icon
                    style="color: #409eff"
                    name="component"
                  />
                  <span>拖拽题型到这里</span>
                </div>
              </div>
              <!-- <div class="publishResult">
                  <span @click="setCommit">设置提交结果页</span>
                  <svg-icon name="component" />
                </div> -->
            </draggable>
          </el-form>
        </el-row>
      </el-scrollbar>
      <div style="padding: 10px">
        <div class="publishResult">
          <span @click="setCommit">设置提交结果页</span>
          <svg-icon name="component" />
        </div>
      </div>
    </div>
    <right-panel
      v-if="activeData"
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
      @data-change="updateProjectItemInfo"
    />
    <!-- 提交结果弹出框 -->
    <el-dialog
      title="设置提交结果页"
      :visible.sync="dialogVisible"
      width="35%"
      right
    >
      <div class="dialogContent">
        <!-- <div class="leftPart">
          <p>效果预览</p>
          <img
            src="../../../assets/images/blue.png"
            class="showTipPhoto"
          >
          <div class="previewText">
            <p>{{ dialogForm.mainText }}</p>
            <p>{{ dialogForm.description }}</p>
          </div>
        </div> -->
        <submitResultsPage :dialog-form="dialogForm" />
        <div class="commitOption">
          <el-form
            ref="dialogForm"
            :model="dialogForm"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="主文案">
              <el-input v-model="dialogForm.mainText" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="dialogForm.description" />
            </el-form-item>
          </el-form>
          <div class="dialogShowTip">
            <span>替换提示图片</span>
            <el-switch
              v-model="showTipPhoto"
              active-color="rgb(2, 129, 255)"
              inactive-color="#7b7b7b"
              @click="clickUploadPhoto"
            />
          </div>
          <div v-show="showTipPhoto">
            <div
              v-if="uploadPhoto"
              class="uploadPhotoClass"
            >
              <el-upload
                class="avatar-uploader"
                :action="`${url}user/file/upload`"
                :data="uploadData()"
                :headers="getHeaders()"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
              <i class="el-icon-warning-outline" />
              <span
                style="margin-left: 10px; color: #7b7b7b; font-size: 14px"
              >单张图片大小不超过2M</span>
            </div>
          </div>
          <div class="dialogShowTip">
            <span>跳转网址</span>
            <el-switch
              v-model="showTipUrl"
              active-color="rgb(2, 129, 255)"
              inactive-color="#7b7b7b"
            />
          </div>
          <el-input
            v-show="showTipUrl"
            placeholder="请输入跳转网址"
            v-model="dialogForm.links"
            clearable
          />
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          style="width: 80px"
        >取消</el-button>
        <el-button
          type="primary"
          @click="commitSave"
          style="width: 80px"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { debounce } from "throttle-debounce";
// import RightPanel from "./RightPanel";
import RightPanel from "./newRightPanel.vue";
import submitResultsPage from "./submitResultsPage.vue";
import images from "../../../assets/images/newBlue.png";
import {
  // imageComponents,
  // assistComponents,
  formConf,
  selectComponents,
  inputComponents,
  matrixComponents,
  personalInfoComponents,
  otherComponents,
} from "@/components/generator/config";
import { deepClone } from "@/utils";
import { dbDataConvertForItemJson, formItemConvertData } from "@/utils/convert";
import drawingDefalut from "@/components/generator/drawingDefalut";
import DraggableItem from "./DraggableItem";
import { saveDrawingList, saveIdGlobal } from "@/utils/db";

let oldActiveId;
let tempActiveData;
let idGlobal;

export default {
  components: {
    draggable,
    RightPanel,
    DraggableItem,
    submitResultsPage,
  },
  data() {
    return {
      url: process.env.VUE_APP_API_ROOT,
      idGlobal,
      formConf: null,
      editDescription: false, //控制问卷描述
      inputComponents,
      selectComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut.length != 0 ? drawingDefalut[0].formId : 0,
      formData: {},
      dialogVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: drawingDefalut ? drawingDefalut[0] : null,
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      projectKey: null,
      leftComponents: [
        // {
        //   title: "联系人组件",
        //   list: personalInfoComponents,
        // },
        // {
        //   title: "输入型组件",
        //   list: inputComponents,
        // },
        // {
        //   title: "图片型组件",
        //   list: imageComponents,
        // },
        // {
        //   title: "辅助型组件",
        //   list: assistComponents,
        // },
        // {
        //   title: "选择型组件",
        //   list: selectComponents,
        // },
        {
          title: "选择题",
          icon: "",
          list: selectComponents,
        },
        {
          title: "填空题",
          icon: "",
          list: inputComponents,
        },
        {
          title: "矩阵题",
          icon: "",
          list: matrixComponents,
        },
        {
          title: "个人信息",
          icon: "",
          list: personalInfoComponents,
        },
        {
          title: "其他题型",
          icon: "",
          list: otherComponents,
        },
      ],
      // 新增字段
      showTipPhoto: true,
      showTipUrl: true,
      inputTipPhoto: "",
      inputTipUrl: "",
      uploadPhoto: true,
      imageUrl: "",
      dialogForm: {
        projectShareImg: images,
        mainText: "太棒了！终于填完了",
        description: "感谢你的支持",
        links: "",
      },
    };
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    "activeData.__config__.label": function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder =
        this.activeData.placeholder.replace(oldVal, "") + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true,
    },
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val, this.projectKey);
        if (val.length === 0) this.idGlobal = 100;
      },
      deep: true,
    },
    idGlobal: {
      handler(val) {
        if (val) {
          this.saveIdGlobalDebounce(val, this.projectKey);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // 复制对象 避免修改改变原始对象
    this.formConf = JSON.parse(JSON.stringify(formConf));
    // 项目key
    this.projectKey = this.$route.query.key;
    // 从服务端获取
    this.queryProjectItems();
    // 获取表单配置
    this.$api.get(`/user/project/${this.projectKey}`).then((res) => {
      if (res.data) {
        this.formConf.title = res.data.name;
        this.dialogForm.projectShareImg = res.data.projectShareImg || images;
        this.dialogForm.mainText = res.data.mainText || "太棒了！终于填完了";
        this.dialogForm.description = res.data.description || "感谢你的支持";
        this.dialogForm.links = res.data.links || "";
      }
    });
    // 全局组件Id
    this.$api
      .get("/user/project/item/max-form-id", {
        params: { key: this.projectKey },
      })
      .then((res) => {
        this.idGlobal = res.data ? res.data : 100;
      });
  },
  methods: {
    getHeaders() {
      let fbtoken = localStorage.getItem("fbtoken");
      let token = localStorage.getItem("token");
      return {
        fbtoken,
        token,
      };
    },
    uploadData() {
      let fbuser = localStorage.getItem("user_id");
      return {
        fbuser: fbuser,
      };
    },
    saveProjectInfo: debounce(430, true, function () {
      this.$api
        .post("/user/project/update", {
          key: this.projectKey,
          name: this.formConf.title,
          describe: this.formConf.description,
          fbUser: localStorage.getItem("user_id"),
        })
        .then(() => {});
    }),
    updateProjectItemInfo(val) {
      let data = formItemConvertData(val, this.projectKey);
      this.$api.post("/user/project/item/update", data).then(() => {});
    },
    deleteProjectItemInfo(val) {
      let data = formItemConvertData(val, this.projectKey);
      this.$api.post("/user/project/item/delete", data).then(() => {});
    },
    async saveProjectItemInfo(item) {
      let isSuccess = false;
      let params = formItemConvertData(item, this.projectKey);
      let pItem = item;
      await this.$api.post("/user/project/item/create", params).then((res) => {
        pItem.sort = res.data.sort;
        isSuccess = true;
      });
      // 如果是分页组件 刷新所有分页的页码
      if (item.typeId === "PAGINATION") {
        this.updatePaginationList();
      }
      return isSuccess;
    },
    updatePaginationList() {
      // 页总数
      const length = this.drawingList.filter(
        (item) => item.typeId === "PAGINATION"
      ).length;
      let curr = 1;
      this.drawingList.forEach((item, index) => {
        if (item.typeId === "PAGINATION") {
          item.totalPageNum = length;
          item.currPageNum = curr++;
          this.$set(this.drawingList, index, item);
        }
      });
    },
    changeNumber(num) {
      if (num + 1 < 10) {
        return "0" + String(num + 1);
      } else {
        return num + 1;
      }
    },
    queryProjectItems() {
      this.$api
        .get("/user/project/item/list", { params: { key: this.projectKey } })
        .then((res) => {
          this.drawingList = res.data.map((item) =>
            dbDataConvertForItemJson(item)
          );
          let ind = 0
          this.drawingList.forEach((ele,index) => {
            ele.__config__.labelIndex =  this.changeNumber(index- ind)
            if(ele.typeId == "PAGINATION") {
              ind++
            }
          })
          console.log('drawingList',this.drawingList)
          // 更新分页
          this.updatePaginationList();
        });
    },
    activeFormItem(currentItem) {
      this.activeData = currentItem;
      this.activeId = currentItem.__config__.formId;
      console.log('rightPanel.activeData',this.activeData)
    },
    changeLabel(currentItem, value) {
      console.log(currentItem);
      console.log(value);
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
        this.saveProjectItemInfo(tempActiveData).then(() => {
          this.onItemEnd(obj);
        });
      }
    },
    onItemEnd(obj) {
      let params = { projectKey: this.projectKey };
      if (this.drawingList[obj.newIndex - 1]) {
        let sort1 = this.drawingList[obj.newIndex - 1].sort;
        params.beforePosition = sort1;
      }
      if (this.drawingList[obj.newIndex + 1]) {
        let sort2 = this.drawingList[obj.newIndex + 1].sort;
        params.afterPosition = sort2;
      }
      params.formItemId = this.drawingList[obj.newIndex].__config__.formId;
      if (params.beforePosition || params.afterPosition) {
        this.$api.post("/user/project/item/sort", params).then((res) => {
          this.drawingList[obj.newIndex].sort = res.data.sort;
        });
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item);
      this.saveProjectItemInfo(clone);
      this.drawingList.push(clone);
      this.activeFormItem(clone);
      this.scollToBottom()
    },
    scollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector(".scrollbars > .el-scrollbar__wrap")
        container.scrollTo({top: container.scrollHeight, behavior: 'smooth'})
      })
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);
      const config = clone.__config__;
      config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone);
      clone.placeholder !== undefined && (clone.placeholder += config.label);
      tempActiveData = clone;
      return tempActiveData;
    },
    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
      if (config.layout === "colFormItem") {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${this.idGlobal}`;
        !Array.isArray(config.children) && (config.children = []);
        delete config.label; // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) =>
          this.createIdAndKey(childItem)
        );
      }
      return item;
    },
    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = [];
          this.idGlobal = 100;
        }
      );
    },
    drawingItemCopy(item, list) {
      let clone = deepClone(item);
      clone = this.createIdAndKey(clone);
      list.push(clone);
      this.activeFormItem(clone);
      this.saveProjectItemInfo(clone);
    },
    drawingItemDelete(index, list) {
      let item = list[index];
      list.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
      this.deleteProjectItemInfo(item);
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag);
      const config = newTag.__config__;
      newTag.__vModel__ = this.activeData.__vModel__;
      newTag.sort = this.activeData.sort;
      config.formId = this.activeId;
      config.span = this.activeData.__config__.span;
      this.activeData.__config__.tag = config.tag;
      this.activeData.__config__.tagIcon = config.tagIcon;
      this.activeData.__config__.document = config.document;
      this.activeData.typeId = newTag.typeId;
      if (
        typeof this.activeData.__config__.defaultValue ===
        typeof config.defaultValue
      ) {
        config.defaultValue = this.activeData.__config__.defaultValue;
      }
      Object.keys(newTag).forEach((key) => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateProjectItemInfo(newTag);
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(
        (item) => item.__config__.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.__config__.children))
            this.updateDrawingList(newTag, item.__config__.children);
        });
      }
    },

    //新增方法
    setCommit() {
      this.dialogVisible = true;
    },
    commitSave() {
      this.dialogVisible = false;
      // 保存
      this.$api
        .post("/user/project/update", {
          key: this.projectKey,
          name: this.formConf.title,
          describe: this.formConf.description,
          fbUser: localStorage.getItem("user_id"),
          projectShareImg: this.dialogForm.projectShareImg,
          mainText: this.dialogForm.mainText,
          description: this.dialogForm.description,
          links: this.dialogForm.links,
        })
        .then(() => {});
    },
    clickUploadPhoto() {
      // this.uploadPhoto = false;
    },
    //上传组件方法
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.imageUrl = res.data;
        this.dialogForm.projectShareImg = res.data;
      } else {
        this.$message.error("上传图片错误");
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.includes("image");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("请上传图片");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/styles/form/home";
@import "@/assets/styles/form/index";
</style>
<style lang="scss" scoped>
.center-board {
  .center-board-row {
    margin-right: 10px;

    // background-color: rgb(242, 242, 242);
    background-color: #fff;
  }

  .form-head-title {
    padding: 10px 20px;
    text-align: center;

    .form-name-text:hover {
      border: 1px dashed #7b7b7b;
      min-height: 100px;
    }
  }

  .form-head-desc {
    padding: 10px 10px;
  }

  .form-head-divider {
    margin-right: 10px;
    margin-left: 10px;
    width: auto;
  }
}

.headerTip {
  background-color: #fff;
  margin: 10px;
  margin-bottom: 0;
}
.contentTip {
  color: #7b7b7b;
  padding: 10px;
  margin: 10px;
  margin-top: 0;
  background-color: #fff;
}
.projectNameText {
  padding: 10px 10px;
  border: 1px dashed transparent;
  line-height: 30px;
  margin: 0;
  font-size: 20px;
  text-align: center;
  :hover {
    border: 1px dashed;
    padding: 30px 10px;
  }
}
.topBar {
  height: 20px;
  background-color: #f2f2f2;
}
.bottomBar {
  height: 50px;
  background-color: #f2f2f2;
}
.publishResult {
  color: #7b7b7b;
  border: 1px solid #fff;
  background-color: #fff;
  margin: 0 52px;
  padding: 20px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  width: 91.5%;
}
::v-deep .el-dialog__header {
  text-align: left;
  font-weight: bold;
  padding-bottom: 0;
}
::v-deep .el-dialog__body {
  padding: 0 20px 20px;
}
.dialogContent {
  display: flex;
  color: #000;
}
.leftPart {
  width: 50%;
  border-right: 1px solid #f2f2f2;
  padding-right: 20px;
  .previewText {
    p:nth-child(1) {
      margin-bottom: 10px;
      text-align: center;
      font-size: 24px;
      color: #000;
    }
    p:nth-last-child(1) {
      margin-top: 0;
      text-align: center;
      color: #7b7b7b;
    }
  }
}
.commitOption {
  padding: 0 30px;
  font-size: 14px;
  input {
    width: 100%;
    opacity: 0.3;
  }
  ::v-deep .el-form-item__label {
    color: #000;
    font-weight: normal;
  }
}
.dialogShowTip {
  margin: 20px 0 20px;
  display: flex;
  justify-content: space-between;
}
.showTipPhoto {
  height: 50%;
  width: 100%;
  padding: 30px 0 0;
}
.uploadPhotoClass {
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f2f2;
}
//上传组件样式
.avatar-uploader {
  text-align: left;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid #d9d9d9;
  margin-bottom: 10px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
