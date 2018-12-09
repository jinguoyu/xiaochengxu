// pages/news/news.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    options:[],//页面初始化，页面跳转所带来的参数
    msg:'',
    ind:0,//文章分类
    id:0, //文章id
    title:'',
    img:'',
    froms:'',
    browse:0,//文章的浏览数
    pinglun:0,//文章的评论数
    username:'', //用户名字
    userimg:'',//用户头像
    textar:'',//发送的评论内容
    commtent:{} //获取的当前文章的所有评论
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
      this.setData({
        options:options
      })
      wx.request({
        url:'https://www.jinzili.top/index/apiwx/show',
        data:{
          id:options.id
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success:function(res){
        var ind = res.data.fenlei;
          if(ind >0){
            that.setData({
              ind: res.data.fenlei,
              msg: res.data.content,

            })
          }else{
            WxParse.wxParse('msg', 'html', res.data.content, that, 5)
          }
          that.setData({
            title:res.data.title,
            img:res.data.thumb,
            froms: res.data.from,
            id: res.data.id,
            browse:res.data.views,
          })
        }
      })

      //获取评论
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/getcom',
      data: {
        id: options.id
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if(res ==1){
          commtent:1
        }else{
          that.setData({
            commtent: res.data.info,
            pinglun:res.data.num
        })          
        }

  
      }
    })
  },
//下拉刷新
  onPullDownRefresh: function(){
    var that = this;
    var options = that.data.options;
    this.onLoad(options)
  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.title,
      path: "/pages/singer/singer"
    }
  },
  //表单提交事件
  bindFormSubmit: function (e) {
    var that=this;
    var text = e.detail.value.textarea;
    if(text ==''){
          wx.showToast({
            title: '评论内容不能为空',
            icon: 'none',
            duration: 1000
          })
      return;
    }else{
      this.setData({
        textar: e.detail.value.textarea
      })
      this.onGotUserInfo(); 
      this.apipinlun();    
    }

  },
  //获取用户信息
  onGotUserInfo: function (e) {
    var name =e.detail.userInfo.nickName;
    var img =e.detail.userInfo.avatarUrl;
    var that =this;
    that.setData({
      username:name,
      userimg:img
    })
    
  },

  //将评论数据发送给后台
  apipinlun: function () {
    var that = this;
    var options = that.data.options;
    wx.request({
      url: 'https://www.jinzili.top/index/apiwx/comment',
      data: {
        newsid: that.data.id,
        name:that.data.username,
        text:that.data.textar,
        image:that.data.userimg
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res=> {
        if(res==1){
          wx.showToast({
            title: '评论失败请稍后再试',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }else{
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })

          this.onLoad(options);
        }
      }
    })
  },


})