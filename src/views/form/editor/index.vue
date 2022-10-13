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
              <svg-icon name="component" />
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
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="center-board">
      <el-scrollbar class="center-scrollbar">
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
                  v-model="formConf.description"
                  placeholder="请输入问卷描述"
                  @blur="editDescription = false"
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
                  <svg-icon name="component" />
                  <span>点击左侧题型</span>
                  <span>&nbsp;或&nbsp;</span>
                  <svg-icon name="component" />
                  <span>拖拽题型到这里</span>
                </div>
              </div>
              <div class="publishResult">
                <!-- <button>设置提交结果页</button> -->
                <span @click="setCommit">设置提交结果页</span>
                <svg-icon name="component" />
              </div>
            </draggable>
          </el-form>
        </el-row>
      </el-scrollbar>
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
      title="提交设置"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <div class="commitOption">
        <div class="dialogShowTip">
          <span>显示提示图片</span>
          <el-switch
            v-model="showTipPhoto"
            active-color="rgb(2, 129, 255)"
            inactive-color="#7b7b7b"
          />
        </div>
        <div v-show="showTipPhoto">
          <div v-if="uploadPhoto">
            <img
              src="../../../assets/images/blue.png"
              class="showTipPhoto"
            >
            <el-button
              @click="clickUploadPhoto"
              type="text"
              style="margin-left: 40%; font-size: 16px"
            >
              请上传显示图片
            </el-button>
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
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
            <el-button
              @click="cancelUploadPhoto"
              type="text"
              style="margin-left: 45%; font-size: 16px"
            >
              取消
            </el-button>
          </div>
        </div>
        <div class="dialogShowTip">
          <span>显示提示文字</span>
          <el-switch
            v-model="showTipText"
            active-color="rgb(2, 129, 255)"
            inactive-color="#7b7b7b"
          />
        </div>
        <el-input
          v-show="showTipText"
          placeholder="请输入显示提示文字"
          v-model="inputTipText"
          clearable
        />
        <div class="dialogShowTip">
          <span>跳转网页地址</span>
          <el-switch
            v-model="showTipUrl"
            active-color="rgb(2, 129, 255)"
            inactive-color="#7b7b7b"
          />
        </div>
        <el-input
          v-show="showTipUrl"
          placeholder="请输入跳转网页地址"
          v-model="inputTipUrl"
          clearable
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="commitSave"
        >保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { debounce } from "throttle-debounce";
import RightPanel from "./RightPanel";

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
  },
  data() {
    return {
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
      showTipPhoto: false,
      showTipText: false,
      showTipUrl: false,
      inputTipPhoto: "",
      inputTipText: "",
      inputTipUrl: "",
      uploadPhoto: true,
      imageUrl: "",
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
      this.formConf.title = res.data.name;
      this.formConf.description = res.data.describe;
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
    saveProjectInfo: debounce(430, true, function () {
      this.$api
        .post("/user/project/update", {
          key: this.projectKey,
          name: this.formConf.title,
          describe: this.formConf.description,
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
    queryProjectItems() {
      this.$api
        .get("/user/project/item/list", { params: { key: this.projectKey } })
        .then((res) => {
          this.drawingList = res.data.map((item) =>
            dbDataConvertForItemJson(item)
          );
          // 更新分页
          this.updatePaginationList();
        });
    },
    activeFormItem(currentItem) {
      this.activeData = currentItem;
      this.activeId = currentItem.__config__.formId;
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
      console.log(111);
      this.dialogVisible = true;
      this.showTipPhoto = false;
      this.showTipText = false;
      this.showTipUrl = false;
    },
    commitSave() {
      this.dialogVisible = false;
    },
    clickUploadPhoto() {
      this.uploadPhoto = false;
    },
    cancelUploadPhoto() {
      this.uploadPhoto = true;
    },
    //上传组件方法
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
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

    background-color: rgb(242, 242, 242);
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
.publishResult {
  color: #7b7b7b;
  border: 1px solid #fff;
  background-color: #fff;
  margin: 30px 10px 0;
  padding: 20px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
}
::v-deep .el-dialog__header {
  text-align: left;
  font-weight: bold;
}
.commitOption {
  padding: 0 30px;
  font-size: 16px;
  input {
    width: 100%;
    opacity: 0.3;
  }
}
.dialogShowTip {
  margin: 10px;
  display: flex;
  justify-content: space-between;
}
.showTipPhoto {
  width: 100%;
}
//上传组件样式
.avatar-uploader {
  text-align: center;
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
