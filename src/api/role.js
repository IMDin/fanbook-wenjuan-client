import api from "./index"

// 用户角色列表
export const getRoleList = ( params ) => {
  return api({
    url: '/user/role/list', 
    method: 'get',
    params
  })
}
// 拉去fb成员
export const getPullMembers = ( data ) => {
  return api({
    url: '/admin/fanbook/pullmembers', 
    method: 'post',
    data
  })
}
// 将fb用户设置魔方管理员
export const getFbAdminUp = ( data ) => {
  return api({
    url: '/admin/fanbook/adminup', 
    method: 'post',
    data
  })
}
// 拉取fb角色列表
export const getFbPullroles = ( data ) => {
  return api({
    url: '/admin/fanbook/pullroles', 
    method: 'post',
    data
  })
}

// 获取已设置的成员角色 mofang-api/admin/role/list
export const getAdminRoleList = ( data ) => {
  return api({
    url: '/admin/role/group', 
    method: 'post',
    data
  })
}
// admin/fanbook/members  获取fanbook 服务器角色
export const getAdminFbMembers = ( data ) => {
  return api({
    url: '/admin/fanbook/members', 
    method: 'post',
    data
  })
}
