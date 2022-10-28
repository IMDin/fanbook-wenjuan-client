<template>
  <div class="statistics-tabs">
    <div class="statistics-tabs-centent">
      <el-tabs 
        v-model="activeName" 
        type="border-card"
      >
        <el-tab-pane 
          label="列表视图" 
          name="list"
        >
          <mianData 
            :table-data="tableData" 
            @projectExport="projectExport"  
          />
        </el-tab-pane>
        <!-- <el-tab-pane 
          label="统计视图" 
          name="chart"
        >
          <chart />
        </el-tab-pane> -->
        <!-- <el-tab-pane label="数据分析" name="analysis">
          <analysis />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import mianData from './mianData'
// import chart from './chart'
import { reqProjectData } from '@/api/myProject'
export default {
    name: 'ProjectStatistics',
    components: {
        mianData,
    },
    data() {
        return {
            activeName: 'list',
            projectKey: '',
            tableData:[]
        }
    },
    mounted() {
      this.projectKey = this.$route.query?.key
      this.getData()
    }, 
    methods: {
      getData () {
        reqProjectData({key: this.projectKey}).then(res => {
          if(res.code === 200) {
            const  obj = res.data
            obj?.length && obj.forEach(ele => {
              let arr = ele.titie?.split("/")
              ele['titleName'] = arr[0]
              ele['type'] = arr[1]
              ele['id'] = arr[2]
            });
            this.tableData = obj
            console.log(this.tableData, 'this.tableData');
          }
        })
      },
      projectExport() {
        this.$api.get('user/project/result/export', {
            params: {projectKey: this.projectKey},
            responseType: 'blob'
        }).then(res => {
          console.log(res, '1234');
            let blob = res
            let downloadElement = document.createElement('a')
            let href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = this.projectKey + this.$dayjs().format('YYYYMMDDHHMM') + '.xls' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
        }).catch(err => {
          console.log(err);
        })
      }
    }

}
</script>

<style lang="scss" scoped>
.statistics-tabs {
  padding: 20px;
  height: 100vh;
  .statistics-tabs-centent {
    width: 1200px;
    margin: 0 auto;
  }
}

::v-deep .el-tabs__content {
  padding: 0;
}
</style>
