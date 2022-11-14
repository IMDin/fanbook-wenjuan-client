<template>
  <div class="write-container">
    <h1
      id="inActiveTime"
      style="display: none"
    />
    <div
      v-if="writeStatus == 0"
      class="title-icon-view"
    >
      <div class="icon-view">
        <i 
          class="el-icon-check success-icon" 
          v-if="writeNotStartPrompt !== '项目时间已结束。' && writeNotStartPrompt !== '项目时间末开始。'"
        />
        <img 
          src="@/assets/images/isover.jpg" 
          width="width: 80px"
          v-if="writeNotStartPrompt == '项目时间已结束。'"
        >
        <img 
          src="@/assets/images/nostart.jpg" 
          width="width: 80px"
          v-if="writeNotStartPrompt == '项目时间末开始。'"
        >
      </div>
      <p
        v-if="writeNotStartPrompt"
        style="text-align: center"
      >
        <span 
          v-if="writeNotStartPrompt" 
          style="font-weight: bold;font-size: 20px;"
        >{{ writeNotStartPrompt }}</span> <br>
        <span v-if="writeNotStartPrompt == '项目时间已结束。'"> 结束时间：{{ endTime }} </span>
        <span v-if="writeNotStartPrompt == '项目时间末开始。'">开始时间：{{ startTime }}</span>
      </p>
    </div>
    <div v-if="writeStatus == 1">
      <project-form
        v-if="projectConfig.projectKey"
        :project-config="projectConfig"
        @submit="submitForm"
      />
    </div>
    <div
      v-if="writeStatus == 2"
      class="title-icon-view"
    >
      <submitResultsPage
        :dialog-form="dialogForm"
        :write-status="writeStatus"
      />
      <!-- 提交完成之后的页面 -->
      <!-- <div class="icon-view">
        <i class="el-icon-check success-icon" />
      </div>
      <p style="text-align: center">
        <span v-if="userProjectSetting.submitPromptText">{{
          userProjectSetting.submitPromptText
        }}</span>
        <span v-else>{{ globalDefaultValue.projectSubmitPromptText }}</span>
      </p>
      <div>
        <el-image
          v-if="userProjectSetting.submitPromptImg"
          :src="userProjectSetting.submitPromptImg"
          fit="cover"
        />
      </div>
      <el-button
        v-if="userProjectSetting.publicResult"
        type="primary"
        @click="openPublicResultHandle"
      >
        查看数据
      </el-button> -->
    </div>
  </div>
</template>

<script>
import ProjectForm from "../preview/ProjectForm";
import loadWXJs from "@/utils/loadWxSdk";
import defaultValue from "@/utils/defaultValue";
import { getQueryString } from "@/utils";
// import constants from "@/utils/constants";
import submitResultsPage from "@/views/form/editor/submitResultsPage"
const uaParser = require("ua-parser-js");
const ua = uaParser(navigator.userAgent);

require("@/utils/ut");
export default {
  name: "WriteView",
  components: {
    ProjectForm,
    submitResultsPage
  },
  props: {},
  data() {
    return {
      startTime: '',
      endTime: '',
      dialogForm: defaultValue,
      inActiveTime: 0,
      projectConfig: {
        projectKey: "",
        preview: false,
        showBtns: true,
      },
      writeStatus: 1,
      writeNotStartPrompt: "",
      userProjectSetting: {
        submitPromptText: "",
      },
      globalDefaultValue: defaultValue,
      // 微信授权地址
      wxAuthorizationUrl: "",
      wxAuthorizationCode: "",
      wxUserInfo: {},
      wxSignature: {},
      //fanbook 服务器 id
      guildId :"",
      //FB用户长ID
      fbUserid:"",
      fbUsername:"",
      guildName:""

    };
  },
  metaInfo: {
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
    ],
  },

  async created() {
    console.log("write create step 1(fanbook) at:" + new Date());
	// fanbook初始化
			window.fb.init({
				success: () => {
						// 如果没有登录调起授权，并保存token到本地
            console.log("create 未授权，需要拉起授权 at:" + new Date());
            this.confirmOauth();
				}
			});

    let key = this.$route.query.key || this.$route.params.key;
    this.projectConfig.projectKey = key;
    let wxCode = getQueryString("code");
    console.log("mofang >> ", key);
    if (wxCode) {
      this.wxAuthorizationCode = wxCode;
      await this.getWxAuthorizationUserInfo();
    }

    this.queryProjectSetting(); // 获取表单配置
    // const platform = window.fb.getPlatform();
    // if (platform !== 1) {
    //   this.$message({
    //     message: "该功能只支持Fanbook小程序使用",
    //     type: "error",
    //     center: true,
    //   });
    //   return;
    // }
    // 如果是在fanbook里面打开的 不使用微信验证
    // this.getWxAuthorizationUrl();
    // this.queryProjectSettingStatus();
    // if (constants.enableWx) {
    //   // 加载微信相关 获取签名
    //   this.$api
    //     .get("/wx/jsapi/signature", { params: { url: window.location.href } })
    //     .then((res) => {
    //       this.wxSignature = res.data;
    //       this.setWxConfig();
    //     });
    // }
             
  },
  mounted() {
    this.viewProjectHandle();
  },
  methods: {

    viewProjectHandle() {
      // 是否能进入填写
      this.$api
        .post(`/user/project/result/view/${this.projectConfig.projectKey}`, {
          params: { projectKey: this.projectConfig.projectKey },
        })
        .then(() => {});
    },
    queryProjectSettingStatus() {
      // 是否能进入填写
      this.$api
        .get("/user/project/setting-status", {
          params: {
            projectKey: this.projectConfig.projectKey,
            wxOpenId:  this.user_id ?  this.user_id : '',
          },
        })
        .then((res) => {
          if (res.msg) {
            this.writeNotStartPrompt = res.msg;
            this.writeStatus = 0;
          }
        });
    },
    getWxAuthorizationUserInfo() {
      let wxAuthorizationCode = this.wxAuthorizationCode;
      // 根据code 获取用户授权信息
      return this.$api
        .get("/wx/jsapi/authorization/user/info", {
          params: {
            code: wxAuthorizationCode,
          },
        })
        .then((res) => {
          if (res.data) {
            this.wxUserInfo = res.data;
          }
        });
    },
    getWxAuthorizationUrl() {
      // 获取微信授权url地址
      this.$api
        .get("/wx/jsapi/authorization/url", {
          params: { url: window.location.href },
        })
        .then((res) => {
          if (res.data) {
            this.wxAuthorizationUrl = res.data;
          }
        });
    },

    //未授权则拉起fanbook小程序授权
    confirmOauth () {
      // eslint-disable-next-line no-case-declarations
				window.fb.oAuth({
					oAuthUrl: process.env.VUE_APP_API_ROOT+ 'fanbook/redirect'
				}).then(res => {
          console.log("write fanbook oauth2 code:" + JSON.stringify(res));
					if (res.data && res.data.code) {
            console.log("write succ to get oauth2 code:",res.data.code);
            // 此为异步，监听islogin的变化发送请求
            this.getFanbookLoginToken(decodeURIComponent(res.data.code));
           window.fb.getCurrentGuild().then(res => {
             console.log("write succ to login, get guild", res.id, res.name)
             this.guildId=res.id;
              this.guildName=res.name;
            });
            window.fb.getUserInfo().then(v => {
              const { userId } = v
              this.user_id = userId
              this.queryProjectSettingStatus();
            })
					}else{
            console.log("write fail to get oauth2 code!");
						this.needAuth = true;
            // 授权失败，关闭小程序
            window.fb.closeWindow();
					}
				}).catch(() => {
          // 在web 中打开
          this.queryProjectSettingStatus();
        });
			},
    getFanbookLoginToken(data) {
      console.log("write start to login fanbook data:", JSON.stringify(data));
        this.$api.get('/fanbook/login', {params: {code: data}}).then(res => {
            console.log("write login fanbook res:", JSON.stringify(res));
            if (res.data) {
              console.log("write login fanbook res data:", JSON.stringify(res.data));
              localStorage.setItem("fbtoken",res.data.fbtoken)
              //获取用户信息
              this.$api.get('/fanbook/getMe').then(resw => {
                console.log("write login fanbook getMe res:", JSON.stringify(resw));
                this.fbUserid=resw.data.user_id;
                this.fbUsername=resw.data.username;
            })
            }
        })
    },
    setWxConfig() {
      let that = this;
      let signature = this.wxSignature;
      loadWXJs((wx) => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: signature.appId, // 必填，公众号的唯一标识
          timestamp: signature.timestamp, // 必填，生成签名的时间戳
          nonceStr: signature.nonceStr, // 必填，生成签名的随机串
          signature: signature.signature, // 必填，签名
          jsApiList: [
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "showMenuItems",
            "hideMenuItems",
            "chooseWXPay",
          ], // 必填，需要使用的JS接口列表
        });
        // sdk准备完成之后调用
        wx.ready(function () {
          // 需在用户可能点击分享按钮前就先调用
          console.log("ready");
          that.setWxProjectShare(wx);
        });
      });
    },
    /**
     * 微信分享
     */
    setWxProjectShare(wx) {
      let { shareImg, shareTitle, shareDesc } = this.userProjectSetting;
      wx.updateAppMessageShareData({
        title: shareTitle || defaultValue.projectShareTitle, // 分享标题
        desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
        success: function () {
          // 设置成功
          console.log("succcess");
        },
        fail: function () {
          console.log("fail");
        },
      });
      wx.updateTimelineShareData({
        title: shareTitle || defaultValue.projectShareTitle, // 分享标题
        desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
        success: function () {
          // 设置成功
          console.log("succcess");
        },
        fail: function () {
          console.log("fail");
        },
      });
      wx.onMenuShareTimeline({
        title: shareTitle || defaultValue.projectShareTitle, // 分享标题
        desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
        success: function () {
          // 设置成功
          console.log("succcess");
        },
      });
      wx.onMenuShareAppMessage({
        title: shareTitle || defaultValue.projectShareTitle, // 分享标题
        desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
        success: function () {
          // 设置成功
          console.log("succcess");
        },
      });
    },
    queryProjectSetting() { 
      this.$api
        .get(`/user/project/setting/${this.projectConfig.projectKey}`)
        .then((res) => {
          if (res.data) {
            this.userProjectSetting = res.data;
            // 验证答题时间是否开始
            const { endTime, startTime } = res.data
            if(endTime || startTime) {
              let endTimes =  new Date(endTime).getTime()
              let startTimes =  new Date(startTime).getTime()
              const nowTime =  new Date().getTime()
              // 如果当前时间小于开始时间
              if(startTimes && nowTime < startTimes) {
                this.startTime = startTime
                return
              }
              if(endTimes && nowTime > endTimes) {
                this.endTime = endTime
                console.log('已经结束啦');
              }
            }

            // 仅在微信环境打开
            if (res.data && res.data.wxWrite && window.fb.getPlatform() == 0) {
              // // 记录微信用户信息
              // if (res.data.recordWxUser && !this.wxAuthorizationCode) {
              //   location.href = this.wxAuthorizationUrl;
              // } else {
              //   this.onlyWxOpenHandle();
              // }
                 document.body.innerHTML =
              '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在fanbook客户端打开链接</h4></div></div>';
            }
          }
        });
         this.$api
        .get(`/user/project/details/${this.projectConfig.projectKey}`)
        .then((res) => {
            this.dialogForm.projectShareImg = res.data.project.projectShareImg || defaultValue.projectShareImg
            this.dialogForm.mainText = res.data.project.mainText || defaultValue.mainText
            this.dialogForm.description = res.data.project.description || defaultValue.description
            this.dialogForm.links = res.data.project.links || defaultValue.links
        })
        
    },
    /**
     * 仅在微信打开
     */
    onlyWxOpenHandle() {
      let wxUa = navigator.userAgent.toLowerCase();
      let isWeixin = wxUa.indexOf("micromessenger") != -1;
      if (!isWeixin) {
        document.head.innerHTML =
          '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
        document.body.innerHTML =
          '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
      }
    },
    openPublicResultHandle() {
      let projectKey = this.projectConfig.projectKey;
      this.$router.replace({
        path: "/project/public/result",
        query: { projectKey },
      });
    },
    submitForm(data) {
      // 完成时间
      let inActiveTime = document.getElementById("inActiveTime").innerText;
      this.$api
        .post("/user/project/result/create", {
          completeTime: inActiveTime,
          projectKey: this.projectConfig.projectKey,
          submitOs: ua.os.name,
          submitBrowser: window.fb?.getPlatform() !== 0 ? 'fanbook' : ua.browser.name, // window.fb.getPlatform();
          submitUa: ua,
          wxUserInfo: this.wxUserInfo,
          wxOpenId: this.wxUserInfo ? this.wxUserInfo.openid : "",
          originalData: data.formModel,
          processData: data.labelFormModel,
          fbUserid: this.fbUserid,
          guildId: this.guildId,
          fbUsername: this.fbUsername,
          guildName:this.guildName,
          publishTime: this.$route.query?.publishTime,
          chatId: this.$route.query?.chatId
        })
        .then(() => {
          this.writeStatus = 2;
          if (this.userProjectSetting.submitJumpUrl) {
            setTimeout(() => {
              window.location.replace(this.userProjectSetting.submitJumpUrl);
            }, 1000);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.write-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.title-icon-view {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.icon-view {
  width: 59px;
  height: 59px;
  border-radius: 100px;
  background-color: #0076ff;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.success-icon {
  text-align: center;
  color: white;
  font-size: 30px;
}
</style>
