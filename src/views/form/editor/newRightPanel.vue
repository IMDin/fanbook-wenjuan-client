<template>
  <div class="right-board" v-show="showField">
    <div>
      <div class="panelTitle">题目设置</div>
      <el-divider class="titleLine" />
    </div>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!-- 组件区 -->
        <el-form label-width="125px" label-position="left" size="small">
          <p>整题设置</p>
          <!-- 公共选项 -->
          <div>
            <el-form-item label="标题">
              <el-input
                v-model="activeData.__config__.label"
                placeholder="请输入标题"
                @input="changeRenderKey"
              />
            </el-form-item>
            <el-form-item
              v-if="
                activeData.__config__.required !== undefined &&
                activeData.__config__.showRequired !== false
              "
              label="必填"
            >
              <el-switch v-model="activeData.__config__.required" />
            </el-form-item>
            <el-form-item label="题目说明">
              <el-switch v-model="activeData.__config__.titleTip" />
            </el-form-item>
          </div>
          <!-- 个性化配置 -->
          <p
            v-if="
              [
                'el-radio-group',
                'el-checkbox-group',
                'el-select',
                'image-select',
                'el-upload',
                'el-rate',
                'province-city',
              ].indexOf(activeData.__config__.tag) > -1
            "
          >
            选项设置
          </p>
          <p v-if="['el-input'].indexOf(activeData.__config__.tag) > -1">
            填写设置
          </p>
          <div>
            <!-- 单选题 -->
            <div v-if="activeData.__config__.tagIcon == 'radio'">
              <draggable
                :animation="340"
                :list="activeData.__slot__.options"
                group="selectItem"
                handle=".option-drag"
              >
                <div
                  v-for="(item, index) in activeData.__slot__.options"
                  :key="index"
                  class="select-item"
                >
                  <div class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input
                    v-model="item.label"
                    placeholder="选项名"
                    size="small"
                  />
                  <div
                    class="close-btn select-line-icon"
                    @click="activeData.__slot__.options.splice(index, 1)"
                  >
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 20px">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addSelectItem"
                >
                  添加选项
                </el-button>
                <el-button
                  v-if="
                    ['el-checkbox-group', 'el-radio-group'].indexOf(
                      activeData.__config__.tag
                    ) > -1
                  "
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addSelectOtherItem"
                >
                  添加其他
                </el-button>
              </div>
              <el-divider />
              <el-form-item label="选项随机排列">
                <el-switch v-model="activeData.__config__.selectRandom" @click="randomSelect" />
              </el-form-item>
              <el-form-item
                v-if="activeData.__config__.selectRandom === true"
                label="固定最后一个选项"
              >
                <el-switch v-model="activeData.__config__.fixLastSelect" @click="selectFix" />
              </el-form-item>
            </div>

            <!-- 多选题 -->
            <div v-if="activeData.__config__.tagIcon == 'checkbox'">
              <draggable
                :animation="340"
                :list="activeData.__slot__.options"
                group="selectItem"
                handle=".option-drag"
              >
                <div
                  v-for="(item, index) in activeData.__slot__.options"
                  :key="index"
                  class="select-item"
                >
                  <div class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input
                    v-model="item.label"
                    placeholder="选项名"
                    size="small"
                  />
                  <div
                    class="close-btn select-line-icon"
                    @click="activeData.__slot__.options.splice(index, 1)"
                  >
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 20px">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addSelectItem"
                >
                  添加选项
                </el-button>
                <el-button
                  v-if="
                    ['el-checkbox-group', 'el-radio-group'].indexOf(
                      activeData.__config__.tag
                    ) > -1
                  "
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addSelectOtherItem"
                >
                  添加其他
                </el-button>
              </div>
              <el-divider />
              <el-form-item label="最少要选">
                <el-select
                  v-model="activeData.__config__.selectRandom"
                  style="width: 130px"
                />
              </el-form-item>
              <el-form-item label="最多可选">
                <el-select
                  v-model="activeData.__config__.selectRandom"
                  style="width: 130px"
                />
              </el-form-item>
              <el-divider />
              <el-form-item label="选项随机排列">
                <el-switch v-model="activeData.__config__.selectRandom" />
              </el-form-item>
              <el-form-item
                v-if="activeData.__config__.selectRandom === true"
                label="固定最后一个选项"
              >
                <el-switch v-model="activeData.__config__.fixLastSelect" />
              </el-form-item>
            </div>

            <!-- 下拉题 -->
            <div v-if="activeData.__config__.tagIcon == 'select'">
              <draggable
                :animation="340"
                :list="activeData.__slot__.options"
                group="selectItem"
                handle=".option-drag"
              >
                <div
                  v-for="(item, index) in activeData.__slot__.options"
                  :key="index"
                  class="select-item"
                >
                  <div class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input
                    v-model="item.label"
                    placeholder="选项名"
                    size="small"
                  />
                  <div
                    class="close-btn select-line-icon"
                    @click="activeData.__slot__.options.splice(index, 1)"
                  >
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 20px">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addSelectItem"
                >
                  添加选项
                </el-button>
                <el-button
                  v-if="
                    ['el-checkbox-group', 'el-radio-group'].indexOf(
                      activeData.__config__.tag
                    ) > -1
                  "
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addSelectOtherItem"
                >
                  添加其他
                </el-button>
              </div>
              <el-divider />
              <el-form-item label="选择类型">
                <div class="selectType">
                  <div
                    @click="clickSingle('单选')"
                    :class="selectType == '单选' ? 'activeType' : 'normalType'"
                  >
                    单选
                  </div>
                  <div
                    @click="clickMore('多选')"
                    :class="selectType == '多选' ? 'activeType' : 'normalType'"
                  >
                    多选
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="最少要选">
                <el-select
                  v-model="activeData.__config__.selectRandom"
                  style="width: 130px"
                />
              </el-form-item>
              <el-form-item label="最多可选">
                <el-select
                  v-model="activeData.__config__.selectRandom"
                  style="width: 130px"
                />
              </el-form-item>
              <el-divider />
              <el-form-item label="选项随机排列">
                <el-switch v-model="activeData.__config__.selectRandom" />
              </el-form-item>
              <el-form-item
                v-if="activeData.__config__.selectRandom === true"
                label="固定最后一个选项"
              >
                <el-switch v-model="activeData.__config__.fixLastSelect" />
              </el-form-item>
            </div>

            <!-- 图片选择 -->
            <div v-if="activeData.__config__.tagIcon == 'image-select'">
              <draggable
                :animation="340"
                :list="activeData.options"
                group="selectItem"
                handle=".option-drag"
              >
                <div
                  v-for="(item, index) in activeData.options"
                  :key="index"
                  class="select-item"
                >
                  <div class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <div class="width-full">
                    <div class="flex-row">
                      <el-input
                        v-model="item.label"
                        placeholder="选项名"
                        size="small"
                      />
                      <div
                        class="close-btn select-line-icon"
                        @click="activeData.options.splice(index, 1)"
                      >
                        <i class="el-icon-remove-outline" />
                      </div>
                    </div>
                    <div class="flex-row">
                      <el-input
                        v-model="item.image"
                        placeholder="图片"
                        size="small"
                      />
                      <el-upload
                        ref="logoUpload"
                        :action="getUploadUrl"
                        :data="uploadData"
                        :headers="getUploadHeader"
                        :on-progress="uploadProgressHandle"
                        :on-success="
                          (response, file, fileList) => {
                            item.image = response.data;
                            $set(activeData.options, index, item);
                            closeUploadProgressHandle();
                          }
                        "
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                        style="text-align: center"
                      >
                        <div slot="trigger" class="select-line-icon">
                          <i class="el-icon-upload" />
                        </div>
                      </el-upload>
                    </div>
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 20px">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  style="padding-bottom: 0"
                  type="text"
                  @click="addImageSelectItem"
                >
                  添加选项
                </el-button>
              </div>
              <el-divider />
              <el-form-item label="选择类型">
                <div class="selectType">
                  <div
                    @click="clickSingle('单选')"
                    :class="selectType == '单选' ? 'activeType' : 'normalType'"
                  >
                    单选
                  </div>
                  <div
                    @click="clickMore('多选')"
                    :class="selectType == '多选' ? 'activeType' : 'normalType'"
                  >
                    多选
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="选项随机排列">
                <el-switch v-model="activeData.__config__.selectRandom" />
              </el-form-item>
              <el-form-item
                v-if="activeData.__config__.selectRandom === true"
                label="固定最后一个选项"
              >
                <el-switch v-model="activeData.__config__.fixLastSelect" />
              </el-form-item>
            </div>

            <!-- 单行文本 -->
            <div v-if="activeData.__config__.tagIcon == 'input'">
              <el-form-item
                label="格式限制"
                v-if="
                  activeData.__config__.tagIcon == 'input' &&
                  activeData.__config__.tag !== 'province-city'
                "
              >
                <el-select
                  v-model="activeData.__config__.selectRandom"
                  style="width: 130px"
                />
              </el-form-item>
              <el-form-item
                v-if="activeData.maxlength !== undefined"
                label="最少要填字数"
              >
                <el-input
                  v-model="activeData.minlength"
                  placeholder="请输入"
                  style="width: 130px"
                  type="number"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="activeData.maxlength !== undefined"
                label="最多可填字数"
              >
                <el-input
                  v-model="activeData.maxlength"
                  placeholder="请输入"
                  style="width: 130px"
                  type="number"
                >
                </el-input>
              </el-form-item>
            </div>

            <!-- 多行文本 -->
            <div v-if="activeData.__config__.tagIcon == 'textarea'">
              <el-form-item
                v-if="activeData.autosize !== undefined"
                label="最大行高"
              >
                <el-input
                  v-model="activeData.autosize.maxRows"
                  :min="1"
                  placeholder="最大行高"
                  type="number"
                />
              </el-form-item>
            </div>

            <!-- 矩阵选择 -->
            <div v-if="activeData.__config__.tagIcon == ''"></div>

            <!-- 矩阵量表 -->
            <div v-if="activeData.__config__.tagIcon == ''"></div>

            <!-- 日期 -->
            <div v-if="activeData.__config__.tagIcon == 'date'"></div>

            <!-- 时间 -->
            <div v-if="activeData.__config__.tagIcon == 'time'"></div>

            <!-- 省市区 -->
            <div v-if="activeData.__config__.tag == 'province-city'">
              <el-radio-group v-model="provinceRadio" class="provinceStyle">
                <el-radio :label="1">具体到“详细地址”</el-radio>
                <el-radio :label="2">具体到“区县”</el-radio>
                <el-radio :label="3">具体到“城市”</el-radio>
                <el-radio :label="4">具体到“省份”</el-radio>
              </el-radio-group>
            </div>

            <!-- 上传图片 -->
            <div v-if="activeData.__config__.tagIcon == 'image-upload'">
              <el-form-item label="最多上传图片数量">
                <el-input-number v-model="activeData.limit" />
              </el-form-item>
              <el-form-item
                v-if="activeData.__config__.fileSize !== undefined"
                label="单张图片限制"
              >
                <el-input
                  v-model.number="activeData.__config__.fileSize"
                  placeholder="请输入图片大小"
                >
                  <el-select
                    slot="append"
                    v-model="activeData.__config__.sizeUnit"
                    :style="{ width: '66px' }"
                  >
                    <el-option label="KB" value="KB" />
                    <el-option label="MB" value="MB" />
                    <el-option label="GB" value="GB" />
                  </el-select>
                </el-input>
              </el-form-item>
            </div>

            <!-- 上传文件 -->
            <div v-if="activeData.__config__.tagIcon == 'file-upload'">
              <el-form-item label="最多上传文件数量">
                <el-input-number v-model="activeData.limit" />
              </el-form-item>
              <el-form-item
                v-if="activeData.__config__.fileSize !== undefined"
                label="单个文件限制"
              >
                <el-input
                  v-model.number="activeData.__config__.fileSize"
                  placeholder="请输入文件大小"
                >
                  <el-select
                    slot="append"
                    v-model="activeData.__config__.sizeUnit"
                    :style="{ width: '66px' }"
                  >
                    <el-option label="KB" value="KB" />
                    <el-option label="MB" value="MB" />
                    <el-option label="GB" value="GB" />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="activeData.accept !== undefined"
                label="文件格式限制"
              >
                <el-select
                  v-model="activeData.accept"
                  :style="{ width: '100%' }"
                  clearable
                  placeholder="请选择文件类型"
                >
                  <el-option label="图片" value="image/*" />
                  <el-option label="视频" value="video/*" />
                  <el-option label="音频" value="audio/*" />
                  <el-option label="excel" value=".xls,.xlsx" />
                  <el-option label="word" value=".doc,.docx" />
                  <el-option label="pdf" value=".pdf" />
                  <el-option label="txt" value=".txt" />
                </el-select>
              </el-form-item>
            </div>

            <!-- 评分题 -->
            <div v-if="activeData.__config__.tagIcon == 'rate'">
              <el-form-item v-if="isShowMax" label="最大值">
                <el-input-number
                  v-model="activeData.max"
                  placeholder="最大值"
                />
              </el-form-item>
              <el-form-item
                v-if="activeData['show-score'] !== undefined"
                label="显示分数"
              >
                <el-switch
                  v-model="activeData['show-score']"
                  @change="rateScoreChange"
                />
              </el-form-item>
              <el-form-item
                v-if="activeData['allow-half'] !== undefined"
                label="允许半选"
              >
                <el-switch v-model="activeData['allow-half']" />
              </el-form-item>
            </div>

            <!-- 分页 -->
            <div v-if="activeData.__config__.tagIcon == 'page'">
              <p>分页设置</p>
              <el-form-item label="显示「上一页」按钮" label-width="140px">
                <el-switch v-model="activeData['pageButton']" />
              </el-form-item>
              <el-form-item label="显示页码进度">
                <el-switch v-model="activeData['pageNumber']" />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog
      :visible.sync="dialogVisible"
      title="添加选项"
      @commit="addNode"
    />
    <icons-dialog
      :current="activeData[currentIconModel]"
      :visible.sync="iconsVisible"
      @select="setIcon"
    />
  </div>
</template>

<script>
import { isArray } from "util";
import TreeNodeDialog from "@/views/form/editor/TreeNodeDialog";
import { isNumberStr } from "@/utils";
import IconsDialog from "./IconsDialog";
import {
  imageComponents,
  inputComponents,
  selectComponents,
} from "@/components/generator/config";
import { saveFormConf } from "@/utils/db";
import { debounce } from "throttle-debounce";
import draggable from "vuedraggable";
import _ from "lodash";

const dateTimeFormat = {
  date: "yyyy-MM-dd",
  week: "yyyy 第 WW 周",
  month: "yyyy-MM",
  year: "yyyy",
  datetime: "yyyy-MM-dd HH:mm:ss",
  daterange: "yyyy-MM-dd",
  monthrange: "yyyy-MM",
  datetimerange: "yyyy-MM-dd HH:mm:ss",
};

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ["tinymce"];

export default {
  components: {
    TreeNodeDialog,
    draggable,
    IconsDialog,
  },
  props: ["showField", "activeData", "formConf"],
  data() {
    return {
      loading: null,
      currentTab: "field",
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: "日(date)",
          value: "date",
        },
        {
          label: "周(week)",
          value: "week",
        },
        {
          label: "月(month)",
          value: "month",
        },
        {
          label: "年(year)",
          value: "year",
        },
        {
          label: "日期时间(datetime)",
          value: "datetime",
        },
      ],
      dateRangeTypeOptions: [
        {
          label: "日期范围(daterange)",
          value: "daterange",
        },
        {
          label: "月范围(monthrange)",
          value: "monthrange",
        },
        {
          label: "日期时间范围(datetimerange)",
          value: "datetimerange",
        },
      ],
      colorFormatOptions: [
        {
          label: "hex",
          value: "hex",
        },
        {
          label: "rgb",
          value: "rgb",
        },
        {
          label: "rgba",
          value: "rgba",
        },
        {
          label: "hsv",
          value: "hsv",
        },
        {
          label: "hsl",
          value: "hsl",
        },
      ],
      justifyOptions: [
        {
          label: "start",
          value: "start",
        },
        {
          label: "end",
          value: "end",
        },
        {
          label: "center",
          value: "center",
        },
        {
          label: "space-around",
          value: "space-around",
        },
        {
          label: "space-between",
          value: "space-between",
        },
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__;
          return data.componentName || `${config.label}: ${data.__vModel__}`;
        },
      },

      selectType: "单选",
      provinceRadio: "1",
    };
  },
  computed: {
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        this.activeData.__config__.tag === "el-date-picker"
      ) {
        if (this.activeData["start-placeholder"] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
    tagList() {
      return [
        {
          label: "输入型组件",
          options: inputComponents,
        },
        {
          label: "图片型组件",
          options: imageComponents,
        },
        {
          label: "选择型组件",
          options: selectComponents,
        },
      ];
    },
    activeTag() {
      return this.activeData.__config__.tag;
    },
    isShowMin() {
      return ["el-input-number", "el-slider"].indexOf(this.activeTag) > -1;
    },
    isShowMax() {
      return (
        ["el-input-number", "el-slider", "el-rate"].indexOf(this.activeTag) > -1
      );
    },
    isShowStep() {
      return ["el-input-number", "el-slider"].indexOf(this.activeTag) > -1;
    },
    getUploadHeader() {
      return {
        token: this.$store.getters["user/isLogin"],
      };
    },
    getUploadUrl() {
      return `${process.env.VUE_APP_API_ROOT}/user/file/upload`;
    },
    uploadData() {
      let fbuser = localStorage.getItem("user_id");
      console.log(999, fbuser);
      return {
        fbuser: JSON.stringify(fbuser),
      };
    },
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true,
    },
    activeData: {
      handler(newValue, oldValue) {
        // 切换选中时不触发
        if (newValue.__config__.formId === oldValue.__config__.formId) {
          if (newValue) {
            this.dataChange(newValue);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: "",
        message: "",
      });
    },
    addSelectItem() {
      let lastItem = _.last(this.activeData.__slot__.options);
      this.activeData.__slot__.options.push({
        label: "",
        value: lastItem
          ? lastItem.value === 0
            ? _.max(
                _.values(
                  this.activeData.__slot__.options.map((item) => item.value)
                )
              ) + 1
            : lastItem.value + 1
          : 1,
      });
    },
    async blukAddSelectItems() {
      let arrStrs = await navigator.clipboard.readText();
      let arr = arrStrs.split("\n");
      if (arr.length > 1) {
        const options = [];
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element?.length > 0) {
            options.push({
              label: element,
              value: index + 1,
            });
          }
        }
        this.activeData.__slot__.options = options;
      }
    },
    addImageSelectItem() {
      let lastItem = _.last(this.activeData.options);
      this.activeData.options.push({
        label: "",
        image: "",
        value: lastItem ? lastItem.value + 1 : 1,
      });
    },
    addImageCarouselItem() {
      let lastItem = _.last(this.activeData.__slot__.options);
      this.activeData.__slot__.options.push({
        label: "",
        image: "",
        value: lastItem ? lastItem.value + 1 : 1,
      });
    },
    addSelectOtherItem() {
      let item = this.activeData.__slot__.options.find((item) => {
        return item.value == 0;
      });
      if (item) {
        return;
      }
      this.activeData.__slot__.options.push({
        label: "其他",
        value: 0,
      });
    },
    uploadProgressHandle() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    closeUploadProgressHandle() {
      setTimeout(() => {
        this.loading.close();
      }, 100);
    },
    addTreeItem() {
      ++this.idGlobal;
      this.dialogVisible = true;
      this.currentNode = this.activeData.options;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              on-click={() => this.append(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i
              on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      );
    },
    append(data) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    addNode(data) {
      this.currentNode.push(data);
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          str.split(",").map((val) => (isNumberStr(val) ? +val : val))
        );
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, "defaultValue", JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          isNumberStr(str) ? +str : str
        );
      }
    },
    onSwitchValueInput(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val));
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === "week" ? dateTimeFormat.date : val;
      this.$set(this.activeData.__config__, "defaultValue", null);
      this.$set(this.activeData, "value-format", valueFormat);
      this.$set(this.activeData, "format", val);
    },
    spanChange(val) {
      this.formConf.span = val;
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, "defaultValue", val ? [] : "");
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val);
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        "defaultValue",
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      );
    },
    rateTextChange(val) {
      if (val) this.activeData["show-score"] = false;
    },
    rateScoreChange(val) {
      if (val) this.activeData["show-text"] = false;
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null;
      this.activeData["show-alpha"] = val.indexOf("a") > -1;
      this.activeData.__config__.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val;
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(
        (item) => item.__config__.tagIcon === tagIcon
      );
      if (!target)
        target = selectComponents.find(
          (item) => item.__config__.tagIcon === tagIcon
        );
      this.$emit("tag-change", target);
    },
    dataChange: debounce(430, false, function (val) {
      this.$emit("data-change", val);
    }),
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date();
      }
    },

    clickSingle(e) {
      this.selectType = e;
    },
    clickMore(e) {
      this.selectType = e;
    },
    //选项随机排列
    randomSelect() {

    },
    //固定最后一个选项
    selectFix() {

    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form/index";
.right-board {
  width: 350px;
  position: absolute;
  right: 0px;
  top: 0;
  padding-top: 3px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .field-box {
    position: relative;
    height: calc(100vh - 70px);
    box-sizing: border-box;
    overflow: hidden;

    p {
      font-weight: bold;
    }
  }
  .el-scrollbar {
    height: 100%;
    padding-bottom: 50px;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  align-items: center;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
::v-deep .el-form-item__content {
  text-align: right;
}

.activeType {
  color: #409eff;
  width: 65px;
  border: 1px solid #409eff;
  text-align: center;
}
.normalType {
  border: 1px solid #bebfc3;
  text-align: center;
  width: 65px;
}
.selectType {
  display: inline-flex;
}
.panelTitle {
  margin: 10px 0 0 15px;
  font-size: 18px;
}
.titleLine {
  margin: 10px 0 0;
}
.provinceStyle {
  display: grid;
  ::v-deep .el-radio {
    margin-top: 10px;
  }
  ::v-deep .el-radio__label {
    font-size: 16px;
  }
}
</style>
