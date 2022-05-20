import request from "@/utils/request"


export default function getTradMarkData(){
    return request({
        url: '/vue-admin-template/tradeMark/data',
        method: 'get'
    })
}