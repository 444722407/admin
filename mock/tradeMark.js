const Mock = require('mockjs')
const data = Mock.mock({
  'items|10': [{
    id: '@id()',
    tmName: '@cname()',
    logoUrl: `@image('250x250','@color','@increment')`,
  }]
})



module.exports = [
  {
    url: '/vue-admin-template/tradeMark/data',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          list: items
        }
      }
    }
  }
]
