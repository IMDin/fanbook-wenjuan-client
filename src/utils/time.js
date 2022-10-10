import Vue from "vue";
var Time = {
  //获取当前时间戳
  getUnix: function() {
    var date = new Date();
    return date.getTime();
  },
  //获取当前0点0分0秒0毫秒的时间戳
  getToDayUnix: function() {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  },
  //获取今年1月1日0点0分0秒的时间戳
  getYearUnix: function() {
    var date = new Date();
    date.setMonth(0);
    date.setDate(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.getTime();
  },
  //获取标准年月日
  getLastDate: function(time) {
    var date = new Date(time);
    var month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1; //月从0开始，需要+1
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //格式 01-09
    return date.getFullYear() + "-" + month + "-" + day;
  },
  //转换时间
  getFormatTime: function(timestamp) {
    var now = this.getUnix(); //当前时间戳 毫秒级
    var time = timestamp; //转为毫秒，如果是毫秒可以去除转换
    // var today = this.getToDayUnix(); //今天0点时间戳
    // var year = this.getYearUnix(); // 今年0点时间戳
    //由于 timestamp 是秒，所以需要乘以1000
    var timer = (now - time) / 1000; //转换为秒级时间戳
    var tip = "";
    if (timer <= 0) {
      tip = "刚刚";
    } else if (Math.floor(timer / 60) <= 0) {
      tip = "刚刚";
    } else if (timer < 3600) {
      tip = Math.floor(timer / 60) + "分钟前";
    } else if (timer >= 3600 && timer/60/60/24 < 1) {
      tip = Math.floor(timer / 3600) + "小时前";
    } else if (timer / 86400 <= 31) {
      tip = Math.floor(timer / 86400) + "天前";
    } else {
      //要注意new Date(time) ，time 是毫秒级
      tip = this.getLastDate(time);
    }
    return tip;
  }
};
 
//全局自定义指令
Vue.directive("time", {
  bind(el, binding) {
    el.innerHTML = Time.getFormatTime(binding.value);
    //使用定时器，每分钟触发一次，更新时间，并且在 unbind 钩子里清除掉
    el.__timeout__ = setInterval(function() {
      //将格式化时间写入指令所在的元素
      el.innerHTML = Time.getFormatTime(binding.value);
    }, 60000);
  },
  unbind(el) {
    // 在 unbind 钩子里清除定时器
    clearInterval(el.__timeout__);
    delete el.__timeout__;
  }
});