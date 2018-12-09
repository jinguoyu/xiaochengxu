//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    focus: {},
    newslist:{},
    ye:1,
    err:0,
    indicatorDots: true,
    autoplay: true,
    interval: 1000,
    duration: 1000,
    circular:true
  },
 


  onLoad: function () {
    var that=this
 
    //请求数据  焦点图
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/newlife',
      data: '',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          focus: res.data
        })
      },
    })

    //请求数据  最新更新
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/newslist',
      data: '',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if(res ==1){

        }else{
          that.setData({
            newslist: res.data,
          })
        }

      },
    })
  },

  
//下拉刷新
  onPullDownRefresh: function(){
    this.onLoad()
  },
  //分享
  onShareAppMessage:function(){
    return{
      title:"梅城生活网",
      path:"/pages/index/index"
    }
  },
  //上拉触底 --就是页面翻到最底部的时候触发函数
  onReachBottom:function(e){
    var that=this
    that.setData({
      page:++that.data.ye
    })

    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/newslist',
      data:{
        p:that.data.ye
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
    if(res.data==1){
      that.setData({
        err:1
      })
    }else{
      that.setData({
        newslist: that.data.newslist.concat(res.data)
      })
    }

      },
    })
  }

})
