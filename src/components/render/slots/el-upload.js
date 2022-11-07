export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    if (config.tagIcon == 'image' && conf['list-type'] === 'picture-card') {
      list.push(<i class="el-icon-plus"></i>)
      list.push(<p style="margin-top:-120px;color:#7b7b7b">上传图片</p>)
      list.push(
        <div slot="tip" class="el-upload__tip">最多{conf.limit}张，单张照片大小不超过 {conf.fileSize}{conf.sizeUnit}</div>
      )
    } else {
      // list.push(<el-button size="small" type="primary" icon="el-icon-upload">{config.buttonText}</el-button>)
    }
    if (config.showTip) {
      list.push(<i class="el-icon-upload"></i>)
      list.push(<p class="el-upload__text" style="margin:0 25px">将文件拖到此处，或<em>点击上传</em></p>)
      list.push(
        <div slot="tip" class="el-upload__tip">最多{conf.limit}个，单个文件大小不超过 {conf.fileSize}{conf.sizeUnit}</div>
      )
    }
    return list
  }
}
