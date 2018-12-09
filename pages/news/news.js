// pages/news/news.js
//获取应用实例
const app = getApp()

Page({
  data: {
    focus: {},
    newslist: {},
    ye: 1,
    err: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //请求数据  最新更新
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/news',
      data: '',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          newslist: res.data,
        })
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
      title: "梅城生活",
      path: "/pages/news/news"
    }
  },
  //上拉触底 --就是页面翻到最底部的时候触发函数
  onReachBottom: function (e) {
    var that = this
    that.setData({
      page: ++that.data.ye
    })

    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/news',
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

})
