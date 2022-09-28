export function DebounceBy  (fn, t) {
    let delay = t || 500
    let timer
    //按钮限制点击多次，解决多次提交数据的问题
    return function () {
      let args = arguments;
      if (timer) {
        clearTimeout(timer)
      }
   
      let callNow = !timer
   
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (callNow) fn.apply(this, args)
    }
  }
  