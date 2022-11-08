<script>
import draggable from "vuedraggable";
import render from "@/components/render/render";

const components = {
  itemBtns(h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners;
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={(event) => {
          copyItem(currentItem, list);
          event.stopPropagation();
        }}
      >
        <i class="el-icon-copy-document" />
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={(event) => {
          deleteItem(index, list);
          event.stopPropagation();
        }}
      >
        <i class="el-icon-delete" />
      </span>,
    ];
  },
};
const layouts = {
  // eslint-disable-next-line no-unused-vars
  colFormItem(h, currentItem, index, list) {
    // eslint-disable-next-line no-unused-vars
    console.log("draggableItem.currentItem", currentItem);
    const { activeItem } = this.$listeners;
    const config = currentItem.__config__;
    const child = renderChildren.apply(this, arguments);
    //初始化最多可选
    if (config.tag == "my-checkbox-group") {
      this.$set(currentItem, "max", currentItem.__slot__.options.length);
    }
    let className =
      this.activeId === config.formId
        ? "drawing-item active-from-item"
        : "drawing-item";
    if (this.formConf.unFocusedComponentBorder)
      className += " unfocus-bordered";
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    return (
      <el-col
        span={config.span}
        class={className}
        nativeOnClick={(event) => {
          activeItem(currentItem);
          event.stopPropagation();
        }}
      >
        <div class="questionType">{config.labelDescription}</div>
        <el-form-item
          class={"formClass"}
          label-width={labelWidth}
          label={
            config.showLabel
              ? changeNumber(index, config) + " " + config.label
              : ""
          }
          required={config.required}
        >
          {config.titleTip ? (
            <div class="titleTip" domPropsInnerHTML={config.titleTipText}></div>
          ) : (
            ""
          )}
          <render
            key={config.renderKey}
            conf={currentItem}
            onInput={(event) => {
              this.$set(config, "defaultValue", event[0]);
              console.log(78989, currentItem);
            }}
            onUpload={(response, file, fileList) => {
              upload(response, file, fileList, currentItem, this);
            }}
            onDeleteUpload={(file, fileList) => {
              deleteUpload(file, fileList, currentItem, this);
            }}
          >
            {child}
          </render>
          {config.titleTip ? (
            <div style="margin-top:15px">
              <Tinymce
                placeholder="请输入题目说明"
                onInput={(event) => {
                  this.$set(config, "titleTipText", event);
                }}
              />
            </div>
          ) : (
            ""
          )}
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    );
  },
  // eslint-disable-next-line no-unused-vars
  rowFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners;
    const config = currentItem.__config__;
    const className =
      this.activeId === config.formId
        ? "drawing-row-item active-from-item"
        : "drawing-row-item";
    let child = renderChildren.apply(this, arguments);
    if (currentItem.type === "flex") {
      child = (
        <el-row
          type={currentItem.type}
          justify={currentItem.justify}
          align={currentItem.align}
        >
          {child}
        </el-row>
      );
    }
    return (
      <el-col span={config.span}>
        <el-row
          gutter={config.gutter}
          class={className}
          nativeOnClick={(event) => {
            activeItem(currentItem);
            event.stopPropagation();
          }}
        >
          <span class="component-name">{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            group="componentsGroup"
            class="drag-wrapper"
          >
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    );
  },
  // eslint-disable-next-line no-unused-vars
  raw(h, currentItem, index, list) {
    const config = currentItem.__config__;
    const child = renderChildren.apply(this, arguments);
    return (
      <render
        key={config.renderKey}
        conf={currentItem}
        onInput={(event) => {
          this.$set(config, "defaultValue", event);
        }}
      >
        {child}
      </render>
    );
  },
};

// eslint-disable-next-line no-unused-vars
function renderChildren(h, currentItem, index, list) {
  const config = currentItem.__config__;
  if (!Array.isArray(config.children)) return null;
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout];
    if (layout) {
      return layout.call(this, h, el, i, config.children);
    }
    return layoutIsNotFound.call(this);
  });
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`);
}

function changeNumber(num) {
  if (num + 1 < 10) {
    return "0" + String(num + 1);
  } else {
    return num + 1;
  }
}
function upload(response, file, fileList, currentItem, that) {
  let newValue = currentItem.__config__.defaultValue;
  if (!newValue) {
    newValue = [];
  }
  newValue.push({ fileName: file.name, url: response.data });
  that.$set(currentItem.__config__, "defaultValue", newValue);
}
function deleteUpload(file, fileList, currentItem, that) {
  let newValue = [];
  fileList.forEach((element) => {
    newValue.push({ fileName: element.name, url: element.url });
  });
  that.$set(currentItem.__config__, "defaultValue", newValue);
}

export default {
  components: {
    render,
    draggable,
  },
  props: ["currentItem", "index", "drawingList", "activeId", "formConf"],
  render(h) {
    const layout = layouts[this.currentItem.__config__.layout];

    if (layout) {
      console.log("layout", this.currentItem);
      return layout.call(
        this,
        h,
        this.currentItem,
        this.index,
        this.drawingList
      );
    }
    return layoutIsNotFound.call(this);
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
  margin-left: 20px;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
::v-deep .item-other-input:focus {
  outline: none;
}

::v-deep .avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-upload-dragger {
  width: 100%;
}
.formClass  {
  border: 1px dashed #ccc;
  margin: 0 15px 15px;
}
.questionType {
  position: absolute;
  top: 15px;
  left:35px;
  background-color: #dcdfe6;
  padding: 0 5px;
}
.titleTip {
  color: #dcdfe6;
  margin-top: -10px;
}
</style>
