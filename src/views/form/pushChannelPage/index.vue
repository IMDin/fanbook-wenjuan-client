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
      <p>频道推送</p>
      <div class="post-content">
        <div class="post-content-t">
          <div class="post-content-t-left">
            <p>设置频道推送</p>
            <p>可将问卷推送至服务器内的任意频道</p>
          </div>
          <el-button 
            type="primary"
            plain
            icon="el-icon-plus"
            @click="add"
            class="post-content-t-butt"
          >
            添加
          </el-button>
        </div>
        <div class="post-content-b">
          <el-table
            :data="tableData"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="name"
              label="推送频道"
            />
            <el-table-column
              prop="publishTime"
              label="推送时间"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template slot-scope="{row}">
                {{ row.status == 1 ? '推送成功' : row.status == 2 ? '推送失败' : '推送中' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="answerNum"
              label="答卷数量"
            />
          </el-table>
        </div>
      </div>
    </el-col>
    <el-dialog
      title="发布信息"
      :visible.sync="dialogFormVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <el-form-item
          label="服务器频道:"
          label-width="120px"
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
            collapse-tags
          />
        </el-form-item>
        <el-form-item 
          label="推送时间:"
          label-width="120px"
        >
          <el-date-picker
            v-model="publishTime"
            type="datetime"
            placeholder="选择日期时间"
            :disabled="publishTimeED"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleChange2"
          />
          <el-checkbox 
            style="margin-left: 15px"
            v-model="checkbox"
            @change="checkboxCheage"
          >
            立即推送
          </el-checkbox>
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
  </el-row>
</template>

<script>
import {
  reqTimingPublishMsg
} from "@/api/myProject"
export default {
  name: "PushChannelPage",
  data() {
      return {
        dialogFormVisible: false,
        guildsValue: [
          {
          value: 'guild_id',
          label: 'name'
          }
        ],
        options: [],
        defaultParams: {
          label: 'name',
          value: 'channel_id',
          children: 'channels',
          publishList:[],
          multiple: true 
        },
        checkbox: false,
        publishTime: '',
        publishTimeED: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        tableData: [],
        projectKey: ''
      }
    },
    mounted() {
      this.projectKey = this.$route.query.key
      this.getGuilds()
      this.sendResult2()
    },
    methods: {
      sendResult2(){
        //停止发布则回显 上次保存的数据
        const key = this.projectKey;
        this.$api.get(`/user/project/getPublishList?key=${key}`).then(res => {
            if (res.data) {
                this.tableData=res.data.publishList
            }
        })
      },
      //初始化服务器频道信息
      getGuilds() {
        this.$api.get(`/fanbook/getGuilds`).then(res => {
            if (res.data) {
                  this.options=res.data;
                console.log("初始化服务器频道信息",res.data)
            } 
        })
      },
      dialogForm() {
        let sizes=this.$refs.myCascader.getCheckedNodes().length;
        if(sizes === 0) {
          this.msgInfo('请选择频道')
          return;
        }
        if (this.publishTime == "" && this.publishTimeED == false) {
          this.msgInfo('请选择发送时间')
          return
        }
        this.sendMsg();
        this.dialogFormVisible= false;
      },
      //给后台推送选择的频道频道信息
      sendMsg(){
        reqTimingPublishMsg({key: this.projectKey,publishList: this.publishList, publishTime: this.publishTime}).then((res)=> {
          console.log(res);
          if (res.code == 200) {
            this.msgSuccess('推送成功')
            const that =  this
            setTimeout(() => {
              that.sendResult2()
            }, 1000);
          }
        })
        // this.sendResult();
      },
      add() {
        this.publishTime = ""
        this.publishTimeED = false
        this.checkbox = false
        this.guildsValue = [
          {
          value: 'guild_id',
          label: 'name'
          }
        ]
        this.dialogFormVisible = true
      },
      handleChange2() {
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
      checkboxCheage(val) {
          this.publishTimeED = val
          if (val) {
            this.publishTime = ""
          }
      }
    }
};
</script>

<style lang="scss" scoped>
.post-questionnaire {
  .post-item {
    margin-top: 30px;
    border: 1px solid #ccc;
    background-color: #fff;
    p {
      height: 60px;
      line-height: 60px;
      margin: 0;
      border-bottom: 1px solid #ccc;
      padding: 0 20px;
    }
    .post-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .post-content-t, .post-content-b {
        width: 100%;
        padding: 10px 40px;
      }
      .post-content-t {
        display: flex;
        justify-content: space-between;
        .post-content-t-left {
          p {
            line-height: 40px;
            margin: 0;
            padding: 0;
            height: 20px;
            border: 0;
            &:nth-of-type(2) {
              color: #CCC;
              font-size: 14px;
              margin-top: 5px;
            }
          }
        }
        .post-content-t-butt {
          height: 35px;
        }
      }
    }
  }
}
</style>