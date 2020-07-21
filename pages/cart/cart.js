// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1 获取缓存中的收货地址信息
    // const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const carts = wx.getStorageSync("cart") || [];
    const cart = carts.data;

    console.log(cart)

    cart.forEach(v => {
      v.skus = JSON.parse(v.skus);
      v.product = JSON.parse(v.product);
    })

    console.log(cart)

    // this.setData({ address });
    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;

    


    cart.forEach(v => {
      if (true) {
        totalPrice += v.num * v.price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
      let SkuNum=v.skus[0].selectSkuNum;
      v.skus.forEach(_v=>{
        if (SkuNum===_v.SkuNum) {
          v.skus=_v
        }
      })

      let skuDisInfo;
      v.product.ProductSkuValues.forEach(_v=>{

          if (v.selectedValue != null) {
    
            skuDisInfo += _v.selectedValue + " "
            
          }
    
      })
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    // wx.setStorageSync("cart", cart);
  },
  handleItemNumEdit(e){
    console.log(e)
    let {operation}=e.currentTarget.dataset;
    let {id}=e.currentTarget.dataset;

    let {cart}=this.data;

    let num;

    cart.forEach(v=>{
      if (v.skus.ID===id) {
        v.num=v.num+operation===0?1:v.num+operation;
      }
    })

    this.setData({
      cart
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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