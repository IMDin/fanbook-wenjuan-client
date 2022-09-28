<template>
  <div class="publish-container">
    <div>
      <div style="display:flex;justity-content: flex-start;">
        <el-row
          :gutter="10"
          align="middle"
          type="flex"
        >
          <el-col :gutter="100">
            <div
              v-if="!publishStatus"
              class="block"
            >
              <span class="demonstration">服务频道 &nbsp;</span>
                    
              <el-cascader
                placeholder="试试搜索：服务器频道"
                ref="myCascader"
                v-model="guildsValue"
                :options="options"
                :props="defaultParams"
                @change="handleChange"
                filterable
                clearable
              />
            </div>
          </el-col>
                        
          <div
            v-if="!publishStatus"
            class="publish-btn-view"
          >
            <el-button
              class="publish-btn"
              size="medium"
              type="primary"
              @click="publishProject"
            >
              <i class="el-icon-document-checked el-icon--right">开始发布</i>
            </el-button>
          </div>
        </el-row>
      </div>
      <div
        v-if="publishStatus"
        class="publish-finish-view"
        style="position: relative;,in-width:1200px;"
      >
        <div style="position:absolute; z-index:99;right:50px;top:-42px;">
          <el-button
            type="warning"
            size="mini"
            @click="toFeedbackPageHandle"
          >
            查看反馈
          </el-button>
          <el-button
            type="primary"
            @click="dialogFormVisible = true"
          >
            添加频道
          </el-button>
          <el-button
            v-if="!ksfb"
            size="mini"
            type="primary"
            @click="publishProject"
          >
            开始发布
          </el-button>
          <el-button
            v-if="ksfb"
            size="mini"
            type="danger"
            @click="stopPublishProject"
          >
            停止发布
          </el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            label="ID"
            width="300"
          >
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top"
              >
                <div
                  slot="reference"
                  class="name-wrapper"
                >
                  <el-tag size="medium">
                    {{ scope.row.key }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="服务器名称"
            width="220"
          >
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top"
              >
                <p>服务器名称: {{ scope.row.guild_name }}</p>
                <p>服务器ID: {{ scope.row.guild_id }}</p>
                <div
                  slot="reference"
                  class="name-wrapper"
                >
                  <el-tag size="medium">
                    {{ scope.row.guild_name }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="频道名称"
            width="220"
          >
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top"
              >
                <p>频道名称: {{ scope.row.name }}</p>
                <p>频道名称ID: {{ scope.row.channel_id }}</p>
                <div
                  slot="reference"
                  class="name-wrapper"
                >
                  <el-tag size="medium">
                    {{ scope.row.name }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="发布日期"
            width="220"
          >
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button @click="submitForm">防止重复提交</el-button> -->
              <el-button
                type="success"
                @click="handleEdit(scope.$index, scope.row.channel_id, scope.row.key)"
              >
                重新发送
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="发布信息"
          :visible.sync="dialogFormVisible"
        >
          <el-form :model="form">
            <el-form-item
              label="服务器频道"
              :label-width="formLabelWidth"
            >
              <el-cascader
                placeholder="试试搜索：服务器频道"
                ref="myCascader"
                v-model="guildsValue"
                :options="options"
                :props="defaultParams"
                @change="handleChange2"
                filterable
                clearable
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogFormVisible = false">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="dialogForm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
      </div>
      <!-- <el-row :gutter="10" align="middle" type="flex"> -->
      <!-- <el-col>
                        <div>
                            <vue-qr v-if="writeLink" :callback="qrCodeGenSuccess" :size="194"
                                    :text="writeLink"
                            />
                        </div>
                        <div style="text-align: center;">
                            <el-link type="primary" @click="()=>{
                                this.downloadFile('qrcode.png',this.qrCodeUrl)
                            }"
                            >
                                下载分享二维码
                            </el-link>
                        </div>
                    </el-col> -->
      <!-- <el-col style="margin-left: 500px;"> -->
      <!-- <div style="display: flex; justify-content: center;">
                      
                            <div class="icon-view">
                                <i class="el-icon-check success-icon" />
                            </div>
                        </div> -->
                        
      <!-- <div>
                            <p class="success-title">恭喜您，发布成功！{{ channel_name }}</p>
                        </div> -->
                        
      <!-- <el-row>
                           
                            <el-col :span="6" style="margin-left: 100px;">
                                <el-button
                                    type="danger"
                                    @click="stopPublishProject"
                                >
                                    停止发布
                                </el-button>
                            </el-col>
                            <el-col :span="6">
                                <el-button
                                    type="warning"
                                    @click="toFeedbackPageHandle"
                                >
                                    查看反馈
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueQr from 'vue-qr'
import { DebounceBy } from '@/utils/plugins'
export default {
    name: 'ProjectPublish',
    inject:['reload'],
    components: {
        VueQr
    },
    data() {
        return {
            dialogTableVisible: false,
            dialogFormVisible: false,
            publishStatus: true,
            ksfb:false,
            projectKey: null,
            writeLink: '',
            channel_name:'',
            qrCodeUrl: '',
            isfrom:false,
            guildsValue: [{
          value: 'guild_id',
          label: 'name'}],
            guilds: [ ],
        options: [
         ],
          defaultParams: {
         label: 'name',
         value: 'channel_id',
         children: 'channels',
         publishList:[],
          multiple: true 
         
     },
           tableData: [],
           form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
         formLabelWidth: '80px'
      
    }
    },
    //初始化下拉菜单服务器信息
    created(){
        this.getGuilds();
        // console.log("this.projectKey",this.$route.query.key)
        // this.sendResult2(this.$route.query.key);
    },
     watch: {
    isfrom: function(value) {
        alert("sssssss")
      this.sendResult();
    }
  },
    mounted() {
        this.projectKey = this.$route.query.key
        let url = window.location.protocol + '//' + window.location.host
        this.writeLink = `${url}/s/${this.projectKey}`
        this.getProjectStatus()
            this.sendResult();
             console.log("mounted this.projectKey",this.$route.query.key)
    }, 
    methods: {
        //初始化服务器频道信息
         getGuilds() {
            this.$api.get(`/fanbook/getGuilds`).then(res => {
                if (res.data) {
                      this.options=res.data;
                    console.log("初始化服务器频道信息",res.data)
                } 
            })
        },
        getProjectStatus() {
            this.$api.get(`/user/project/${this.projectKey}`).then(res => {
                if (res.data.status == 2) {
                    this.ksfb = true
                } else {
                    this.ksfb = false
                }
            })
        },
        publishProject() {
            console.log("发布获取的服务器id",this.guilds.length)
        //    if(this.guilds.length<1){
        //         console.log("请先选择频道再发布！",this.guilds.length)
        //      this.$message.warning('错了哦，请先选择频道再发布！');
        //      return 
        //    }
            this.$api.post('/user/project/publish', {key: this.projectKey,publishList:this.publishList}).then(() => {
                this.publishStatus = true;
                this.ksfb=true;
                // this.sendMsg();
                this.msgSuccess('发布成功')
  
            })
        },
        //给后台推送选择的频道频道信息
        sendMsg(){
              this.projectKey = this.$route.query.key
               this.$api.post('/user/project/publishMsg', {key: this.projectKey,publishList:this.publishList}).then(() => {})
                //   this.sendResult();
        },
        //发布成功回显数据
        sendResult(){
          //停止发布则回显 上次保存的数据
            var key=this.projectKey;
            this.$api.get(`/user/project/getPublishList?key=${this.projectKey}`).then(res => {
                if (res.data) {
                    // this.getGuilds=this.options;
                    console.log("从新赋值给联级别组件",res.data)
                    this.tableData=res.data.publishList
                    //从新赋值给联级别组件
                }
            })
        },
         sendResult2(key){
          //停止发布则回显 上次保存的数据
            var key=this.projectKey;
            this.$api.get(`/user/project/getPublishList?key=${key}`).then(res => {
                if (res.data) {
                    // this.getGuilds=this.options;
                    console.log("从新赋值给联级别组件",res.data)
                    this.tableData=res.data.publishList
                    //从新赋值给联级别组件
                }
            })
        },
        stopPublishProject() {
            this.$api.post('/user/project/stop', {'key': this.projectKey}).then(res => {
                if (res.data) {
                    this.ksfb=false;
                    this.msgSuccess('停止成功')
                    this.getProjectStatus()
                   

                }
            })
        },
        qrCodeGenSuccess(dataUrl) {
            this.qrCodeUrl = dataUrl
        },
        downloadFile(fileName, content) {
            let aLink = document.createElement('a')
            let blob = this.base64ToBlob(content) // new Blob([content]);
            let evt = document.createEvent('HTMLEvents')
            evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName
            aLink.href = URL.createObjectURL(blob)
            // aLink.dispatchEvent(evt);
            aLink.click()
        },
        // base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,')
            let contentType = parts[0].split(':')[1]
            let raw = window.atob(parts[1])
            let rawLength = raw.length
            let uInt8Array = new Uint8Array(rawLength)
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i)
            }
            return new Blob([uInt8Array], {type: contentType})
        },
        toFeedbackPageHandle() {
            this.$router.replace({path: '/project/form/statistics', query: {key: this.projectKey}})
        },
         handleChange(guildsValue) {
          
              this.channel_name="服务器："+this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join('\n@频道：')
                 let sizes=this.$refs.myCascader.getCheckedNodes().length;
                    if(sizes>0){
                   this.publishList=[];
                   for (var i = 0;i<sizes;i++) {
                        let obj=this.$refs.myCascader.getCheckedNodes()[i].data
                        this.publishList.push(obj)
                        console.log("存储",this.publishList)
                    this.channel_name="服务器："+this.$refs.myCascader.getCheckedNodes()[i].pathLabels.join('\n@频道：')
                }
                console.log(this.publishList,' publishList')
             }
             this.guilds =guildsValue 
      },
         handleChange2(guildsValue) {
                 let sizes=this.$refs.myCascader.getCheckedNodes().length;
                    if(sizes>0){
                   this.publishList=[];
                   for (var i = 0;i<sizes;i++) {
                        let obj=this.$refs.myCascader.getCheckedNodes()[i].data
                        this.publishList.push(obj)
                        console.log("存储",this.publishList)
                }
                //  this.sendResult();
                
             }
      },
      dialogForm(){
          if(!this.ksfb){
              this.msgError('该任务已停止，暂不能添加频道')
              return
          }
            this.sendMsg();
            this.dialogFormVisible=false;
            //  this.sendResult();
             this.isfrom=true;
             this.reload();
      },
      //回显发送的频道列表
       handleEdit(index, row,rowkey) {
        console.log("回显发送的频道列表",index, row);
        var str = row.c[0].toString(); 
        var str2 = row.c[1].toString();
        var str3= str+str2
        console.log("回显发送的频道列表",str+str2);
        this.$api.get('/user/project/refreshMsg', {params: {key: rowkey,fbChannel:str3}}).then(res => {
            //  if (res.data.code==200) {
                this.msgSuccess('发送成功')
            // }
            })
      },
      handleDelete(index, row) {
        console.log(index, row);
      },

    //   submitForm:DebounceBy(function(){
    //       console.log("防止重复提交1000毫秒")
    //     },1000)
    }

}
</script>

<style lang="scss" scoped>
.publish-container {
    width: 100%;
    height: 100%;
    padding: 100px 100px 0 100px;
    margin: 0;
    background-color: #f7f7f7;
    min-height: 84vh;
    // display: flex;
    align-items: center;
    justify-content: center;
}
.publish-finish-view {
    // width: 500px;
    // height: 200px;
    text-align: center;
    .icon-view {
        width: 59px;
        height: 59px;
        border-radius: 100px;
        background-color: #0076ff;
        display: flex;
        align-items: center;
        align-content: center;
        justify-items: center;
        justify-content: center;
    }
    .success-icon {
        text-align: center;
        color: white;
        font-size: 30px;
    }
    .success-title {
        color: rgba(16, 16, 16, 100);
        font-size: 28px;
    }
    .link-text {
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
    }
}


</style>
<style >
.el-dialog {
    width: 20% !important;
}
.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 1px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>