<template>
  <!-- <div class="project-logic-container">
    <el-scrollbar class="scrollbar-container">
      <el-row 
        align="middle" 
        class="header-row" 
        justify="center" 
        type="flex"
      >
        <el-col :span="12">
          <p class="logic_title">
            显示逻辑
          </p>
        </el-col>
        <el-col :span="12">
          <el-tooltip 
            placement="top" 
            popper-class="question-popper"
          >
            <div slot="content">
              符合某项条件，则显示某道题
              <br>
              点击查看帮助
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-col>
      </el-row>
      <div class="show-logic-container">
        <div 
          v-if="!logicList.length" 
          class="not-logic-container"
        >
          <el-row>
            <el-col 
              :offset="1" 
              :span="5"
            >
              <el-button 
                type="text" 
                @click="addLogicHandle"
              >
                <i class="el-icon-circle-plus-outline" />
                <span class="label">添加逻辑</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div 
          v-else 
          class="logic-item-container"
        >
          <el-row 
            align="middle" 
            justify="center" 
            type="flex"
          >
            <el-col 
              :offset="1" 
              :span="10"
            >
              <p>共 {{ logicList.length }}. 条显示逻辑</p>
            </el-col>
            <el-col 
              :offset="6" 
              :span="6"
            >
              <el-button 
                size="mini" 
                type="primary" 
                @click="addLogicHandle"
              >
                <i class="el-icon-plus" />
                <span class="label">添加逻辑</span>
              </el-button>
            </el-col>
          </el-row>
          <el-divider />
          <div 
            v-for="(logicItem, index) in logicList" 
            :key="index"
          >
            <el-row 
              align="middle" 
              justify="center" 
              type="flex"
            >
              <el-col 
                :offset="1" 
                :span="7"
              >
                <span class="mr-10">{{ index + 1 }}.</span>
                <el-select
                  v-model="logicItem.formItemId"
                  :disabled="!!logicItem.formItemId"
                  placeholder="请选择问题"
                >
                  <el-option
                    v-for="item in getProjectItemList(logicItem.formItemId)"
                    :key="item.id"
                    :label="item.label"
                    :value="item.formItemId"
                  />
                </el-select>
              </el-col>
              <el-col :span="2">
                <span>符合以下</span>
              </el-col>
              <el-col :span="4">
                <el-select 
                  v-model="logicItem.expression" 
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in questionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col 
                :offset="1" 
                :span="9"
              >
                <span>条件时显示此问题：</span>
              </el-col>
            </el-row>
            <el-row
              v-for="(cItem, cIndex) in logicItem.conditionList"
              :key="cIndex"
              :gutter="20"
              align="middle"
              class="mt-5"
              justify="center"
              type="flex"
            >
              <el-col 
                :offset="1" 
                :span="6"
              >
                <el-select 
                  v-model="cItem.formItemId" 
                  placeholder="请选择题目"
                >
                  <el-option
                    v-for="item in getConditionProjectItemList(logicItem)"
                    :key="item.id"
                    :label="item.label"
                    :value="item.formItemId"
                  />
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select 
                  v-model="cItem.expression" 
                  placeholder="请选择条件"
                >
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select 
                  v-model="cItem.optionValue" 
                  placeholder="请选择选项"
                >
                  <el-option
                    v-for="item in getFormItemOptions(cItem.formItemId)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-button 
                  type="text" 
                  @click="addConditionHandle(logicItem)"
                >
                  <i class="el-icon-circle-plus-outline" />
                </el-button>
                <el-button
                  class="remove"
                  type="text"
                  @click="removeConditionHandle(logicItem, index, cIndex)"
                >
                  <i class="el-icon-remove-outline" />
                </el-button>
              </el-col>
            </el-row>
            <el-divider />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div> -->
  <div class="project-logic-container">
    <div class="show-logic-container">
      <div class="show-logic-container-top">
        <span>逻辑设置</span>
        <el-button
          size="mini" 
          type="primary" 
          @click="addLogicHandle"
        >
          <i class="el-icon-plus" />
          <span class="label">添加逻辑</span>
        </el-button>
      </div>
      <div 
        v-if="!logicList.length" 
        style="height: 100vh;
              display: flex;
              text-align: center;
              align-items: center;"
      >
        <el-empty
          style="width: 100%;"
          description="您还未设置任何逻辑"
          :image-size="200" 
        />
      </div>
      <div v-else>
        <div
          class="logic-container-item"
          v-for="(logicItem, index) in logicList" 
          :key="index"
        >
          <el-row
            v-for="(cItem, cIndex) in logicItem.conditionList"
            :key="cIndex"
            :gutter="20"
            align="middle"
            class="mt-5"
            justify="center"
            type="flex"
          >
            <el-col 
              :offset="1" 
              :span="3"
            >
              <span v-if="cIndex === 0">
                <span class="mr-10">{{ index + 1 }}.</span>如果
              </span>
              <el-select 
                v-else
                v-model="logicItem.expression" 
                placeholder="请选择"
                style="width:100px"
                :disabled="!(cIndex === 1)"
              >
                <el-option
                  v-for="item in questionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col 
              :span="7"
            >
              <el-select 
                v-model="cItem.formItemId" 
                placeholder="请选择题目"
                style="width: 260px;"
              >
                <el-option
                  v-for="item in getConditionProjectItemList(logicItem)"
                  :key="item.id"
                  :label="item.label"
                  :value="item.formItemId"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select 
                v-model="cItem.expression" 
                placeholder="请选择条件"
              >
                <el-option
                  v-for="item in conditionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select 
                v-model="cItem.optionValue" 
                placeholder="请选择选项"
              >
                <el-option
                  v-for="item in getFormItemOptions(cItem.formItemId)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button 
                type="text" 
                @click="addConditionHandle(logicItem)"
              >
                <i class="el-icon-circle-plus-outline" />
              </el-button>
              <el-button
                class="remove"
                type="text"
                @click="removeConditionHandle(logicItem, index, cIndex)"
              >
                <i class="el-icon-remove-outline" />
              </el-button>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #DCDFE6;"
            align="middle"
            class="mt-5"
            justify="center"
            type="flex"
          >
            <el-col 
              :offset="1" 
              :span="3"
              style="display:flex;align-items: center;"
            >
              <div style="margin:0 5px">
                则
              </div>
              <el-select 
                v-model="logicItem.type" 
                placeholder="请选择选项"
              >
                <el-option
                  v-for="item in tpyeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="logicItem.formItemId"
                :disabled="!!logicItem.formItemId"
                placeholder="请选择问题"
                style="width:270px;padding: 0 5px;"
              >
                <el-option
                  v-for="item in getProjectItemList(logicItem.formItemId)"
                  :key="item.id"
                  :label="item.label"
                  :value="item.formItemId"
                />
              </el-select>
            </el-col>
            <el-col :span="12">
              , {{ logicItem.type == 2 ? "否则正常进入下一题" : "否则不显示" }}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { jsonSimpleClone } from "@/utils";

export default {
  name: "ProjectLogic",
  components: {},
  data() {
    return {
      projectKey: "",
      // 默认逻辑项
      defaultLogicItem: {
        formItemId: null,
        expression: 1,
        type: 2,
        conditionList: [
          {
            formItemId: null,
            expression: null,
            optionValue: null,
          },
        ],
      },
      qehuoOption:[
        {
          value: 1,
          label: "或"
        },
        {
          value: 2,
          label: "且"
        }
      ],
      tpyeOptions: [
        {
          value: 1,
          label: "显示"
        },
        {
          value: 2,
          label: "跳转"
        }
      ],
      conditionOptions: [
        {
          value: "eq",
          label: "选中",
        },
        {
          value: "ne",
          label: "未选中",
        },
      ],
      questionOptions: [
        {
          value: 1,
          label: "且", // 全部
        },
        {
          value: 2,
          label: "或", // 任意
        },
      ],
      allProjectItemList: [],
      logicList: [],
    };
  },
  computed: {
    // 解决 vue watch监听数据，新老值一样
    getLogicList() {
      return JSON.parse(JSON.stringify(this.logicList));
    },
  },
  watch: {
    getLogicList: {
      handler(val, oldVal) {
        // 找出发生变化的值
        let updateVal = _.differenceWith(val, oldVal, (arrVal, othVal) => {
          if (JSON.stringify(arrVal) == JSON.stringify(othVal)) {
            return true;
          }
          return false;
        });
        if (updateVal && updateVal[0] && updateVal[0].conditionList.length) {
          let updateData = updateVal[0];
          if (updateData.formItemId) {
            this.saveProjectLogic(updateData);
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.projectKey = this.$route.query.key;
    this.queryProjectItems();
    this.queryProjectLogics();
  },
  methods: {
    addConditionHandle(logicItem) {
      logicItem.conditionList.push({});
    },
    removeConditionHandle(logicItem, logicIndex, index) {
      logicItem.conditionList.splice(index, 1);
      if (logicItem.conditionList.length == 0) {
        this.$api.post("/user/project/logic/delete", logicItem).then(() => {
          this.logicList.splice(logicIndex, 1);
        });
      }
    },
    addLogicHandle() {
      // 添加逻辑时即赋项目值，多次添加逻辑仅保存第一次问题
      let newLogicItem = jsonSimpleClone(this.defaultLogicItem);
      newLogicItem.projectKey = this.projectKey;
      this.logicList.push(newLogicItem);
      console.log(newLogicItem, ' newLogicItemnewLogicItemnewLogicItem');
    },
    getConditionProjectItemList(logicItem) {
      let showFormItemId = logicItem.formItemId;
      if (!showFormItemId) {
        return;
      }
      // 控制显示的条件只能使用在显示问题的前面
      let conditionProjectItemList = jsonSimpleClone(this.allProjectItemList);
      let index = conditionProjectItemList.findIndex(
        (item) => item.formItemId == showFormItemId
      );
      conditionProjectItemList = _.slice(conditionProjectItemList, 0, index);
      conditionProjectItemList = conditionProjectItemList.filter((item) => {
        return ["RADIO", "CHECKBOX", "SELECT"].includes(item.type);
      });
      conditionProjectItemList.forEach(element => {
        element.formItemId = Number(element.formItemId)
      });
      return conditionProjectItemList;
    },
    getProjectItemList(formItemId) {
      // 每个问题只能有一个逻辑设置项 已经设置不允许选择
      let selectedFormItemList = this.logicList.map((item) => item.formItemId);
      let projectItemList = jsonSimpleClone(this.allProjectItemList);
      // 第一个问题不允许隐藏
      projectItemList.shift();
      return projectItemList.filter((item) => {
        return (
          !selectedFormItemList.includes(item.id) ||
          item.formItemId == formItemId
        );
      });
    },
    getFormItemOptions(formItemId) {
      let formItem = this.allProjectItemList.find(
        (item) => item.formItemId == formItemId
      );
      if (formItem) {
        return formItem.expand.options;
      }
      return [];
    },
    queryProjectLogics() {
      this.$api
        .get("/user/project/logic/list", {
          params: { projectKey: this.projectKey },
        })
        .then((res) => {
          this.logicList = res.data;
        });
    },
    queryProjectItems() {
      this.$api
        .get("/user/project/item/list", { params: { key: this.projectKey } })
        .then((res) => {
          this.allProjectItemList = res.data;
        });
    },
    saveProjectLogic(data) {
      this.$api.post("/user/project/logic/save", data).then((res) => {
        if (!data.id) {
          let index = _.findIndex(this.logicList, {
            formItemId: data.formItemId,
          });
          this.logicList[index].id = res.data.id;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.project-logic-container {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  .scrollbar-container {
    height: 100%;
  }
  .header-row {
    width: 230px;
  }
  .logic_title {
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    color: #484848;
    text-indent: 20px;
    padding-top: 20px;
  }
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
.not-logic-container {
  .el-icon-circle-plus-outline {
    font-size: 20px;
  }
  .label {
    font-size: 18px;
  }
}
.logic-item-container {
  .tips {
    font-size: 14px;
    color: #aaa;
  }
  .label {
    font-size: 15px;
  }
  .remove {
    color: #ff4949;
  }
}
.logic-container-item {
  padding: 20px 10px;
  background-color: #F7F7F7;
  border: 1px solid #CCC;
  margin: 20px 0px;
}
.el-icon-question {
  font-size: 23px;
  height: 50px;
  line-height: 50px;
  text-indent: 20px;
  padding-top: 23px;
  color: #d8d8d8;
}
.show-logic-container {
  padding: 10px;
  min-width: 950px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .show-logic-container-top {
    display: flex;
    justify-content: space-between;
  }
}
.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 24px;
}
</style>
<style>
.question-popper.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  /* border-top-color: #205bb5 !important; */
}
.question-popper.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  /* border-top-color: #205bb5 !important; */
}
.question-popper {
  padding: 10px;
  color: #000 !important;
  border-color: #205bb5 !important;
  background: #fff !important;
}
</style>
