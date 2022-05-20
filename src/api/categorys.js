import request from '@/utils/request'

export  function getCategorys(id) {
  return request({
    url: '/vue-admin-template/category',
    method: 'get',
    params:{id}
  })
}


export function getCategorysData() {
  return request({
    url: '/vue-admin-template/attr',
    method: 'get'
  })
}



