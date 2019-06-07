// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = wx.cloud.database()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  
  db.collection('typelist').doc(wxContext.openid).set({
    data: {
      time:event.time,
      list:event.typelist
    },
    success: function (res) {
      // res.data 包含该记录的数据
      console.log(res.data)
    }
  })
  

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}