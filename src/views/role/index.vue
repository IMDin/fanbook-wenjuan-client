<template>
  <div>
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
    }
  },
  mounted() {
    this.getFbPullroles()
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
    getFbPullroles() {
      const data = {
        "token": "93d4029fc9e80eb3b3415c560419f6f0fb0506ba320bdec5f5aa96980fd7d9b7bb2b697976ba3197fc659424a765f961",
        "guildId": "420861300550139904",
      }
      getFbPullroles(data).then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
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
        "token": "93d4029fc9e80eb3b3415c560419f6f0fb0506ba320bdec5f5aa96980fd7d9b7bb2b697976ba3197fc659424a765f961",
        "guildId": "420861300550139904",
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