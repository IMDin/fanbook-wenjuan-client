<template>
  <el-row 
    class="post-questionnaire"
    type="flex" 
    justify="center"
  >
    <el-col 
      :span="18" 
      class="post-item"
    >
      <p>链接分享</p>
      <div class="post-content">
        <div class="post-content-t">
          <el-form 
            :inline="true" 
            :model="formInline" 
            class="demo-form-inline"
          >
            <el-form-item label="分享链接">
              <el-input 
                v-model="formInline.value" 
                style="width:400px"
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                @click="onSubmit"
              >
                复制
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'PostQuestionnaire',
  data() {
    return {
      formInline: {
        value: ''
      },
      key: '',
      projectUrl:''
    }
  },
  mounted() {
    this.key = this.$route.query.key
    let url = window.location.protocol + '//' + window.location.host
    this.projectUrl  = `${url}/s/${this.key}?fb_redirect&open_type=mp`
    this.formInline.value = this.projectUrl
  },
  methods: {
    setPublist() {// 推送频道
      this.$router.push({path: `/project/form/pushChannelPage`, query: {key: this.key}})
    },
    onSubmit(){
      let url = this.projectUrl;
      //新建一个文本框
      let oInput = document.createElement('input');
      //赋值给文本框
      oInput.value = url;
      document.body.appendChild(oInput);
      // 选择对象;
      oInput.select(); 
      // 执行浏览器复制命令
      document.execCommand("Copy"); 
      //复制完成删除掉输入框
      oInput.remove()

      this.msgSuccess('复制成功')
    },
  }
}
</script>

<style lang="scss" scoped>
.post-questionnaire {
  .post-item {
    margin-top: 30px;
    border: 1px solid #CCC;
    background-color: #fff;
    p {
      height: 60px;
      line-height: 60px;
      margin: 0;
      border-bottom:  1px solid #CCC;
      padding: 0 20px;
    }
    .post-content {
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      height: 100vh;
      .post-content-t {
        padding: 15px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}

</style>