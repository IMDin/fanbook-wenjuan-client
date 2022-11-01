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
          :data="membersList"
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
  getFbAdminUp,
  getAdminRoleList,
  getAdminFbMembers
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
      oldMembersList: [],
      list:[],
      FbPullroles: [],
      guildId: "420861300550139904",
      token: process.env.VUE_APP_API_ROOT_TOKEN,
      isMobile: false
    }
  },
  mounted() {
    const platform = window.fb.getPlatform();
    if (platform !== 1) {
      this.$message({
        message: "该功能只支持Fanbook小程序使用",
        type: "error",
        center: true,
      });
      this.getAdminFbMembers()
      return;
    }
    window.fb.getCurrentGuild().then(res => {
      console.log("current guild", res.id, res.name)
      this.guildId=res.id;
      this.guildName=res.name;
      this.getAdminFbMembers()
    });
  },
  methods: {
     // 测试移动端环境
    isMobileNavigator() {
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return flag;
    },
    getAdminFbMembers() {
      const data = {
          "guildId": this.guildId,
          "after":0,
          "limit":500
      }
      getAdminFbMembers(data).then(res => {
        if (res.code == 200) {
          this.list = res.data
           res.data && res.data.forEach(item => {
              this.membersList.push({
                lable:  item.user?.id,
                key: item.user?.first_name,
                pinyin: item.user?.first_name,
                disabled: false
              })
           })
           this.getAdminRoleList()
        }
      })
    },
    getAdminRoleList() {
      const data ={
        "roleid": null,
        "rolename": null,
        "status": 1
      }
      getAdminRoleList(data).then(res => {
        if (res.code === 200) {
          this.oldMembersList = res.data
          console.log(this.oldMembersList, this.membersList, 'this.membersList');
          res.data && res.data?.forEach(item => {
            this.membersList.forEach(it => {
            if (item.name == it.key) {
                it.disabled = true
                this.value.push(it.key)
              }
            })
          })
        }
      })
    },
    confirm() {
      if (this.value.length == 0) {
        this.msgInfo('请选择成员')
        return;
      }
      let data = [];
      let arr =  Array.from(new Set(this.value))
      arr.forEach(it => {
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
