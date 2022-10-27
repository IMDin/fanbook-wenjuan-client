<template>
  <div>
    <div v-if="!isMobile">
      <el-row 
        type="flex"
        class="role-centent"
      >
        <el-col class="role-item">
          <p>添加成员</p>
          <p>添加或删除可以使用问卷管理的成员</p>
        </el-col>
        <el-col class="role-item">
          <div class="butbox">
            <span>当前可用成员</span>
            <el-button 
              type="primary"
              @click="dialogVisible = true"
            >
              修改
            </el-button>
          </div>
          <div class="textarr">
            <span 
              v-for="(item, index) in list" 
              :key="index"
            >
              {{ item.user.first_name }},&nbsp;&nbsp;
            </span>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="610px"
        style="min-width: 610px"
        :before-close="() => dialogVisible = false"
      >
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入用户名称"
          :titles="['可选成员', '已选成员']"
          v-model="value"
          :data="newMembersList"
        />
        <span 
          slot="footer" 
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button 
            type="primary" 
            @click="confirm"
          >
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div v-else>
      移动端样式
    </div>
  </div>
</template>

<script>
import {
  getPullMembers,
  getFbPullroles,
  getFbAdminUp
} from "@/api/role"
export default {
  name: "Role",
  data() {
    return {
      value: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      dialogVisible: false,
      membersList: [],
      newMembersList: [],
      list:[],
      FbPullroles: [],
      guildId: "420861300550139904",
      token: localStorage.getItem('token'),
      isMobile: false
    }
  },
  mounted() {
    // fanbook初始化
    // window.fb.init({
    //   success: () => {
    //       // 如果没有登录调起授权，并保存token到本地
    //         console.log("未授权，需要拉起授权");
    //         this.confirmOauth();
    //   }
    // });
    const platform = window.fb.getPlatform();
    if (platform !== 1) {
      this.$message({
        message: "该功能只支持Fanbook小程序使用",
        type: "error",
        center: true,
      });
      return;
    }
    window.fb.getCurrentGuild().then(res => {
      console.log("current guild", res.id, res.name)
      this.guildId=res.id;
      this.guildName=res.name;
      this.getFbPullroles()
    });
  },
  watch:{
    "membersList":{
      handler(newVal) {
        let hasObj= {};
        const obj = newVal.reduce((cur,next) => {
            hasObj[next.key] ? "" : (hasObj[next.key] = true && cur.push(next)); 
            return cur;
        },[])
        this.newMembersList = obj
        console.log(obj, 'obj');
      },
      deep: true
    }
  },
  methods: {
    // confirmOauth () {
    //   window.fb.oAuth({
    //     oAuthUrl: process.env.VUE_APP_API_ROOT+ 'fanbook/redirect'
    //   }).then(res => {
    //     if (res.data && res.data.code) {
    //       console.log("res.data.code",res.data.code);
    //       // 此为异步，监听islogin的变化发送请求
    //       window.fb.getCurrentGuild().then(res => {
    //         console.log("current guild", res.id, res.name)
    //         this.guildId=res.id;
    //         this.guildName=res.name;
    //         this.getFbPullroles()
    //       });
    //     }else{
    //       this.needAuth = true;
    //       // 授权失败，关闭小程序
    //       window.fb.closeWindow();
    //     }
    //   });
    // },
    getFbPullroles() {
      const data = {
        "token": this.token,
        "guildId": this.guildId,
      }
      getFbPullroles(data).then(res => {
        if (res.code === 200) {
          res.data && res.data.forEach(item => {
            this.FbPullroles.push({
              id: String(item.id),
              lable: item.name
            })
          })
          this.getUserList()
        }
      })
    },
    getUserList() { // 获取fb服务器成员列表
      Promise.all(this.FbPullroles.map(item => getPullMembers({
        "token": this.token,
        "guildId": this.guildId,
        "roleId": item.id
      })))
      .then(res => {
        res.forEach(it => {
          const { code, data } = it
          this.list.push(...data)
          if (code === 200 && data.length !== 0) {
            data.forEach(item => {
              this.membersList.push({
                lable:  item.user?.id,
                key: item.user?.first_name,
                pinyin: item.user?.first_name
              })
            })
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
    },
    confirm() {
      if (this.value.length == 0) {
        this.msgInfo('请选择成员')
        return;
      }
      let data = [];
      this.value.forEach(it => {
        const ite = this.list.find(item => {
          return item.user?.first_name === it
        })
        data.push(ite.user)
      })
      getFbAdminUp({members: data}).then(res => {
        if (res.code === 200) {
          this.msgSuccess('添加成功')
          setTimeout(() => {
            // eslint-disable-next-line no-undef
            fb.closeWindow();
          }, 1000);
          this.dialogVisible = false
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.role-centent {
  flex-direction: column;
  padding: 20px 50px;
  .role-item {
    background-color: #fff;
    border-radius: 8px;
    padding: 10px 30px;
    &:nth-of-type(2) {
      margin-top: 20px;
      .butbox {
        display: flex;
        justify-content: space-between;
      }
      .textarr {
        width: 90%;
        height: 300px;
        margin: 10px auto;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>