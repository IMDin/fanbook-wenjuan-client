export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    console.log(666, config)
    let imageFlag
    if (false) {
      imageFlag = <img src="imageUrl" class="avatar"></img>
    } else {
      imageFlag = <i class="el-icon-plus avatar-uploader-icon"></i>
    }
    if (conf['list-type'] === 'picture-card') {
      list.push(<i class="el-icon-plus"></i>)
    } else if (config.tagIcon == 'image-upload') {
      list.push(
        <div>
          <div class="avatar-uploader">
            {imageFlag}
          </div>
          <i class="el-icon-warning-outline" />
          <span
            style="margin-left: 10px; color: #7b7b7b; font-size: 14px"
          >单张图片大小不超过30M</span>
        </div>
      )
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
