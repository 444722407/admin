const Mock = require('mockjs')

const data1 = Mock.mock({
    "categorys|30":[
       { 
         "category_id":"@increment",
         "title":"@ctitle"
       } 
    ]
})

const data2 = Mock.mock({
  "categorys|30":[
     { 
       "category_id":"@increment",
       "title":"@ctitle"
     } 
  ]
})


const data3 = Mock.mock({
  "categorys|30":[
     { 
       "category_id":"@increment",
       "title":"@ctitle"
     } 
  ]
})

const data = [data1,data2,data3];

const getList = function(){
  const list = Mock.mock({

    "list|10":[
       { 
         "attr_id":"@increment",
         "tags|1-4":["@cname"],
         "title":"@ctitle"
       } 
    ]
  })

  return list

}



module.exports = [
  {
    url: '/vue-admin-template/category\.*',
    type: 'get',
    response: config => {
      const { id } = config.query;
      const categorys = data[id-1].categorys;

      return {
        code: 20000,
        data: {
          total: categorys.length,
          categorys: categorys
        }
      }
    }
  },
  {
    url: '/vue-admin-template/attr',
    type: 'get',
    response: config => {
      const list = getList();
      return {
        code: 20000,
        data: {
          total: list.length,
          data: list
        }
      }
    }
  }
]

