// pages/goods_detail/goods_detail.js
import { request } from
  "../../request/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsdetail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ID = options.ID;
    console.log(ID);
    this.getGoodsDetail(ID)
    

  },
  async getGoodsDetail(ID){
    const res = await request({url:"/Product/GetProduct",data:{ID}});
    console.log(res)
    res.Product.ProductSlideImgs = JSON.parse(res.Product.ProductSlideImgs)
    res.Product.ProductDetailImg = JSON.parse(res.Product.ProductDetailImg)
    this.setData({
      goodsdetail:res.Product

    })
  },
  handlePrevewImage:function(e){
    
    const urls= this.data.goodsdetail.ProductSlideImgs;
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})