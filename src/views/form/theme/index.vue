<template>
  <div class="theme-container">
    <!-- <div class="left-container">
      <el-scrollbar class="left-scrollbar-container">
        <p class="theme-title">外观主题</p>
        <el-row>
          <el-col :span="3">
            <span class="theme-prompt-text">风格</span>
          </el-col>
          <el-col v-for="item in styleList" :key="item.key" :span="3">
            <span
              :class="{ 'style-btn-active': activeStyle == item.key }"
              class="style-btn"
              @click="activeStyleHandle(item)"
              >{{ item.label }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span class="theme-prompt-text">颜色</span>
          </el-col>
          <el-col :span="3">
            <span
              :class="{ 'style-btn-active': activeColor == '' }"
              class="style-btn"
              @click="activeColorHandle('')"
              >全部</span
            >
          </el-col>
          <el-col
            v-for="c in colorList"
            :key="c"
            :class="{ 'style-btn-active': activeColor == c }"
            :span="3"
            :style="{ backgroundColor: c }"
            class="color-btn"
            @click.native="activeColorHandle(c)"
          />
        </el-row>
        <el-row>
          <el-col
            v-for="t in themeList"
            :key="t.id"
            :span="8"
            class="theme-img-view"
            @click.native="activeThemeHandle(t)"
          >
            <p :class="{ 'head-list-view-select': activeTheme.id == t.id }">
              <el-image
                :class="{ 'head-list-img-active': activeTheme.id == t.id }"
                :src="t.headImgUrl"
                class="head-list-img"
                fit="cover"
                style="width: 100px; height: 100px"
              />
            </p>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div> -->
    <pre-view
      :key="projectFormKey"
      :project-key="projectKey"
    />
    <div class="right-container">
      <p class="right-title">
        外观设置
      </p>
      <div class="configClass">
        <el-collapse
          v-model="activeNames"
          @change="handleChange"
          accordion
        >
          <el-collapse-item
            title="品牌logo"
            name="1"
          >
            <div style="text-align: left">
              <el-upload
                ref="logoUpload"
                :action="getUploadUrl"
                :headers="getUploadHeader"
                :on-success="uploadLogoHandle"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
              >
                <img
                  v-if="userProjectTheme.logoImg"
                  :src="userProjectTheme.logoImg"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
              <el-button
                v-if="userProjectTheme.logoImg"
                @click="clearImg"
              >
                清除
              </el-button>
              <div>
                <i class="el-icon-warning-outline" />
                <span
                  style="margin-left: 10px; color: #7b7b7b; font-size: 14px"
                >建议上传PNG格式图片，宽度大于400px</span>
              </div>
            </div>
            <el-row
              align="middle"
              type="flex"
            >
              <el-col :span="6">
                <span class="option-line-sub-title">logo位置</span>
              </el-col>
              <el-col :span="18">
                <el-radio-group
                  v-model="userProjectTheme.logoPosition"
                  size="mini"
                  @change="saveUserTheme"
                >
                  <el-radio-button label="left">
                    左对齐
                  </el-radio-button>
                  <el-radio-button label="center">
                    居中
                  </el-radio-button>
                  <el-radio-button label="right">
                    右对齐
                  </el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item
            title="背景设置"
            name="2"
          >
            <el-row>
              <el-row
                align="middle"
                type="flex"
              >
                <el-col :span="8">
                  <span class="option-line-sub-title">背景类型</span>
                </el-col>
                <el-col
                  :span="18"
                  style="text-align: right"
                >
                  <el-radio-group
                    v-model="showSettings.backgroundType"
                    size="mini"
                    @change="
                      () => {
                        this.userProjectTheme.backgroundImg = '';
                        this.userProjectTheme.backgroundColor = '';
                      }
                    "
                  >
                    <el-radio-button label="color">
                      颜色
                    </el-radio-button>
                    <el-radio-button label="img">
                      图片
                    </el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-if="showSettings.backgroundType == 'color'">
              <el-row
                align="middle"
                type="flex"
              >
                <el-col :span="8">
                  <span class="option-line-sub-title">背景颜色</span>
                </el-col>
                <el-col
                  :span="18"
                  style="text-align: right"
                >
                  <el-color-picker
                    v-model="userProjectTheme.backgroundColor"
                    size="mini"
                    @change="saveUserTheme"
                  />
                </el-col>
              </el-row>
            </el-row>
            <el-row v-if="showSettings.backgroundType == 'img'">
              <el-row
                align="middle"
                type="flex"
              >
                <el-col :span="8">
                  <span class="option-line-sub-title">背景图片</span>
                </el-col>
                <el-col :span="18">
                  <div style="text-align: right; margin-bottom: 10px">
                    <el-upload
                      ref="upload"
                      :action="getUploadUrl"
                      :headers="getUploadHeader"
                      :on-success="uploadBackgroundHandle"
                      :show-file-list="false"
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                      class="upload-demo"
                    >
                      <img
                        v-if="userProjectTheme.backgroundImg"
                        :src="userProjectTheme.backgroundImg"
                        class="avatar"
                      >
                      <i
                        v-else
                        class="
                          el-icon-plus
                          avatar-uploader-icon
                          backgroundConfig
                        "
                      />
                    </el-upload>
                    <el-button
                      v-if="userProjectTheme.backgroundImg"
                      @click="clearImg"
                    >
                      清除
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-row>
          </el-collapse-item>
          <el-collapse-item
            title="按钮设置"
            name="3"
          >
            <el-form
              ref="form"
              :model="userProjectTheme"
              label-width="80px"
              label-position="left"
            >
              <el-form-item label="提示文字">
                <el-input
                  placeholder="请输入内容"
                  @change="saveUserTheme"
                  v-model="userProjectTheme.submitBtnText"
                />
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item
            title="显示设置"
            name="4"
            class="showConfig"
          >
            <el-row
              align="middle"
              type="flex"
            >
              <el-col :span="8">
                <span class="option-line-title">显示标题</span>
              </el-col>
              <el-col
                :offset="8"
                :span="8"
              >
                <el-switch
                  v-model="userProjectTheme.showTitle"
                  @change="saveUserTheme"
                />
              </el-col>
            </el-row>
            <el-row
              align="middle"
              type="flex"
            >
              <el-col :span="8">
                <span class="option-line-title">显示序号</span>
              </el-col>
              <el-col
                :offset="8"
                :span="8"
              >
                <el-switch
                  v-model="userProjectTheme.showNumber"
                  @change="saveUserTheme"
                />
              </el-col>
            </el-row>
            <el-row
              align="middle"
              type="flex"
            >
              <el-col :span="8">
                <span class="option-line-title">显示欢迎语</span>
              </el-col>
              <el-col
                :offset="8"
                :span="8"
              >
                <el-switch
                  v-model="userProjectTheme.showDescribe"
                  @change="saveUserTheme"
                />
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <!-- <el-row align="middle" class="option-line-view" type="flex">
          <el-col :span="8">
            <span class="option-line-title">添加logo</span>
          </el-col>
          <el-col :offset="8" :span="8">
            <el-switch
              v-model="showSettings.logoSetting"
              @change="
                (value) => value == false && uploadLogoHandle({ data: '' })
              "
            />
          </el-col>
        </el-row>
        <el-row v-if="showSettings.logoSetting" align="middle" type="flex">
          <el-col :span="6">
            <span class="option-line-sub-title">logo设置</span>
          </el-col>
          <el-col :span="4">
            <img
              v-if="userProjectTheme.logoImg"
              :src="userProjectTheme.logoImg"
              style="width: 30px; height: 30px"
            />
          </el-col>
          <el-col :offset="6" :span="8">
            <el-upload
              ref="logoUpload"
              :action="getUploadUrl"
              :headers="getUploadHeader"
              :on-success="uploadLogoHandle"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
            >
              <el-button slot="trigger" size="small" type="text"
                >上传Logo</el-button
              >
            </el-upload>
          </el-col>
        </el-row>
        <el-row v-if="showSettings.logoSetting" align="middle" type="flex">
          <el-col :span="6">
            <span class="option-line-sub-title">logo位置</span>
          </el-col>
          <el-col :span="18">
            <el-radio-group
              v-model="userProjectTheme.logoPosition"
              size="mini"
              @change="saveUserTheme"
            >
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row> -->
        <!-- <el-row align="middle" class="option-line-view" type="flex">
          <el-col :span="8">
            <span class="option-line-title">背景设置</span>
          </el-col>
          <el-col :offset="8" :span="8">
            <el-switch
              v-model="showSettings.backgroundSetting"
              @change="
                () => {
                  this.userProjectTheme.backgroundImg = '';
                  this.userProjectTheme.backgroundColor = '';
                  this.saveUserTheme();
                }
              "
            />
          </el-col>
        </el-row>
        <el-row v-if="showSettings.backgroundSetting">
          <el-row align="middle" type="flex">
            <el-col :span="8">
              <span class="option-line-sub-title">背景类型</span>
            </el-col>
            <el-col :spvan="18">
              <el-radio-group
                v-model="showSettings.backgroundType"
                size="mini"
                @change="
                  () => {
                    this.userProjectTheme.backgroundImg = '';
                    this.userProjectTheme.backgroundColor = '';
                  }
                "
              >
                <el-radio-button label="color">颜色</el-radio-button>
                <el-radio-button label="img">图片</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-row>
        <el-row
          v-if="
            showSettings.backgroundSetting &&
            showSettings.backgroundType == 'color'
          "
        >
          <el-row align="middle" type="flex">
            <el-col :span="8">
              <span class="option-line-sub-title">选择颜色</span>
            </el-col>
            <el-col :spvan="18">
              <el-color-picker
                v-model="userProjectTheme.backgroundColor"
                size="mini"
                @change="saveUserTheme"
              />
            </el-col>
          </el-row>
        </el-row>
        <el-row v-if="showSettings.backgroundType == 'img'">
          <el-row align="middle" type="flex">
            <el-col :span="8">
              <span class="option-line-sub-title">选择图片</span>
            </el-col>
            <el-col :spvan="18">
              <el-upload
                ref="upload"
                :action="getUploadUrl"
                :headers="getUploadHeader"
                :on-success="uploadBackgroundHandle"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                class="upload-demo"
              >
                <el-button slot="trigger" size="small" type="text"
                  >上传背景</el-button
                >
              </el-upload>
            </el-col>
          </el-row>
        </el-row> -->
        <!-- <el-row align="middle" class="option-line-view" type="flex">
          <el-col :span="8">
            <span class="option-line-title">按钮设置</span>
          </el-col>
          <el-col :offset="8" :span="8">
            <el-switch v-model="showSettings.btnSetting" />
          </el-col>
        </el-row>
        <el-row v-if="showSettings.btnSetting">
          <el-row align="middle" type="flex">
            <el-col :span="12">
              <span class="option-line-sub-title">按钮提示文字</span>
            </el-col>
            <el-col :spvan="10">
              <el-input
                v-model="userProjectTheme.submitBtnText"
                placeholder="请输入内容"
                size="mini"
                style="width: 80%"
                @change="saveUserTheme"
              />
            </el-col>
          </el-row>
        </el-row> -->
        <!-- <el-row align="middle" class="option-line-view" type="flex">
          <el-col :span="8">
            <span class="option-line-title">显示标题</span>
          </el-col>
          <el-col :offset="8" :span="8">
            <el-switch
              v-model="userProjectTheme.showTitle"
              @change="saveUserTheme"
            />
          </el-col>
        </el-row>
        <el-row align="middle" class="option-line-view" type="flex">
          <el-col :span="8">
            <span class="option-line-title">显示描述</span>
          </el-col>
          <el-col :offset="8" :span="8">
            <el-switch
              v-model="userProjectTheme.showDescribe"
              @change="saveUserTheme"
            />
          </el-col>
        </el-row>
        <el-row align="middle" class="option-line-view" type="flex">
          <el-col :span="8">
            <span class="option-line-title">显示序号</span>
          </el-col>
          <el-col :offset="8" :span="8">
            <el-switch
              v-model="userProjectTheme.showNumber"
              @change="saveUserTheme"
            />
          </el-col>
        </el-row> -->
      </div>
    </div>
  </div>
</template>

<script>
import PreView from "../preview";

export default {
  name: "Theme",
  components: {
    PreView,
  },
  data() {
    return {
      // 外观设置
      showSettings: {
        logoSetting: false, // 打开logo
        backgroundSetting: false,
        btnSetting: false,
        backgroundType: "color",
      },
      // 用户主题设置
      userProjectTheme: {
        projectKey: "",
        themeId: "",
        showTitle: true,
        showDescribe: true,
        showNumber: true,
        backgroundColor: "",
        backgroundImg: "", //背景图
        logoImg: "", //logo图
        logoPosition: "left",
        submitBtnText: "提交",
      },
      projectFormKey: +new Date(),
      projectKey: "",
      styleList: [
        { label: "全部", key: "" },
        { label: "节日", key: "festival" },
        { label: "亲子", key: "parent_child" },
        { label: "风景", key: "scenery" },
        { label: "职业", key: "occupation" },
        { label: "校园", key: "school" },
        { label: "商务", key: "commerce" },
        { label: "其他", key: "others" },
        { label: "餐饮", key: "catering" },
        { label: "防疫", key: "fangyi" },
      ],
      colorList: [
        "#FF6D56",
        "#F8E71C",
        "#00BF6F",
        "#2672FF ",
        "#7464FF",
        "#484848",
        "#EAEAEA",
        "#804000",
      ],
      activeColor: "",
      activeStyle: "",
      activeTheme: "",
      themeList: [],

      activeNames: "",
    };
  },
  computed: {
    getUploadHeader() {
      let fbtoken = localStorage.getItem("fbtoken");
      let token = localStorage.getItem("token");
      return {
        fbtoken,
        token,
      };
    },
    getUploadUrl() {
      return `${process.env.VUE_APP_API_ROOT}project/file/upload/${this.projectKey}`;
    },
  },
  mounted() {
    this.projectKey = this.$route.query.key;
    this.queryProjectTheme();
    this.projectFormKey = +new Date();
    this.queryUserProjectTheme();
  },
  methods: {
    uploadBackgroundHandle(response) {
      this.userProjectTheme.backgroundImg = response.data;
      this.userProjectTheme.backgroundColor = "";
      this.saveUserTheme();
    },
    uploadLogoHandle(response) {
      this.userProjectTheme.logoImg = response.data;
      this.saveUserTheme();
    },
    activeStyleHandle(item) {
      this.activeStyle = item.key;
      this.queryProjectTheme();
    },
    saveUserTheme() {
      this.userProjectTheme.projectKey = this.projectKey;
      this.userProjectTheme.themeId = this.activeTheme
        ? this.activeTheme.id
        : "";
      this.$api
        .post("/user/project/theme/save", this.userProjectTheme)
        .then(() => {
          this.projectFormKey = +new Date();
        });
    },
    queryUserProjectTheme() {
      this.$api.get(`/user/project/theme/${this.projectKey}`).then((res) => {
        if (!res.data) {
          return;
        }
        this.userProjectTheme = res.data;
        let {
          themeId,
          logoImg,
          backgroundImg,
          backgroundColor,
          submitBtnText,
        } = res.data;
        this.activeTheme = {
          id: themeId,
        };
        this.showSettings.logoSetting = !!logoImg;
        this.showSettings.btnSetting = !!submitBtnText;
        if (backgroundImg || backgroundColor) {
          this.showSettings.backgroundSetting = true;
          this.showSettings.backgroundType = backgroundImg ? "img" : "color";
        }
      });
    },
    activeThemeHandle(item) {
      if (item) {
        this.$confirm(
          "切换主题，系统将不会保存您在上一主题所做的修改，请知悉。",
          "切换主题提醒",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消操作",
            type: "info",
          }
        )
          .then(() => {
            this.activeTheme = item;
            this.saveUserTheme();
          })
          .catch(() => {});
      }
    },
    activeColorHandle(item) {
      console.log(item);
      this.activeColor = item;
      this.queryProjectTheme();
    },
    queryProjectTheme() {
      this.$api
        .get("/project/theme/list", {
          params: {
            color: this.activeColor,
            style: this.activeStyle,
          },
        })
        .then((res) => {
          this.themeList = res.data;
        });
    },

    //切换选项卡
    handleChange() {},
    clearImg() {
      if (this.activeNames == "1") {
        this.userProjectTheme.logoImg = "";
      } else {
        this.userProjectTheme.backgroundImg = "";
      }
      this.saveUserTheme();
    },
  },
};
</script>

<style scoped>
.theme-container {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: center;
}
.left-container {
  line-height: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  width: 20%;
  height: calc(100vh - 60px);
}
.left-scrollbar-container {
  height: 100%;
  margin: 20px;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.style-btn {
  line-height: 30px;
  border-radius: 4px;
  padding: 3px;
  color: #707070;
  font-size: 14px;
  text-align: center;
  border: 1px solid #eaeaea;
}
.preview-container {
  width: 85%;
}
.theme-title {
  color: rgba(16, 16, 16, 100);
  font-size: 24px;
  text-align: left;
}
.theme-prompt-text {
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  line-height: 30px;
  text-align: left;
}
.color-btn {
  width: 40px;
  height: 22px;
  line-height: 20px;
  border-radius: 4px;
  background-color: rgba(11, 141, 213, 100);
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: center;
  margin: 3px;
  border: 1px solid rgba(255, 255, 255, 100);
}
.color-btn:hover,
.style-btn:hover {
  cursor: pointer;
  border: 1px solid rgba(11, 141, 213, 100);
}
.style-btn-active {
  border: 1px solid rgba(11, 141, 213, 100);
}
.head-list-img {
  border: 2px solid transparent;
}
.head-list-img:hover {
  cursor: pointer;
  border: 2px solid rgba(11, 141, 213, 100);
}
.head-list-img-active {
  border: 2px solid rgba(11, 141, 213, 100);
}
.theme-img-view .head-list-view-select ::after {
  content: "";
  background: url("~@/assets/images/mobile_theme_active.png");
  background-size: 18px;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 4px;
  right: 4px;
}
.right-container {
  width: 350px;
  height: calc(100vh - 60px);
  line-height: 20px;
  text-align: center;
  padding-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  margin-right: 5px;
}
.right-title {
  color: rgba(16, 16, 16, 100);
  font-size: 20px;
  text-align: left;
  margin: 0 0 20px 20px;
}
.right-container .option-line-view {
  padding: 0;
  width: 280px;
  height: 42px;
  line-height: 20px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 10px;
  border: 1px solid rgba(187, 187, 187, 100);
}
.right-container .option-line-title {
  color: rgba(16, 16, 16, 100);
  line-height: 40px;
  font-size: 14px;
  text-align: left;
}
.option-line-sub-title {
  color: rgb(82, 81, 81);
  line-height: 40px;
  font-size: 13px;
  text-align: left;
}

.configClass {
  /* border-top: 1px solid #eaeaea; */
  /* padding: 20px 35px; */
}
::v-deep .el-collapse-item__header {
  padding: 0 20px;
}
::v-deep .el-collapse-item__arrow {
  transform: rotate(90deg);
}
::v-deep .el-collapse-item__content {
  padding: 0 20px;
}
::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #606266;
  background-color: #fff;
  border-color: #409eff;
  box-shadow: -1px 0 0 0 #409eff;
}
::v-deep .is-active {
  color: #409eff;
}
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
.backgroundConfig {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
}
.upload-demo {
  text-align: right;
}
::v-deep .el-form-item__label {
  font-weight: normal;
}
.showConfig .el-row .el-col:nth-last-child(1) {
  text-align: right;
}
.showConfig .el-row .el-col:nth-child(1) {
  text-align: left;
}
</style>
