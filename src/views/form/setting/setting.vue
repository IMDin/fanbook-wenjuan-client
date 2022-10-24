<template>
  <div class="setting">
    <el-tabs tab-position="left">
      <el-tab-pane>
        <span
          slot="label"
        ><i class="el-icon-date" /> &nbsp;&nbsp;答题设置</span>
        <div class="questionConfig">
          <p>答题限制</p>
          <div class="questionItem">
            <div class="itemHeader">
              <span>只在Fanbook中填写</span>
              <el-switch v-model="inputInFanbook" />
            </div>
          </div>
          <div class="questionItem">
            <div class="itemHeader">
              <div>
                <span>填写时授权Fanbook ID</span>
                <el-tooltip
                  content="Top center"
                  placement="top"
                >
                  <i
                    class="el-icon-date"
                    style="margin-left: 5px; color: #dcdfe6"
                  />
                </el-tooltip>
              </div>
              <el-switch v-model="authFanbookId" />
            </div>
          </div>
          <div class="questionItem">
            <div class="itemHeader">
              <span>每个Fanbook ID仅填写一次</span>
              <el-switch v-model="inputFanbookIdOnce" />
            </div>
          </div>
          <div class="questionItem">
            <div class="itemHeader">
              <div>
                <span>每人填写次数限制</span>
                <el-tooltip
                  content="Top center"
                  placement="top"
                >
                  <i
                    class="el-icon-question"
                    style="margin-left: 5px; color: #dcdfe6"
                  />
                </el-tooltip>
              </div>
              <el-switch v-model="inputTimes" />
            </div>
            <div
              v-if="inputTimes"
              class="itemContent"
            >
              <el-select v-model="inputTimesValue">
                <el-option
                  v-for="item in inputTimesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span style="line-height: 32px">答题</span>
              <el-input
                v-model="inputTimesNum"
                placeholder="请输入次数"
                type="number"
              />
              <span
                style="
                  border: 1px solid #e4e7ed;
                  width: 50px;
                  height: 32px;
                  display: block;
                  text-align: center;
                  line-height: 32px;
                  background-color: #f2f2f2;
                "
              >次</span>
            </div>
          </div>
          <div class="questionItem">
            <div class="itemHeader">
              <span>设置开始/结束时间</span>
              <el-switch v-model="setTime" />
            </div>
            <div
              v-if="setTime"
              style="padding-bottom: 15px"
            >
              <div style="margin-bottom: 20px">
                <el-checkbox v-model="timeStart">
                  开始时间
                </el-checkbox>
                <el-date-picker
                  v-model="startTime"
                  type="datetime"
                  placeholder="请选择时间"
                />
              </div>
              <div>
                <el-checkbox v-model="timeEnd">
                  结束时间
                </el-checkbox>
                <el-date-picker
                  v-model="endTime"
                  type="datetime"
                  placeholder="请选择时间"
                />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span
          slot="label"
        ><i class="el-icon-date" /> &nbsp;&nbsp;奖品设置</span>
        <div class="giftConfig">
          <el-tabs
            v-model="giftActiveName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              label="用户管理"
              name="1"
            >
              <span slot="label">奖品设置</span>
              <div>
                <el-form
                  ref="giftForm"
                  :model="giftForm"
                  label-width="80px"
                >
                  <el-form-item label="奖品类型">
                    <el-radio-group v-model="giftForm.giftType">
                      <el-radio-button label="积分" />
                      <el-radio-button label="CDK" />
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="积分设置">
                    <div class="coreSet">
                      <div
                        v-if="giftForm.giftType == '积分'"
                        class="coreSetScroll"
                      >
                        <div
                          v-for="(item, index) in giftForm.coreSet"
                          :key="index"
                        >
                          <el-form
                            :model="item"
                            label-width="80px"
                          >
                            <el-form-item label="奖励积分">
                              <el-input
                                type="number"
                                v-model="item.label"
                              />
                            </el-form-item>
                            <el-form-item label="发放数量">
                              <div>
                                <el-radio
                                  v-model="item.value"
                                  label="unlimited"
                                >
                                  <span>不限</span>
                                </el-radio>
                              </div>
                              <div>
                                <el-radio
                                  v-model="item.value"
                                  :label="define"
                                >
                                  自定义
                                  <div
                                    style="display: inline; margin-left: 10px"
                                  >
                                    <el-input
                                      type="number"
                                      v-model="giftSendNumber"
                                      placeholder="请输入数值"
                                      style="width: 115px"
                                    />
                                  </div>
                                </el-radio>
                              </div>
                            </el-form-item>
                          </el-form>
                        </div>
                      </div>
                      <div
                        v-if="giftForm.giftType == 'CDK'"
                        class="coreSetScroll"
                      >
                        <div
                          v-for="(item, index) in giftForm.cdkSet"
                          :key="index"
                        >
                          <el-form
                            :model="item"
                            label-width="80px"
                          >
                            <el-form-item label="奖品名称">
                              <el-input v-model="item.label" />
                            </el-form-item>
                            <el-form-item label="兑换码">
                              <div>
                                <el-button
                                  type="plain"
                                  icon="el-icon-upload2"
                                  @click="loadFile"
                                  style="color: #606266"
                                >
                                  上传文件
                                </el-button>
                              </div>
                              <div>
                                <i
                                  class="el-icon-question"
                                  style="margin-right: 10px"
                                />
                                <span
                                  style="color: #606266; font-size: 12px"
                                >为保证成功导入，请点击</span>
                                <el-button
                                  type="text"
                                  @click="loadFile"
                                >
                                  下载模板
                                </el-button>
                              </div>
                            </el-form-item>
                          </el-form>
                        </div>
                      </div>
                    </div>
                    <el-button
                      type="text"
                      icon="el-icon-circle-plus-outline"
                      @click="addPercentage"
                    >
                      添加份额
                    </el-button>
                  </el-form-item>
                  <el-form-item label="发奖方式">
                    <el-select
                      v-model="giftForm.sendGiftType"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in sendGiftTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="中奖概率">
                    <div>
                      <el-radio
                        v-model="giftForm.percentage"
                        label="must"
                      >
                        <span>100%中奖</span>
                        <el-tooltip
                          content="Top center"
                          placement="top"
                        >
                          <i
                            class="el-icon-question"
                            style="margin-left: 10px"
                          />
                        </el-tooltip>
                      </el-radio>
                    </div>
                    <div>
                      <el-radio
                        v-model="giftForm.percentage"
                        label="other"
                      >
                        其他
                        <div
                          v-if="giftForm.percentage == 'other'"
                          style="display: inline; margin-left: 10px"
                        >
                          <el-input
                            type="number"
                            v-model="giftPercentage"
                          />
                          <span
                            style="margin-left: 5px"
                          >个参与者有一个中奖</span>
                          <i
                            class="el-icon-question"
                            style="margin-left: 10px"
                          />
                        </div>
                      </el-radio>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="配置管理"
              name="2"
            >
              <span slot="label">奖品领取情况</span>
              <div v-if="false">
                <img src="">
              </div>
              <div v-else>
                <div style="text-align: right">
                  <el-button
                    type="plain"
                    icon="el-icon-download"
                    @click="exportData"
                    style="color: #409eff"
                  >
                    导出数据
                  </el-button>
                </div>
                <div>
                  <el-table
                    :data="getGiftData"
                    style="width: 100%"
                  >
                    <el-table-column
                      type="index"
                      label="序号"
                    />
                    <el-table-column
                      prop="type"
                      label="类型"
                      width="50"
                    />
                    <el-table-column
                      prop="gift"
                      label="奖品"
                      width="80"
                    />
                    <el-table-column
                      prop="time"
                      label="获奖时间"
                      sortable
                    />
                    <el-table-column
                      prop="id"
                      label="用户ID"
                    />
                    <el-table-column
                      prop="name"
                      label="用户昵称"
                    />
                    <el-table-column
                      prop="phone"
                      label="手机号"
                    />
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span
          slot="label"
        ><i class="el-icon-date" /> &nbsp;&nbsp;角色设置</span>
        <div class="roleConfig">
          <p>角色设置</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputInFanbook: false,
      authFanbookId: false,
      inputFanbookIdOnce: false,
      inputTimes: false,
      setTime: false,
      inputTimesValue: "only",
      inputTimesOptions: [
        {
          label: "只能",
          value: "only",
        },
      ],
      inputTimesNum: 1,
      timeStart: Boolean,
      timeEnd: true,
      startTime: "",
      endTime: "",
      // 礼物设置
      giftActiveName: "1",
      giftForm: {
        giftType: "积分",
        sendGiftType: [],
        percentage: "other",
        coreSet: [
          {
            label: 10,
            value: "",
          },
        ],
        cdkSet: [
          {
            label: "",
            value: "",
          },
        ],
      },
      sendGiftTypeOptions: [
        {
          label: "单份问卷填完即发",
          value: "single",
        },
      ],
      giftPercentage: "",
      giftSendNumber: Number,
      getGiftData: [
        {
          type: "CDK",
          gift: "玩具",
          time: "2022-10-15",
          id: "20125",
          name: "good",
          phone: "1252648256",
        },
      ],
    };
  },
  methods: {
    handleClick() {},
    addPercentage() {
      if (this.giftForm.giftType == "积分") {
        this.giftForm.coreSet.push({
          label: 10,
          value: "",
        });
      } else if (this.giftForm.giftType == "CDK") {
        this.giftForm.cdkSet.push({
          label: "",
          value: "",
        });
      }
    },
  },
};
</script>

<style scoped>
.setting {
  height: 95%;
  width: 70%;
  margin: 20px auto;
  background-color: #fff;
  /* padding: 20px 0; */
}
::v-deep .el-tabs--left {
  height: 100%;
}
::v-deep .el-tabs--left .el-tabs__item {
  text-align: left;
}
::v-deep .el-tabs__header {
  width: 200px;
}
.setting ::v-deep .el-tabs__active-bar {
  background-color: #e4e7ed;
}
::v-deep .el-tabs__content {
  padding: 0 50px 0 15px;
}
.questionConfig p,
.roleConfig p {
  font-weight: bold;
}
.questionItem {
  border-bottom: 1px solid #e4e7ed;
}
.itemHeader {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-top: 15px;
}
.itemContent {
  display: flex;
  padding-bottom: 15px;
}
::v-deep .itemContent .el-input {
  width: 150px;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.el-checkbox:last-of-type {
  margin-right: 25px;
}
::v-deep .el-input__prefix {
  left: initial;
  right: 5px;
}
/* 奖品设置 */
.giftConfig ::v-deep .el-tabs__item.is-active {
  border-bottom: 1px solid #409eff;
  padding: 0;
}
.giftConfig ::v-deep .el-tabs__nav-wrap::after {
  width: 0;
}
.giftConfig ::v-deep .el-tabs__active-bar {
  display: none;
}
.giftConfig .el-input {
  width: 80px;
}
.coreSet {
  width: 100%;
  background-color: #f2f2f2;
  padding: 15px 15px 0;
}
.coreSetScroll {
  height: 135px;
  overflow: auto;
}
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}
</style>