<template>
  <div class="content">
    <el-row 
      type="flex" 
      ustify="space-between"
    >
      <el-col 
        :span="12" 
        class="col12"
      >
        <p>我的问卷</p>
      </el-col>
      <el-col 
        :span="12" 
        class="col12"
      >
        <div class="demo-input-suffix">
          <el-input
            placeholder="请输入搜索关键字"
            suffix-icon="el-icon-search"
            v-model="queryParams.name"
            clearable
            style="width: 250px"
            @change="getData"
          />
          <el-select 
            clearable 
            v-model="queryParams.status" 
            placeholder="问卷状态"
            @change="getData"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="my-table"
    >
      <el-table-column
        prop="name"
        label="问卷名称"
      />
      <el-table-column
        prop="describe"
        label="标题"
        width="300"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template 
          slot-scope="{ row }"
        >
          <span 
            class="icon-left" 
            :class="row.status == 1 ? 'Warning' : row.status == 3 ? 'Info' : ''"
          />
          <span class="iconq">{{ row.status == 1 ? '未发布' : row.status == 2 ? '收集中' : '已停止' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mun"
        label="答卷数量"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
      >
        <template 
          slot-scope="{ row }"
        >
          <span v-time="row.updateTime" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template 
          slot-scope="{ row }"
        >
          <el-button
            type="text" 
            class="btn-befo" 
            @click="toProjectHandle(row.key, 'editor')"
          >
            编辑
          </el-button>
          <el-button
            type="text" 
            class="btn-befo"
            @click="release(row.id)"
          >
            发布
          </el-button>
          <el-button
            type="text" 
            class="btn-befo"
            @click="dataCharts(row.id)"
          >
            数据
          </el-button>
          <el-dropdown
            trigger="click" 
            style="margin-left: 20px"
            @command="handleCommand"
          >
            <el-button
              class="el-dropdown-link tn-befo" 
              type="text" 
              style="font-size: 16px"
            >
              ...
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="'copy-' + row.key + '-' + row.name ">
                复制
              </el-dropdown-item>
              <el-dropdown-item :command="'stop-' + row.key + '-' + row.name ">
                停止
              </el-dropdown-item>
              <el-dropdown-item 
                :command="'delete-' + row.key + '-' + row.name "
                style="color: red"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="project-page-view">
      <el-pagination
        v-if="total>10"
        :current-page.sync="queryParams.current"
        :page-size.sync="queryParams.size"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="getData"
      />
    </div>
  </div>
</template>

<script>
import { getMyProjectPage, reqDeleteProject, reqStopProject, reqCopyProject } from "@/api/myProject"
export default {
  data() {
    return {
      queryParams: {
          current: 1,
          size: 10,
          name: '',
          beginDateTime: null,
          endDateTime: null,
          status: null,
          fbUser:'',
      },
      options: [{
        value: '1',
        label: '未发布'
      }, {
        value: '2',
        label: '收集中'
      }, {
        value: '3',
        label: '已停止'
      }],
      tableData: [],
      total: 0
    };
  },
  mounted() {
      this.queryParams.fbUser= localStorage.getItem("user_id")
      this.getData()
  },
  methods: {
    getData() {
      getMyProjectPage(this.queryParams).then(res => {
          let {records, total, size} = res.data
          if (records && records.length) {
            records.forEach(item => {
              item.updateTime = new Date(item.updateTime).getTime()
            });
          }
          this.tableData = records
          this.total = total
          this.queryParams.size = size
      })
    },
    toProjectHandle(key, type) {// 编辑
      this.$router.push({path: `/project/form/${type}`, query: {key: key, active: type}})
    },
    release(id) { // 发布
      console.log('发布', id)
    } ,
    dataCharts(id) { // 查看数据
      console.log('查看数据', id)
    },
    handleCommand(e) {
      if (!e) return 
      const type = e.split('-')[0]
      const key = e.split('-')[1]
      const name = e.split('-')[2]
      switch (type) {
        case 'copy':
          this.openCopyBox(key, name)
          break;
        case 'stop':
          this.$confirm(`确定停止发布《${name}》吗？该问卷所以数据采集将停止，答题链接将无法收集数据`, '停止确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
           reqStopProject({key}).then(res => {
              if (res.data) {
                  this.msgSuccess('停止成功')
                  this.getData()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消停止'
            });          
          });
           
          break;
        case 'delete':
          this.$confirm(`确定要删除《${name}》吗？删除后问卷将移入回收站，可进行恢复`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
           reqDeleteProject({key}).then(res => {
              if (res.data) {
                  this.msgSuccess('刪除成功')
                  this.getData()
              }
          })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
          break;
      }
    },
    openCopyBox(key, name) {
      this.$prompt('副本名称', '复制为副本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: name + '_副本',
        inputPattern: /\S/,
        inputErrorMessage: '请填写副本名称'
      }).then(({ value }) => {
         let data = {}
          this.tableData.forEach(item => {
            if (item.key === key) {
              data = Object.assign(data, item)
            }
          })
          data.fbUser = localStorage.getItem("user_id")
          data.name = value
          data.createTime = ''
          data.updateTime = ''
         reqCopyProject(data).then(res => {
            if (res.data) {
                this.msgSuccess('复制成功')
                this.getData()
            }
         })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.content {
  .col12 {
    display: flex;
    align-items: center;
    &:nth-child(2) {
      justify-content: flex-end;
    }
  }
  .my-table {
    .btn-befo {
      position: relative;
      &::after{
        content: "";
        position: absolute;
        top: 8px;
        right: -12px;
        width: 1px;
        height: 12px;
        background-color: #CCC;
      }
      &+.el-button{
        margin-left: 20px;
      }
    }
    .icon-left {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #67C23A;
    }
    .iconq {
      margin-left: 6px;
    }
    .icon-left.Warning {
        background-color: #E6A23C;
    }
    .icon-left.Info {
        background-color: #909399;
      }
  }
  .project-page-view {
      margin-top: 30px;
      text-align: center;
  }
}
</style>