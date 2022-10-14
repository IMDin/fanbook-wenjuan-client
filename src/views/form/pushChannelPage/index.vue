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
          <el-button 
            type="primary"
            @click="add"
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
              prop="date"
              label="推送频道"
              width="180"
            />
            <el-table-column
              prop="name"
              label="推送时间"
              width="180"
            />
            <el-table-column
              prop="address"
              label="状态"
            />
            <el-table-column
              prop="num"
              label="答卷数量"
            />
          </el-table>
        </div>
      </div>
    </el-col>
    <el-dialog
      title="发布信息"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="服务器频道"
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
  </el-row>
</template>

<script>
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
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    mounted() {
      this.getGuilds()
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
      add() {
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
      }
    }
};
</script>

<style lang="scss" scoped>
.post-questionnaire {
  .post-item {
    margin-top: 30px;
    border: 1px solid #ccc;
    p {
      height: 40px;
      line-height: 40px;
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
        justify-content: flex-end;
      }
    }
  }
}
</style>