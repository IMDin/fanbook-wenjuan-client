import { deepClone } from '@/utils/index'
import SignPad from '@/components/form/SignPad/index'
import PhoneVerification from '@/components/form/PhoneVerification/index'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = slotsFiles(key).default
  componentChild[tag] = value
})

function vModel(dataObject, confClone) {
  console.log('vModel属性', dataObject)
  let defaultValue = confClone.__config__.defaultValue
  // 表单组件特殊处理
  if (confClone.__config__.tag === 'el-upload') {
    // 增加上传回调事件
    dataObject.attrs['on-success'] = (response, file, fileList) => {
      this.$emit('upload', response, file, fileList)
    }
    dataObject.attrs['on-remove'] = (file, fileList) => {
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('deleteUpload', file, fileList)
    }
    // eslint-disable-next-line no-unused-vars
    dataObject.attrs['on-exceed'] = (files, fileList) => {
      this.$message.error(`最多上传${confClone.limit}个文件`)
    }
    dataObject.attrs['before-upload'] = file => {
      let sizeUnitNum = 1
      // 文件大小判断
      switch (confClone.sizeUnit) {
        case 'KB':
          sizeUnitNum = 1024
          break
        case 'MB':
          sizeUnitNum = 1024 * 1024
          break
        case 'GB':
          sizeUnitNum = 1024 * 1024 * 1024
          break
      }
      let totalSize = confClone.fileSize * sizeUnitNum
      if (file.size > totalSize) {
        this.$message.error(`上传图片大小不能超过${confClone.fileSize}${confClone.sizeUnit}`)
        return false
      }
    }
    // 分页组件
  } else if (confClone.__config__.tag === 'pagination') {
    dataObject.on.prev = val => {
      this.$emit('prev', val)
    }
    dataObject.on.next = val => {
      this.$emit('next', val)
    }
  } else {
    dataObject.props.value = confClone.__config__.tag === 'el-select' && confClone.multiple ? typeof (defaultValue) == 'object' ? defaultValue : defaultValue ? [defaultValue] : [] : defaultValue
    dataObject.on.input = val => {
      this.$emit('input', val)
    }
  }

}

function mountSlotFlies(h, confClone, children) {
  const childObjs = componentChild[confClone.__config__.tag]
  if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key]
      if (confClone.__slot__ && confClone.__slot__[key]) {
        children.push(childFunc(h, confClone, key, this))
      }
    })
  }
}

function emitEvents(confClone) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {})
    eventKeyList.forEach(key => {
      const val = confClone[attr][key]
      if (typeof val === 'string') {
        confClone[attr][key] = event => this.$emit(val, event)
      }
    })
  })
}

function buildDataObject(confClone, dataObject) {
  Object.keys(confClone).forEach(key => {
    const val = confClone[key]
    if (key === '__vModel__') {
      vModel.call(this, dataObject, confClone)
    } else if (dataObject[key]) {
      console.log('dataObject[key]', key, dataObject[key], val)
      dataObject[key] = { ...dataObject[key], ...val }
    } else if (confClone.typeId == ("UPLOAD" || 'IMAGE-"UPLOAD"') && key == 'action') {
      //上传地址加projectKey
      if (confClone[key].split(this.$route.query.key).length > 1) {
        dataObject.attrs[key] = confClone[key]
      } else {
        dataObject.attrs[key] = confClone[key] + this.$route.query.key
      }
    }
    else {
      dataObject.attrs[key] = val
    }
  })
  console.log('render.dataObject', dataObject)

  // 清理属性
  clearAttrs(dataObject)
}

function clearAttrs(dataObject) {
  delete dataObject.attrs.__config__
  delete dataObject.attrs.__slot__
  delete dataObject.attrs.__methods__
}

function makeDataObject() {
  return {
    attrs: {},
    props: {},
    nativeOn: {},
    on: {},
    style: {}
  }
}

export default {
  components: {
    SignPad,
    PhoneVerification
  },
  props: {
    conf: {
      type: Object,
      required: true
    }
  },
  render(h) {
    const dataObject = makeDataObject()
    const confClone = deepClone(this.conf)
    const children = this.$slots.default || []
    // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
    mountSlotFlies.call(this, h, confClone, children)

    // 将字符串类型的事件，发送为消息
    emitEvents.call(this, confClone)

    console.log('render.confClone', confClone)
    // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
    buildDataObject.call(this, confClone, dataObject)
    return h(this.conf.__config__.tag, dataObject, children)
  }
}
