<script>
import { deepClone } from "@/utils/index";
import { evalExpression } from "@/utils/expression";
import render from "@/components/render/render.js";
import _ from "lodash";
import { componentDefaultValue } from "@/components/generator/config.js";

const ruleTrigger = {
  "el-input": "blur",
  "el-input-number": "blur",
  "el-select": "change",
  "el-radio-group": "change",
  "el-checkbox-group": "change",
  "el-cascader": "change",
  "el-time-picker": "change",
  "el-date-picker": "change",
  "el-rate": "change",
  "image-select": "change",
};

const processType = {
  "el-select": "__slot__.options",
  "el-cascader": "options",
  "el-radio-group": "__slot__.options",
  "el-checkbox-group": "__slot__.options",
  "image-select": "options",
  "my-checkbox-group": "__slot__.options"
};

const layouts = {
  colFormItem(h, scheme) {
    const config = scheme.__config__;
    const listeners = buildListeners.call(this, scheme);
    const { formConfCopy } = this;
    console.log("formConfCopy", formConfCopy);
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    let label = config.label;
    // 显示序号
    if (formConfCopy.showNumber) {
      if (scheme.__config__.labelIndex) {
        label = scheme.__config__.labelIndex + ": " + label;
      }
    }
    // 分页返回上一页时把值设置回表单
    let value = _.get(this[this.formConf.formModel], scheme.__vModel__);
    if (value) {
      config.defaultValue = value;
    }
    // 逻辑隐藏后赋值默认值
    if (!config.logicShow) {
      config.defaultValue = value;
    }
    // 表单被重新渲染 控制逻辑显示隐藏
    let triggerShow = _.indexOf(this.logicTriggerItemList, config.formId) > -1;
    let colStyle = scheme.logicShow || triggerShow ? "" : "display:none";
    let cidAttr = config.formId;
    return (
      <el-col span={config.span} style={colStyle} cid={cidAttr}>
        <el-form-item
          label-width={labelWidth}
          prop={scheme.__vModel__}
          label={config.showLabel ? label : ""}
        >
          {config.titleTip ? (
            <div class="titleTip" domPropsInnerHTML={config.titleTipText}></div>
          ) : (
            ""
          )}
          <render conf={scheme} {...{ on: listeners }} />
        </el-form-item>
      </el-col>
    );
  },
  rowFormItem(h, scheme) {
    let child = renderChildren.apply(this, arguments);
    if (scheme.type === "flex") {
      child = (
        <el-row
          type={scheme.type}
          justify={scheme.justify}
          align={scheme.align}
        >
          {child}
        </el-row>
      );
    }
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>{child}</el-row>
      </el-col>
    );
  },
};

function renderFrom(h) {
  const { formConfCopy } = this;

  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.fields)}
        {formConfCopy.formBtns && formBtns.call(this, h)}
      </el-form>
    </el-row>
  );
}

// eslint-disable-next-line no-unused-vars
function formBtns(h) {
  const { formConfCopy } = this;
  let style = {
    "background-color": formConfCopy.submitBtnColor,
    "border-color": formConfCopy.submitBtnColor,
  };
  let btnSpan = 24;
  if (formConfCopy.resetBtn) {
    return (
      <el-col>
        <el-form-item size="large" style="margin-top:30px">
          <el-row>
            <el-col span="4" offset="6">
              <el-button type="primary" onClick={this.submitForm}>
                提交
              </el-button>
            </el-col>
            <el-col span="9" offset="3">
              <el-button onClick={this.resetForm}>重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    );
  }
  return (
    <el-col>
      <el-form-item
        size="large"
        class="submit-btn-form-item"
        style="margin-top:30px;"
      >
        <el-row type="flex" justify="center">
          <el-col span={btnSpan}>
            <el-button style={style} type="primary" onClick={this.submitForm}>
              {this.formConfCopy.submitBtnText}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-col>
  );
}

function renderFormItem(h, elementList) {
  console.log("renderFormItem", elementList);
  return elementList.map((scheme) => {
    const config = scheme.__config__;
    const layout = layouts[config.layout];

    if (layout) {
      return layout.call(this, h, scheme);
    }
    throw new Error(`没有与${config.layout}匹配的layout`);
  });
}

function renderChildren(h, scheme) {
  const config = scheme.__config__;
  if (!Array.isArray(config.children)) return null;
  return renderFormItem.call(this, h, config.children);
}

function setUpload(config, scheme, response, file) {
  let newValue = JSON.parse(
    this[this.formConf.formModel][scheme.__vModel__]?.length == 0
      ? null
      : this[this.formConf.formModel][scheme.__vModel__]
  );
  if (!newValue) {
    newValue = [];
  }
  newValue.push({ fileName: file.name, url: response.data });
  this.$set(config, "defaultValue", newValue);
  this.$set(this[this.formConf.formModel], scheme.__vModel__, newValue);
  setValueLabel.call(this, { type: "file", files: newValue }, config, scheme);
}

function deleteUpload(config, scheme, file, fileList) {
  let newValue = [];
  fileList.forEach((element) => {
    newValue.push({ fileName: element.name, url: element.url });
  });
  this.$set(config, "defaultValue", newValue);
  this.$set(this[this.formConf.formModel], scheme.__vModel__, newValue);
  setValueLabel.call(this, { type: "file", files: newValue }, config, scheme);
}

function setValue(event, config, scheme) {
  console.log("setValue,event/config/scheme", event, config, scheme);
  
  //兼容矩阵组件传值
  if (config.tag == "matrix-scale" || config.tag == "matrix-select") {
    this.$set(config, "defaultValue", event[0]);
    this.$set(this[this.formConf.formModel], scheme.__vModel__, event[1]);
    this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, event[0]);
  } else {
    this.$set(config, "defaultValue", event);
    this.$set(this[this.formConf.formModel], scheme.__vModel__, event);
    setValueLabel.call(this, event, config, scheme);
  }
  let logicShowRule = this.formConfCopy.logicShowRule;
  if (!logicShowRule) {
    return;
  }
  // 找到该问题需要触发显示的问题 判断逻辑是否成立
  let rules = _.get(logicShowRule, config.formId);
  if (rules && Array.isArray(rules)) {
    rules.forEach((r) => {
      // 成立让该对应的问题显示出来
      let flag = evalExpression(
        this[this.formConf.formModel],
        r.logicExpression
      );
      if (r.type == 2) {
        flag = !flag;
      }
      // 参与逻辑设置的表单项
      let logicItem = this.formConf.fields.find(
        (a) => a.formItemId == r.triggerFormItemId
      );
      if (flag) {
        // 防止表单重新渲染 display被刷新
        this.logicTriggerItemList.push(r.triggerFormItemId);
        console.log(this.logicTriggerItemList);
        document.querySelector(
          `div[cid="${r.triggerFormItemId}"]`
        ).style.display = "";
        // 重置逻辑校验
        logicItem.logicShow = true;
        this[this.formConf.formRules] = {};
        this.logicRules(
          this.formConfCopy.fields,
          this[this.formConf.formRules],
          r.arr,
          true
        );
      } else {
        _.remove(this.logicTriggerItemList, function (n) {
          return n == r.triggerFormItemId;
        });
        document.querySelector(
          `div[cid="${r.triggerFormItemId}"]`
        ).style.display = "none";
        // 隐藏表单校验
        logicItem.logicShow = false;
        this[this.formConf.formRules] = {};
        this.logicRules(
          this.formConfCopy.fields,
          this[this.formConf.formRules],
          r.arr,
          false
        );
        // 默认值
        let resetValConfig = componentDefaultValue[logicItem.typeId];
        if (resetValConfig) {
          this.$set(
            this[this.formConf.labelFormModel],
            logicItem.__vModel__,
            resetValConfig.val
          );
          this.$set(
            this[this.formConfCopy.formModel],
            logicItem.__vModel__,
            resetValConfig.val
          );
        }
      }
    });
  }
}

/**
 * 分页下一页
 */
function nextPage(page) {
  switchPage.call(this, "next", page);
}

/**
 * 分页上一页
 */
function prevPage(page) {
  switchPage.call(this, "prev", page);
}

/**
 * 切换页
 */
function switchPage(eventName, page) {
  this.$refs[this.formConf.formRef].validate((valid) => {
    console.log("switchPage", valid);
    if (!valid) {
      setTimeout(() => {
        let isError = document.getElementsByClassName("is-error");
        isError[0].querySelector("input").focus();
      }, 100);
      return false;
    } else {
      this.$emit(eventName, {
        page: page,
        formModel: this[this.formConf.formModel],
        labelFormModel: this[this.formConf.labelFormModel],
      });
    }
    return true;
  });
}

/**
 * radio checkbox 其他输入框值处理
 */
function setOtherValueLabel(event, config) {
  let value = this[this.formConf.formModel][config.__vModel__];
  // 临时保存其他的选项值
  this.$nextTick(() => {
    this.$set(
      this[this.formConf.labelFormModel],
      `${config.__vModel__}other`,
      event
    );
    console.log("setOtherValueLabel", this[this.formConf.labelFormModel]);
    setValueLabel.call(this, value, config.__config__, config);
  });
}

/**
 *  this.formConf.formModel 保存表单的原始值 如checkbox radio的值是 1,2,3等
 *  this.formConf.labelFormModel 保存显示的值 如选项一 选项二等
 * 保存选项的label值
 * @param event
 * @param config
 * @param scheme
 */
function setValueLabel(event, config, scheme) {
  // 需要处理的类型 如果是input等则不需要处理
  let tagOptionKey = processType[config.tag];
  if (tagOptionKey) {
    if (event instanceof Array) {
      // 多选 其他自定义输入
      let labelArr = new Array();
      // if (!event.includes(0)) {
      //   // 如果多选里没有选择其他，就清掉other
      //   this.$set(
      //     this[this.formConf.labelFormModel],
      //     `${scheme.__vModel__}other`,
      //     ""
      //   );
      //   // 同时把输入框清空
      //   let otherInput = document
      //     .querySelector("." + config.tag)
      //     .querySelector(".item-other-input");
      //   if (otherInput) {
      //     otherInput.value = "";
      //   }
      // }
      event.forEach((item) => {
        // 拼到头部 其他选项
        let { label } = getObject(_.get(scheme, tagOptionKey), "value", item);
        labelArr.push(label);
      });
      this.$set(
        this[this.formConf.labelFormModel],
        scheme.__vModel__,
        labelArr.join(",")
      );
    } else {
      // 单选 其他自定义输入
      if (event == 0) {
        // 如果选择了其他，把label存在field字段，把输入框内容存在fieldother字段
        let item = _.find(_.get(scheme, tagOptionKey), { value: event });
        this.$set(
          this[this.formConf.labelFormModel],
          scheme.__vModel__,
          item.label
        );
        this.$set(
          this[this.formConf.labelFormModel],
          `${scheme.__vModel__}other`,
          this[this.formConf.labelFormModel][`${scheme.__vModel__}other`]
        );
      } else {
        let item = _.find(_.get(scheme, tagOptionKey), { value: event });
        this.$set(
          this[this.formConf.labelFormModel],
          scheme.__vModel__,
          item.label
        );
        // 如果没有选择其他，就清掉other
        // this.$set(
        //   this[this.formConf.labelFormModel],
        //   `${scheme.__vModel__}other`,
        //   ""
        // );
        // 同时把输入框清空
        // let otherInput = document
        //   .querySelector("." + config.tag)
        //   .querySelector(".item-other-input");
        // if (otherInput) {
        //   otherInput.value = "";
        // }
      }
    }
  } else if (config.tag === "el-upload") {
    this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, event);
  } else {
    this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, event);
  }
}

function getObject(array, key, value) {
  let o;
  array.some(function iter(a) {
    if (a[key] === value) {
      o = a;
      return true;
    }
    return Array.isArray(a.children) && a.children.some(iter);
  });
  return o;
}

function buildListeners(scheme) {
  const config = scheme.__config__;
  const methods = this.formConf.__methods__ || {};
  const listeners = {};

  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach((key) => {
    listeners[key] = (event) => methods[key].call(this, event);
  });
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = (event) => setValue.call(this, event, config, scheme);
  listeners.upload = (response, file, fileList) =>
    setUpload.call(this, config, scheme, response, file, fileList);
  listeners.deleteUpload = (file, fileList) =>
    deleteUpload.call(this, config, scheme, file, fileList);
  listeners.otherChange = (event, config) =>
    setOtherValueLabel.call(this, event, config);
  listeners.prev = (page) => prevPage.call(this, page);
  listeners.next = (page) => nextPage.call(this, page);
  return listeners;
}

export default {
  components: {
    render,
  },
  props: {
    formConf: {
      type: Object,
      required: true,
    },
    formModel: {
      type: Object,
      required: false,
    },
    labelFormModel: {
      type: Object,
      required: false,
    },
  },
  data() {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: deepClone(this.formModel),
      [this.formConf.labelFormModel]: deepClone(this.labelFormModel),
      [this.formConf.formRules]: {},
      // 已经被触发显示的问题
      logicTriggerItemList: [],
    };
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel]);
    this.initLabelFormData(
      data.formConfCopy.fields,
      data[this.formConf.labelFormModel]
    );
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules]);
    return data;
  },
  methods: {
    initLabelFormData(componentList, formData) {
      // 获取选择项选中的显示的值
      componentList.forEach((cur) => {
        let temConfig = cur.__config__;
        if (cur.__vModel__ && !formData[cur.__vModel__]) {
          let tagOptionKey = processType[temConfig.tag];
          let defaultValue = temConfig.defaultValue;
          let labelStr = "";
          if (tagOptionKey && defaultValue) {
            if (defaultValue instanceof Array) {
              defaultValue.forEach((item) => {
                if (item) {
                  let labelItem = getObject(
                    _.get(cur, tagOptionKey),
                    "value",
                    item
                  );
                  if (labelItem) {
                    labelStr += labelItem.label + ",";
                  }
                }
              });
              formData[cur.__vModel__] = labelStr;
            } else {
              let { label } = _.find(_.get(cur, tagOptionKey), {
                value: defaultValue,
              });
              formData[cur.__vModel__] = label;
            }
          }
        }
        if (temConfig.children)
          this.initLabelFormData(temConfig.children, formData);
      });
      console.log("initLabelFormData", formData);
    },
    initFormData(componentList, formData) {
      console.log("initFormData", formData);
      // 设置默认值
      componentList.forEach((cur) => {
        const config = cur.__config__;
        if (cur.__vModel__ && !formData[cur.__vModel__]) {
          // 如果存在分页带回的数据 则不再设置默认
          formData[cur.__vModel__] = config.defaultValue;
        }
        if (config.children) this.initFormData(config.children, formData);
      });
    },
    buildRules(componentList, rules) {
      console.log("buildRules", componentList, rules);
      componentList.forEach((cur) => {
        console.log("先校验还是后校验");
        // 逻辑不显示必填问题不校验
        let triggerShow =
          _.indexOf(this.logicTriggerItemList, cur.formItemId) > -1;
        let flag = cur.logicShow || triggerShow ? "" : "display:none";
        const config = cur.__config__;
        if (cur.tag === "el-upload") {
          config.regList.push({
            validator: () => {
              console.log(cur.limit);
            },
            trigger: "change",
          });
        }
        // 处理其他输入必填校验
        const validateOtherInput = (rule, value, callback) => {
          // 0 等于选中其他
          if (value == 0 || (Array.isArray(value) && value.includes(0))) {
            if (!this[this.formConf.labelFormModel][`${rule.field}other`]) {
              callback(new Error("请输入其他内容"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        };
        //下拉多选自定义校验
        const validateSelectMultiple = (rule, value, callback) => {
          if (value.length > 0) {
            if (cur.min && value.length < cur.min) {
              callback(new Error(`请至少选择${cur.min}个选项`));
            } else if (cur.max && value.length > cur.max) {
              callback(new Error(`请最多选择${cur.max}个选项`));
            } else {
              callback();
            }
          } else {
            callback(new Error(cur.placeholder));
          }
        };
        //单行文本最小输入长度限制
        const minTextLength = (rule, value, callback) => {
          if (value && value.length < cur.minlength) {
            callback(new Error(`最少要填字数为${cur.minlength}`));
          } else {
            callback();
          }
        };
        //单行文本数字、字母、中文的输入校验
        const singleText = (rule, value, callback) => {
          let regNumber = new RegExp("^[0-9]*$");
          let regLetter = new RegExp("^[A-Za-z]+$");
          let regChinese = new RegExp("[^\u4e00-\u9fa5]");
          if (cur.textType == "number") {
            regNumber.test(value)
              ? callback()
              : callback(new Error("请填写数字"));
          } else if (cur.textType == "letter") {
            regLetter.test(value)
              ? callback()
              : callback(new Error("请填写字母"));
          } else if (cur.textType == "chinese") {
            regChinese.test(value)
              ? callback(new Error("请填写中文"))
              : callback();
          }
        };
        //矩阵量表校验
        const validateMatrixSale = (rule, value, callback) => {
          if (value && config.required) {
            let arr = [];
            arr = Object.keys(value).filter((item) => {
              return !value[item];
            });
            if (arr.length > 0) {
              callback(new Error(`请完整填写矩阵`));
            } else {
              callback();
            }
          } else if (!config.required) {
            callback();
          } else {
            callback(new Error(cur.placeholder));
          }
        };
        //矩阵选择校验
        const validateMatrixSelect = (rule, value, callback) => {
          if (value && config.required) {
            let arr = [];
            arr = Object.keys(value).filter((item) => {
              return value[item].length == 0;
            });
            if (arr.length > 0) {
              callback(new Error(`请完整填写矩阵`));
            } else {
              callback();
            }
          } else if (!config.required) {
            callback();
          } else {
            callback(new Error(cur.placeholder));
          }
        };
        if (Array.isArray(config.regList)) {
          // 必填其他输入框校验
          if (["RADIO", "CHECKBOX"].includes(cur.typeId)) {
            const required = {
              validator: validateOtherInput,
              message: cur.placeholder,
            };
            config.regList.push(required);
          }
          if (["SELECT"].includes(cur.typeId) && cur.multiple) {
            const required = {
              validator: validateSelectMultiple,
            };
            config.regList.push(required);
          }
          if (config.tag == "matrix-scale") {
            const required = {
              validator: validateMatrixSale,
            };
            config.regList.push(required);
          }
          if (config.tag == "matrix-select") {
            const required = {
              validator: validateMatrixSelect,
            };
            config.regList.push(required);
          }
          if (config.labelDescription == "单行文本") {
            if (cur.minlength) {
              const required = {
                validator: minTextLength,
              };
              config.regList.push(required);
            }
            if (
              cur.textType == "number" ||
              cur.textType == "letter" ||
              cur.textType == "chinese"
            ) {
              const required = {
                validator: singleText,
              };
              config.regList.push(required);
            }
          }
          if (config.required) {
            const required = {
              required: config.required,
              message: cur.placeholder,
            };
            if (Array.isArray(config.defaultValue)) {
              required.type = "array";
              required.message = `请至少选择一个${config.label}`;
            }
            required.message === undefined &&
              (required.message = `${config.label}不能为空`);
            config.regList.push(required);
          }
          // 显示时使用表单校验
          if (!flag) {
            if (config.tagIcon == "input") {
              switch (cur.textType) {
                case "text":
                  config.regList = this.filterReg(config.regList);
                  break;
                case "number":
                  config.regList = this.filterReg(config.regList);
                  break;
                case "letter":
                  config.regList = this.filterReg(config.regList);
                  break;
                case "chinese":
                  config.regList = this.filterReg(config.regList);
                  break;
                case "phone":
                  config.regList = this.filterReg(config.regList, 0);
                  break;
                case "email":
                  config.regList = this.filterReg(config.regList, 1);
                  break;
                case "url":
                  config.regList = this.filterReg(config.regList, 2);
                  break;
                case "idCard":
                  config.regList = this.filterReg(config.regList, 3);
                  break;
              }
            }
            rules[cur.__vModel__] = config.regList.map((item) => {
              item.pattern && (item.pattern = eval(item.pattern));
              item.trigger = ruleTrigger && ruleTrigger[config.tag];
              return item;
            });
          }
        }
        if (config.children) this.buildRules(config.children, rules);
      });
    },
    // 重建逻辑规则的表单校验
    logicRules(componentList, rules, arr = [], isShow) {
      componentList.forEach((cur) => {
        let triggerShow =
          _.indexOf(this.logicTriggerItemList, cur.formItemId) > -1;
        let flag = cur.logicShow || triggerShow ? "" : "display:none";
        const config = cur.__config__;
        let flagTwo = arr.includes(Number(cur.formItemId)) && isShow == false;
        if (!flag && !flagTwo) {
          rules[cur.__vModel__] = config.regList.map((item) => {
            item.pattern && (item.pattern = eval(item.pattern));
            item.trigger = ruleTrigger && ruleTrigger[config.tag];
            return item;
          });
        }
      });
    },
    //过滤校验规则
    filterReg(arr, i) {
      return arr.filter((item, index) => {
        if (i || i == 0) {
          return index == i || !item.pattern;
        } else {
          return !item.pattern;
        }
      });
    },
    resetForm() {
      this.formConfCopy = deepClone(this.formConf);
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      console.log(
        this[this.formConf.formModel],this[this.formConf.labelFormModel],
        "this[this.formConf.formModel]"
      );
      this.$refs[this.formConf.formRef].validate((valid) => {
        if (!valid) {
          // 未选中自动高亮
          // if (document.getElementsByClassName('el-form-item__error').length > 0) {
          //
          // }
          setTimeout(() => {
            let isError = document.getElementsByClassName("is-error");
            isError[0].querySelector("input").focus();
          }, 100);
          return false;
        }
        // 触发sumit事件
        this.$emit("submit", {
          formModel: this[this.formConf.formModel],
          labelFormModel: this[this.formConf.labelFormModel],
        });
        return true;
      });
    },
  },
  render(h) {
    return renderFrom.call(this, h);
  },
};
</script>
<style scoped>
::v-deep .el-radio-group,
::v-deep .el-checkbox-group {
  margin-left: 10px;
}

::v-deep .el-radio,
::v-deep .el-checkbox {
  display: block;
  min-height: 23px;
  line-height: 23px;
}

::v-deep .el-radio__label,
::v-deep .el-checkbox__label {
  font-size: 14px;
  padding-left: 10px;
  text-overflow: ellipsis;
  white-space: normal;
  min-height: 18px;
  vertical-align: middle;
  display: inline-block;
}

::v-deep .item-other-input {
  margin-left: 20px !important;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
}

::v-deep .item-other-input:focus {
  outline: none !important;
}
::v-deep .el-upload-dragger {
  width: 100%;
}
::v-deep .el-radio {
  margin-right: 30px;
}
.titleTip {
  color: #dcdfe6;
  margin-top: -10px;
}
</style>
