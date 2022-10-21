import api from "./index"

export const getPrizeQuery  = ( data ) => {
  return api({
    url: '/user/prize/setting/query', 
    method: 'post',
    data
  })
}