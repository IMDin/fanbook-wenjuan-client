import api from "./index"

export const getMyProjectPage = ( params ) => {
  return api({
    url: '/user/project/page', 
    method: 'get',
    params
  })
}
export const reqDeleteProject = ( data ) => {
  return api({
    url: '/user/project/delete', 
    method: 'post',
    data
  })
}
export const reqStopProject = ( data ) => {
  return api({
    url: '/user/project/stop', 
    method: 'post',
    data
  })
}
// 复制 /user/project/copy
export const reqCopyProject = ( data ) => {
  return api({
    url: '/user/project/copy', 
    method: 'post',
    data
  })
}
// 发布 /user/project/publish
export const reqPublishProject = ( data ) => {
  return api({
    url: '/user/project/publish', 
    method: 'post',
    data
  })
}
// 消息推送接口 timingPublishMsg
export const reqTimingPublishMsg = ( data ) => {
  return api({
    url: '/user/project/timingPublishMsg', 
    method: 'post',
    data
  })
}

// 统计查询 
export const reqProjectData = ( data ) => {
  return api({
    url: '/user/project/result/data', 
    method: 'get',
    params: data
  })
}

// 统计下载  user/project/result/export
export const reqProjectExport = ( data ) => {
  return api({
    url: '/user/project/result/export', 
    method: 'get',
    responseType: 'blob',
    params: data
  })
}