//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    focus: {},
    newslist: {},
    ye: 1,
    err: 0,
  },
  onLoad: function () {
    var that = this
    //请求数据  最新更新
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/works',
      data: '',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
      
        if(res.data==1){
          that.setData({
            err:2
          })
        }else{
          that.setData({
            newslist: res.data,
          })
        }

      },
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: "金自力作品",
      path: "/pages/works/works"
    }
  },
  //上拉触底 --就是页面翻到最底部的时候触发函数
  onReachBottom: function (e) {
    var that = this
    that.setData({
      page: ++that.data.ye
    })
  if(that.data.err !=2){
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/works',
      data: {
        p: that.data.ye
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            err: 1
          })
        } else {
          that.setData({
            newslist: that.data.newslist.concat(res.data)
          })
        }

      },
    })
  }

  }

})
