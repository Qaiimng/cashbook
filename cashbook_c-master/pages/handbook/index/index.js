var app = getApp()
var rawlist = wx.getStorageSync('cashflow') || []
var typearray = wx.getStorageSync('typelist') || app.globalData.typearray


Page({
  data: {
    mainindex: '',
    typearray: typearray,
    typegetarray: app.globalData.typegetarray,
    title: '',
    sumpay: 0,
    persumpay: 0,
    sumget:0,
    persumget:0,
    sumnet:0,
    sumpernet:0,
    sublist: []
  },
  onLoad: function (params) {
    // 生命周期函数--监听页面加载
    this.setData({
      mainindex: params.index,
      title: rawlist[params.index].title,
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    rawlist = wx.getStorageSync('cashflow') || []
    var sublist = rawlist[this.data.mainindex].items
    var sumpay = 0
    var persumpay = 0
    var sumget=0
    var persumget = 0
    var sumnet = 0
    var sumpernet = 0


    for (var i = 0; i < sublist.length; i++) {
      if (sublist[i].typo === 'pay'){
        sumpay += parseFloat(sublist[i].cost)
        persumpay += parseFloat(sublist[i].cost) / sublist[i].member
        continue
      }
      if (sublist[i].typo === 'get') {
        sumget += parseFloat(sublist[i].cost)
        persumget += parseFloat(sublist[i].cost) / sublist[i].member
        continue
      }
      
    }
    this.setData({
      sumpay: sumpay.toFixed(2),
      persumpay: persumpay.toFixed(2),
      sumget: sumget.toFixed(2),
      persumget: persumget.toFixed(2),
      sublist: sublist
    })
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '小账本', // 分享标题
      desc: '您的私人账本', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.sublist.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      sublist: this.data.sublist
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY })
    that.data.sublist.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      sublist: that.data.sublist
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },
  //删除事件
  del: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.sublist.splice(index, 1)
    this.setData({
      sublist: this.data.sublist
    })
    rawlist[this.data.mainindex].items.splice(index, 1)
    wx.setStorageSync('cashflow', rawlist)
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    this.onShow()
  }
})