export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    if (config.tagIcon == 'image-upload' && conf['list-type'] === 'picture-card') {
      list.push(<i class="el-icon-plus"></i>)
      list.push(<p style="margin-top:-120px;color:#7b7b7b">上传图片</p>)
    } else {
      list.push(<el-button size="small" type="primary" icon="el-icon-upload">{config.buttonText}</el-button>)
    }
    if (config.showTip) {
      list.push(
        <div slot="tip" class="el-upload__tip">只能上传不超过 {config.fileSize}{config.sizeUnit} 的{conf.accept}文件,最多不超过{conf.limit}个文件</div>
      )
    }
    return list
  }
}
