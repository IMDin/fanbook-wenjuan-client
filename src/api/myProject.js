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