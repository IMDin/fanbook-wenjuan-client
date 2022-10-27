import api from "./index"

export const getPrizeQuery  = ( key ) => {
  return api({
    url: `/user/prize/setting/query?projectKey=${key}`, 
    method: 'post'
  })
}