//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //授权使用地址
    wx.authorize({
      scope: 'scope.userLocation',
    })
    //云服务初始化登录
    wx.cloud.init()
    
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
          wx.cloud.callFunction({
            name: 'login',
            complete: res => {
              console.log('callFunction test result: ', res)
              that.globalData.openid = res.result.openid
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    openid:null,
    numberarray: ['1', '2', '3', '4', '5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
    typearray: ['衣','食','住','行','其他'],
    typegetarray: ['工资','奖金','意外之财','其他']
  }
})