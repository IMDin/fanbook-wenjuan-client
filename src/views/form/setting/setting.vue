<template>
  <div class="setting">
    <el-tabs
      tab-position="left"
      @tab-click="tabChange"
      v-model="activeName"
    >
      <el-tab-pane name="answer">
        <span
          slot="label"
        ><i class="el-icon-date" /> &nbsp;&nbsp;答题设置</span>
        <div class="questionConfig">
          <p>答题限制</p>
          <div class="questionItem">
            <div class="itemHeader">
              <span>只在Fanbook中填写</span>
              <el-switch
                v-model="wxWrite"
                @change="saveUserProjectSetting"
              />
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
              <el-switch
                v-model="empower"
                @change="saveUserProjectSetting"
              />
            </div>
          </div>
          <div class="questionItem">
            <div class="itemHeader">
              <span>每个Fanbook ID仅填写一次</span>
              <el-switch
                v-model="inputFanbookIdOnce"
                @change="saveUserProjectSetting"
              />
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
                  v-for="(item, index) in inputTimesOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span style="line-height: 32px">答题</span>
              <el-input
                v-model="inputTimesNum"
                placeholder="请输入次数"
                type="number"
                @change="saveUserProjectSetting"
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
                <el-checkbox
                  v-model="timeStart"
                  @change="saveUserProjectSetting"
                >
                  开始时间
                </el-checkbox>
                <el-date-picker
                  v-model="startTime"
                  type="datetime"
                  placeholder="请选择时间"
                  @change="saveUserProjectSetting"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
              <div>
                <el-checkbox
                  v-model="timeEnd"
                  @change="saveUserProjectSetting"
                >
                  结束时间
                </el-checkbox>
                <el-date-picker
                  v-model="endTime"
                  type="datetime"
                  placeholder="请选择时间"
                  @change="saveUserProjectSetting"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="gift">
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
                    <el-radio-group
                      v-model="giftForm.giftType"
                      @change="queryGiftSetting(giftForm.giftType)"
                    >
                      <el-radio-button :label="1">
                        积分
                      </el-radio-button>
                      <el-radio-button :label="0">
                        CDK
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="积分设置">
                    <div class="coreSet">
                      <div
                        v-if="giftForm.giftType"
                        class="coreSetScroll"
                      >
                        <div
                          v-for="(item, index) in giftForm.coreSet"
                          :key="index"
                          class="coreSetClass"
                        >
                          <el-form
                            :model="item"
                            label-width="80px"
                            :disabled="item.disabled"
                          >
                            <el-form-item label="奖励积分">
                              <el-input
                                type="number"
                                v-model="item.desc"
                                @change="addScore(item, index)"
                              />
                            </el-form-item>
                            <el-form-item label="发放数量">
                              <div>
                                <el-radio
                                  v-model="item.flag"
                                  :label="1"
                                  @change="addScore(item, index)"
                                >
                                  <span>不限</span>
                                </el-radio>
                              </div>
                              <div>
                                <el-radio
                                  v-model="item.flag"
                                  :label="0"
                                >
                                  自定义
                                  <div
                                    style="display: inline; margin-left: 10px"
                                  >
                                    <el-input
                                      @input="changeInput(item, index)"
                                      min="1"
                                      type="number"
                                      v-model="item.count"
                                      placeholder="请输入数值"
                                      style="width: 115px"
                                      @change="addScore(item, index)"
                                    />
                                  </div>
                                </el-radio>
                              </div>
                            </el-form-item>
                          </el-form>
                          <el-button
                            @click="deletePercentage(item, index)"
                            type="text"
                            icon="el-icon-delete"
                            style="
                              font-size: 16px;
                              color: #f56c6c;
                              position: absolute;
                              right: 40px;
                              top: 20px;
                            "
                          />
                        </div>
                      </div>
                      <div
                        v-if="!giftForm.giftType"
                        class="coreSetScroll"
                      >
                        <div
                          v-for="(item, index) in giftForm.cdkSet"
                          :key="index"
                          class="cdkSetClass"
                        >
                          <el-form
                            :model="item"
                            label-width="80px"
                            :disabled="item.disabled"
                          >
                            <el-form-item label="奖品名称">
                              <el-input
                                v-model="item.desc"
                                clearable
                                style="width: 150px"
                                placeholder="请输入奖品名称"
                                @change="saveCdkConfig(item, index)"
                              />
                            </el-form-item>
                            <el-form-item label="兑换码">
                              <div>
                                <el-upload
                                  class="upload-demo"
                                  accept=".xls, .xlsx"
                                  :action="`${url}user/prize/cdk/import/?projectKey=${projectKey}&desc=${item.desc}`"
                                  :headers="getUploadHeader"
                                  :before-upload="
                                    (file) => {
                                      return beforeUploadFile(file, item);
                                    }
                                  "
                                  :on-success="
                                    (response, file, fileList) => {
                                      return uploadFile(
                                        response,
                                        file,
                                        fileList,
                                        item,
                                        index
                                      );
                                    }
                                  "
                                  :on-error="handleError"
                                  :limit="1"
                                  :file-list="item.fileList"
                                >
                                  <el-button
                                    type="plain"
                                    icon="el-icon-upload2"
                                    style="color: #606266"
                                  >
                                    上传文件
                                  </el-button>
                                </el-upload>
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
                                  @click="downloadFile"
                                >
                                  下载模板
                                </el-button>
                              </div>
                            </el-form-item>
                          </el-form>
                          <el-button
                            @click="deletePercentage(item, index)"
                            type="text"
                            icon="el-icon-delete"
                            style="
                              font-size: 16px;
                              color: #f56c6c;
                              position: absolute;
                              right: 40px;
                              top: 20px;
                            "
                          />
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
                      @change="saveGiftSetting"
                    >
                      <el-option
                        v-for="(item, index) in sendGiftTypeOptions"
                        :key="index"
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
                        @change="saveGiftSetting"
                      >
                        <span>100%中奖</span>
                        <el-tooltip
                          content="当奖品全部发放完毕，问卷自动停止，后来参与问卷的用户无法访问问卷"
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
                        @change="saveGiftSetting"
                      >
                        其他
                        <div
                          v-if="giftForm.percentage == 'other'"
                          style="display: inline; margin-left: 10px"
                        >
                          <el-input
                            :min="2"
                            type="number"
                            v-model="giftPercentage"
                            @change="saveGiftSetting"
                          />
                          <span
                            style="margin-left: 5px"
                          >个参与者有一个中奖</span>
                          <el-tooltip
                            content="当奖品全部发放完毕，后来参与问卷的用户可正常填写问卷，默认不中奖"
                            placement="top"
                          >
                            <i
                              class="el-icon-question"
                              style="margin-left: 10px"
                            />
                          </el-tooltip>
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
              <div>
                <div style="text-align: right">
                  <el-button
                    type="plain"
                    icon="el-icon-download"
                    @click="exportGiftData"
                    style="color: #409eff"
                  >
                    导出数据
                  </el-button>
                </div>
                <div>
                  <el-table
                    :data="getGiftData"
                    style="width: 100%"
                    height="500"
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
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize"
                  :current-page="currentPage"
                  style="text-align: center; margin-top: 10px"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane name="role">
        <span
          slot="label"
        ><i class="el-icon-date" /> &nbsp;&nbsp;角色设置</span>
        <div class="roleConfig">
          <p>角色设置</p>
          <el-form
            ref="roleForm"
            :model="roleForm"
            label-width="80px"
          >
            <el-form-item label="分配方式">
              <el-select
                v-model="roleForm.distributionType"
                placeholder="请选择"
                @change="changeDistributionType"
              >
                <el-option
                  v-for="(item, index) in distributionTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="分配角色"
              v-if="roleForm.distributionType == 'fix'"
            >
              <el-select
                v-model="roleForm.distributionRole"
                placeholder="请选择"
                @change="saveRoleLogic"
              >
                <el-option
                  v-for="(item, index) in distributionRoleOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="分配规则"
              v-else
            >
              <div class="roleSet">
                <div class="roleSetScroll">
                  <div
                    v-for="(item, index) in roleForm.distributionRule"
                    :key="index"
                  >
                    <div class="roleSetClass">
                      <div class="roleItem">
                        <div
                          v-for="(logicItem, logicIndex) in item.logic"
                          :key="logicIndex"
                          style="margin-bottom: 10px"
                        >
                          <span style="margin-right: 10px">如果</span>
                          <el-select
                            v-model="logicItem.formItemId"
                            placeholder="请选择题目"
                          >
                            <el-option
                              v-for="questionItem in questionOptions"
                              :key="questionItem.value"
                              :label="questionItem.label"
                              :value="questionItem.formItemId"
                            />
                          </el-select>
                          <el-select
                            v-model="logicItem.expression"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="expressionItems in expressionOptions"
                              :key="expressionItems.value"
                              :label="expressionItems.label"
                              :value="expressionItems.value"
                            />
                          </el-select>
                          <el-select
                            v-model="logicItem.optionValue"
                            placeholder="请选择选项"
                          >
                            <el-option
                              v-for="optionValueOptionsItem in getFormItemOptions(
                                logicItem.formItemId
                              )"
                              :key="optionValueOptionsItem.value"
                              :label="optionValueOptionsItem.label"
                              :value="optionValueOptionsItem.value"
                            />
                          </el-select>
                          <i
                            class="el-icon-circle-plus-outline addIcon"
                            style="color: #409eff"
                            @click="addLogicItem(index)"
                          />
                          <i
                            class="el-icon-delete addIcon"
                            style="color: #f56c6c; margin-left: 10px"
                            @click="deleteLogicItem(index, logicIndex, item)"
                          />
                        </div>
                      </div>
                      <div class="roleItemBottom">
                        <span style="margin-right: 10px">则分配</span>
                        <el-select
                          v-model="item.role"
                          placeholder="请选择"
                          @change="selectRoleLogic(item, index)"
                        >
                          <el-option
                            v-for="itemf in distributionRoleOptions"
                            :key="itemf.value"
                            :label="itemf.label"
                            :value="itemf.value"
                          />
                        </el-select>
                        <span>,否则不分配</span>
                      </div>
                      <el-button
                        @click="deleteRoleItem(item, index)"
                        type="text"
                        icon="el-icon-delete"
                        style="
                          font-size: 16px;
                          color: #f56c6c;
                          position: absolute;
                          right: 40px;
                          top: 20px;
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="addDistributionRule"
              >
                添加
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "ProjectSetting",
  data() {
    return {
      id: "",
      url: process.env.VUE_APP_API_ROOT,
      activeName: "answer",
      projectKey: null,
      wxWrite: false,
      empower: false,
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
      timeStart: false,
      timeEnd: false,
      startTime: "",
      endTime: "",
      // 礼物设置
      giftActiveName: "1",
      giftForm: {
        //积分1 ;CDK 0
        giftType: 1,
        sendGiftType: 1,
        percentage: "other",
        coreSet: [
          {
            desc: 10,
            count: "",
            flag: 0, //判断不限还是自定义数量
            id: "",
            disabled: false,
          },
        ],
        cdkSet: [
          {
            desc: "",
            count: "",
            id: "",
            disabled: false,
            //上传配置
            fileList: [],
          },
        ],
      },
      sendGiftTypeOptions: [
        {
          label: "单份问卷填完即发",
          value: 1,
        },
        {
          label: "问卷收集截止后发",
          value: 0,
        },
      ],
      giftPercentage: 2,
      getGiftData: [],
      roleForm: {
        id: "",
        distributionType: "fix",
        distributionRole: "", //被分配的角色
        distributionRule: [
          {
            logic: [{ formItemId: "", expression: "", optionValue: "" }],
            role: "",
            id: "",
          },
        ],
      },
      distributionTypeOptions: [
        {
          label: "所有参与者分配固定角色",
          value: "fix",
        },
        {
          label: "按答题选项分配不同角色",
          value: "different",
        },
      ],
      distributionRoleOptions: [],
      questionOptions: [],
      expressionOptions: [
        { label: "选中", value: "eq" },
        { label: "未选中", value: "ne" },
      ],
      //是否拥有积分商城
      scoreShop: true,
      //奖品查询分页
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //id信息
      guildId: "",
    };
  },
  computed: {
    getUploadHeader() {
      let fbtoken = localStorage.getItem("fbtoken");
      let token = localStorage.getItem("token");
      return {
        fbtoken,
        token,
      };
    },
    getUploadUrl() {
      return `${process.env.VUE_APP_API_ROOT}project/file/upload/${this.projectKey}`;
    },
    getUserInfo() {
      return JSON.parse(this.$store.getters["user/userInfo"]);
    },
  },
  mounted() {
    this.projectKey = this.$route.query.key;
    this.queryUserProjectSetting();
    window.fb.getCurrentGuild().then((res) => {
      this.guildId = res.id;
    });
  },
  methods: {
    //自定义输入框格式处理
    changeInput(item, index) {
      let str = String(item.count).replace(".", "");
      this.giftForm.coreSet[index].count = Number(str) == 0 ? "" : Number(str);
    },
    //切换奖品设置页签
    handleClick(tab) {
      if (tab.name == "1") {
        if (this.giftForm.giftType) {
          this.queryGiftSetting(true);
        } else {
          this.queryGiftSetting();
        }
      } else if (tab.name == "2") {
        this.getReceiveGiftData();
      }
    },
    //添加奖品规则
    addPercentage() {
      if (this.giftForm.giftType) {
        this.giftForm.coreSet.push({
          desc: 10,
          count: "",
          flag: 0,
          disabled: false,
        });
      } else if (!this.giftForm.giftType) {
        this.giftForm.cdkSet.push({
          desc: "",
          count: "",
          disabled: false,
          fileList: [],
        });
      }
    },
    //删除奖品分配规则
    deletePercentage(item, index) {
      if (this.giftForm.giftType) {
        this.giftForm.coreSet.splice(index, 1);
        this.deleteScore(item, index);
        if (this.giftForm.coreSet.length < 1) {
          this.addPercentage();
        }
      } else if (!this.giftForm.giftType) {
        this.giftForm.cdkSet.splice(index, 1);
        this.deleteScore(item, index);
        if (this.giftForm.cdkSet.length < 1) {
          this.addPercentage();
        }
      }
    },
    //删除角色分配规则
    deleteRoleItem(item, index) {
      this.roleForm.distributionRule.splice(index, 1);
      if (this.roleForm.distributionRule.length < 1) {
        this.addDistributionRule();
      }
    },
    //添加角色分配规则
    addDistributionRule() {
      this.roleForm.distributionRule.push({
        logic: [{ formItemId: "", expression: "", optionValue: "" }],
        role: "",
        id: "",
      });
    },
    //添加角色分配中题目规则
    addLogicItem(index) {
      this.roleForm.distributionRule[index].logic.push({
        formItemId: "",
        expression: "",
        optionValue: "",
      });
    },
    //删除角色分配中题目规则
    deleteLogicItem(index, logicIndex, item) {
      this.roleForm.distributionRule[index].logic.splice(logicIndex, 1);
      if (this.roleForm.distributionRule[index].logic.length < 1) {
        this.addLogicItem(index);
      }
      this.selectRoleLogic(item, index);
    },
    //主页签切换
    tabChange(tab) {
      if (tab.name == "gift") {
        this.queryGiftSetting(true);
        this.giftForm.giftType = this.scoreShop ? 1 : 0;
      } else if (tab.name == "answer") {
        this.queryUserProjectSetting();
      } else if (tab.name == "role") {
        this.getRoleList();
        this.getRoleLogic();
      }
    },
    exchangeTime(time) {
      var d = time ? new Date(time) : new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var hours = d.getHours();
      var min = d.getMinutes();
      var seconds = d.getSeconds();

      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      if (hours < 0) hours = "0" + hours;
      if (min < 10) min = "0" + min;
      if (seconds < 10) seconds = "0" + seconds;

      return (
        year + "-" + month + "-" + day + " " + hours + ":" + min + ":" + seconds
      );
    },

    //获取答题设置
    queryUserProjectSetting() {
      this.$api.get(`/user/project/setting/${this.projectKey}`).then((res) => {
        if (res.data) {
          let data = res.data;
          this.wxWrite = data.wxWrite;
          this.empower = data.empower;
          this.inputFanbookIdOnce = data.wxWriteOnce;
          if (data.everyoneWriteOnce) {
            this.inputTimes = true;
            this.inputTimesNum = data.everyoneWriteOnce;
          }
          if (data.startTime || data.endTime) {
            this.setTime = true;
            if (data.startTime) {
              this.timeStart = true;
            }
            if (data.endTime) {
              this.timeEnd = true;
            }
            this.startTime = data.startTime;
            this.endTime = data.endTime;
          }
        }
      });
    },
    //保存答题配置
    saveUserProjectSetting() {
      let params = {
        projectKey: this.projectKey,
        wxWrite: this.wxWrite,
        empower: this.empower,
        wxWriteOnce: this.inputFanbookIdOnce,
        everyoneWriteOnce: this.inputTimes ? this.inputTimesNum : 0,
        startTime: this.setTime && this.timeStart ? this.startTime : "",
        endTime: this.setTime && this.timeEnd ? this.endTime : "",
      };
      this.$api
        .post("/user/project/setting/save", params)
        .then((res) => {
          if (res.data && res.code == 200) {
            this.$message.success("设置成功");
          } else {
            this.$message.error("设置失败");
          }
          this.queryUserProjectSetting();
        })
        .catch(() => {
          this.queryUserProjectSetting();
        });
    },
    //获取奖品配置
    queryGiftSetting(type) {
      this.$api(
        // .post(`/user/prize/setting/query?projectKey=${this.projectKey}`)
        {
          url: `/user/prize/setting/query`,
          method: "post",
          params: { projectKey: this.projectKey },
        }
      ).then((res) => {
        this.giftForm.sendGiftType = res.data.type;
        if (res.data.probability == 1) {
          this.giftForm.percentage = "must";
        } else {
          this.giftPercentage = res.data.probability;
        }
        if (res.data.prizes && res.data.prizes.length > 0) {
          let coreSetArr = res.data.prizes.filter((item) => {
            if (item.type) {
              return item;
            }
          });
          let cdkSetArr = res.data.prizes.filter((item) => {
            if (!item.type) {
              return item;
            }
          });
          if (type) {
            this.giftForm.coreSet = coreSetArr.map((item) => {
              return {
                desc: item.desc,
                count: item.count == 0 ? "" : item.count,
                flag: item.count == 0 ? 1 : 0,
                id: item.id,
                disabled: true,
              };
            });
            if (this.giftForm.coreSet.length < 1) {
              this.addPercentage();
            }
          } else {
            this.giftForm.cdkSet = cdkSetArr.map((item) => {
              return {
                desc: item.desc,
                count: "",
                id: item.id,
                disabled: true,
              };
            });
            if (this.giftForm.cdkSet.length < 1) {
              this.addPercentage();
            }
          }
        }
      });
    },
    //保存奖品设置
    saveGiftSetting() {
      let params = {
        id: this.id || null,
        projectKey: this.projectKey,
        type: this.giftForm.sendGiftType,
        probability:
          this.giftForm.percentage == "must" ? 1 : Number(this.giftPercentage),
      };
      this.$api.post(`/user/prize/setting/save`, params).then((res) => {
        if (res.data && res.code == 200) {
          this.id = res.data.id;
          this.$message.success("发奖规则设置成功");
        }
      });
    },
    //获取奖品领取情况
    getReceiveGiftData() {
      this.$api
        .post(
          `/user/prize/win?projectKey=${this.projectKey}&page=${this.currentPage}&limit=${this.pageSize}`
        )
        .then((res) => {
          this.total = res.data.count;
          this.getGiftData = res.data.data.map((item) => {
            return {
              type: item.type == 1 ? "积分" : "CDK",
              gift: item.prize,
              time: this.exchangeTime(item.getTime),
              id: item.fanbookid,
              name: item.nickname,
              phone: item.phoneNumber,
            };
          });
        });
    },
    //分页方法
    handleSizeChange(val) {
      this.pageSize = val;
      this.getReceiveGiftData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getReceiveGiftData();
    },
    //导出方法
    exportFunction(res, name) {
      let blob = new Blob([res.data]);
      let downloadElement = document.createElement("a");
      let href = window.URL.createObjectURL(blob); // 创建下载的链接
      downloadElement.href = href;
      downloadElement.download =
        name + this.$dayjs().format("YYYYMMDDHHMM") + ".xls"; // 下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
    },
    //导出奖品领取情况
    exportGiftData() {
      this.$axios({
        url: `${process.env.VUE_APP_API_ROOT}user/prize/export?projectKey=${this.projectKey}`,
        method: "post",
        responseType: "blob",
        headers: {
          token: localStorage.getItem("token"),
          fbtoken: localStorage.getItem("fbtoken"),
        },
      }).then((res) => {
        this.exportFunction(res, "奖品领取情况");
      });
    },
    //下载cdk模板
    downloadFile() {
      this.$axios({
        url: `${process.env.VUE_APP_API_ROOT}user/prize/model`,
        method: "post",
        responseType: "blob",
        headers: {
          token: localStorage.getItem("token"),
          fbtoken: localStorage.getItem("fbtoken"),
        },
      }).then((res) => {
        this.exportFunction(res, "兑换码模板");
      });
    },
    //保存CDK配置
    saveCdkConfig(item, index) {
      if (this.giftForm.cdkSet[index].fileList.length > 0) {
        this.$api
          .post(
            `/user/prize/cdk/import?projectKey=${this.projectKey}&desc=${item.desc}`
          )
          .then(() => {
            this.queryGiftSetting();
          });
      } else {
        this.$message.warning("请上传CDK模板!");
      }
    },
    //上传文件(同CDK配置项保存)
    uploadFile(response, file, fileList, item) {
      console.log(222, item, response, file, fileList);
      if (response.code == 200 && response.data) {
        this.$message({ type: "success", message: "上传成功" });
        this.queryGiftSetting();
      } else {
        this.$message({ type: "error", message: response.msg });
      }
      // this.$api.post(
      //   `/user/prize/cdk/import?projectKey=${this.projectKey}&desc=${item.desc}`
      // );
    },
    beforeUploadFile(file, item) {
      if (!item.desc) {
        this.$message({ type: "error", message: "请填写cdk名称" });
        return;
      }
      console.log("🍓 file beforeUpload: ", file);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!/^.+(\.xls|\.xlsx)$/.test(file.name)) {
        this.$message({
          type: "error",
          message: "请使用正确的文件格式进行导入",
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 4MB!",
          type: "error",
          duration: 6000,
        });
        return false;
      }
    },
    handleError() {
      this.$message.error("文件上传失败");
    },
    //获取角色列表
    getRoleList() {
      let params = {
        token: process.env.VUE_APP_API_ROOT_TOKEN,
        guildId: this.guildId || "420861300550139904",
        roleId: "",
      };
      this.$api.post(`admin/fanbook/pullroles`, params).then((res) => {
        let position = res.data.filter((item) => {
          if (item.tag && item.tag.botId == process.env.VUE_APP_botId) {
            return item;
          }
        })[0];
        let filterArr = res.data.filter((item) => {
          return (
            item.position < position.position && !(item.tag && item.tag.botId)
          );
        });
        this.distributionRoleOptions = filterArr.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      });
    },
    //添加积分奖励
    addScore(item) {
      if (item.desc && (item.flag || item.count)) {
        let params = {
          projectKey: this.projectKey,
          desc: item.desc,
          count: item.flag ? 0 : Number(item.count),
        };
        this.$api.post(`/user/prize/score/save`, params).then((res) => {
          if (res.data && res.code) {
            this.$message.success("添加积分分配成功");
            this.queryGiftSetting(true);
          } else {
            this.$message.error("添加积分分配失败");
          }
        });
      }
    },
    //删除积分奖励
    deleteScore(item) {
      if (item.desc) {
        let params = {
          projectKey: this.projectKey,
          id: item.id,
          type: this.giftForm.giftType,
          count: this.giftForm.giftType ? item.count : "",
          desc: item.desc,
        };
        this.$api.post(`/user/prize/delete`, params).then((res) => {
          if (res.data && res.code) {
            this.$message.success("删除积分分配成功");
            this.queryGiftSetting(true);
          } else {
            this.$message.error("删除积分分配失败");
          }
        });
      }
    },
    //切换角色选项
    changeDistributionType() {
      this.getRoleLogic();
      this.getRoleList();
      if (this.roleForm.distributionType == "different") {
        this.queryProjectItems();
      }
    },
    //获取角色逻辑分配
    getRoleLogic() {
      this.$api
        .post(`/user/role/view?projectKey=${this.projectKey}`)
        .then((res) => {
          let fixRole = res.data.filter((item) => {
            if (!item.roleType) {
              return item;
            }
          });
          let differentRole = res.data.filter((item) => {
            if (item.roleType) {
              return item;
            }
          });
          if (this.roleForm.distributionType == "fix") {
            this.roleForm.id = fixRole.length > 0 ? fixRole[0].id : "";
            this.roleForm.distributionRole =
              fixRole.length > 0 ? fixRole[0].formItemId : "";
          }
          if (
            this.roleForm.distributionType == "different" &&
            differentRole.length > 0
          ) {
            this.roleForm.distributionRule = differentRole.map((item) => {
              return {
                logic: item.conditionList,
                role: item.formItemId,
                id: item.id,
              };
            });
          }
        });
    },
    //保存角色逻辑
    saveRoleLogic(item, index) {
      let params = {};
      if (this.roleForm.distributionType == "fix") {
        params.id = this.roleForm.id;
        params.formItemId = this.roleForm.distributionRole;
        params.roleType = false;
        params.projectKey = this.projectKey;
        params.expression = 2;
        params.conditionList = [];
        params.type = 3;
      }
      if (this.roleForm.distributionType == "different") {
        params.projectKey = this.projectKey;
        params.roleType = true;
        params.formItemId = this.roleForm.distributionRule[index].role;
        params.conditionList = item;
        params.expression = 2;
        params.type = 3;
      }
      this.$api.post(`/user/project/logic/save`, params).then((res) => {
        if (res.data && res.code == 200) {
          this.$message.success("保存角色分配成功");
          if (this.roleForm.distributionType == "fix") {
            this.roleForm.distributionRole = res.data.formItemId;
          }
          if (this.roleForm.distributionType == "different") {
            this.roleForm.distributionRule[index].id = res.data.formItemId;
          }
        } else {
          this.$message.error("保存角色分配失败");
        }
      });
    },
    //选择分配规则分配角色
    selectRoleLogic(item, index) {
      let arr = item.logic.filter((items) => {
        if (items.formItemId && items.expression && items.optionValue) {
          return items;
        }
      });
      if (arr.length > 0) {
        this.saveRoleLogic(arr, index);
      }
    },
    //获取所有题型
    queryProjectItems() {
      this.$api
        .get("/user/project/item/list", { params: { key: this.projectKey } })
        .then((res) => {
          //过滤掉不支持的题目类型
          let questionArr = res.data.filter((item) => {
            return ["RADIO", "CHECKBOX", "SELECT"].includes(item.type);
          });
          this.questionOptions = questionArr;
        });
    },
    //获取指定题型下选项
    getFormItemOptions(formItemId) {
      let formItem = this.questionOptions.find(
        (item) => item.formItemId == formItemId
      );
      if (formItem) {
        return formItem.expand.options;
      }
      return [];
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
.giftConfig
  ::v-deep
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  background-color: #fff;
  color: initial;
}
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
.coreSet,
.roleSet {
  width: 100%;
  background-color: #f2f2f2;
  padding: 15px 15px 0;
}
.coreSetClass,
.cdkSetClass,
.roleSetClass {
  border-bottom: 3px solid #fff;
  padding: 10px 0;
  position: relative;
}
.coreSetScroll,
.roleSetScroll {
  height: 325px;
  overflow: auto;
}
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}
.roleConfig ::v-deep .el-form-item__label {
  text-align: left;
}
.roleItem {
  padding: 10px;
  border-bottom: 1px solid #e4e7ed;
}
.roleItem .el-select,
.roleItemBottom .el-select {
  margin-right: 10px;
}
.roleItem .el-select:nth-child(2) {
  width: 162px;
}
.roleItem .el-select:nth-child(3) {
  width: 100px;
}
.roleItemBottom {
  padding: 10px;
}
.roleItemBottom .el-select:nth-child(2) {
  width: 150px;
}
.addIcon {
  cursor: pointer;
}
</style>