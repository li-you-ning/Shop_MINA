
/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment }
  from "../../utils/asyncWx.js";

import { request } from "../../request/request.js";

Page({
  data: {
    address: {
      name: "李四",
      phone: "18888888888",
      address: "河北省廊坊市广阳区xxxxxxxxxx"
    },
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    // const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const carts = wx.getStorageSync("cart") || [];
    const cart = carts.data;
    cart.forEach(v => {
      v.skus = JSON.parse(v.skus);
      v.product = JSON.parse(v.product);
    })
    console.log(cart)

    // 过滤后的购物车数组
    //cart = cart.filter(v => v.checked);
    // this.setData({ address });

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.price;
      totalNum += v.num;

      let SkuNum = v.skus[0].selectSkuNum;
      v.skus.forEach(_v => {
        if (SkuNum === _v.SkuNum) {
          v.skus = _v
        }
      })
    })
    this.setData({
      cart,
      totalPrice, totalNum,
      // address
    });
  },
  // 点击 支付 
  async handleOrderPay() {
    try {

      // 1 判断缓存中有没有token 
      const token = wx.getStorageSync("token");
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
        return;
      }
      // 3 创建订单
      //  准备 请求体参数
      const totalPrice = this.data.totalPrice;//总价
      const address = JSON.stringify(this.data.address);//收货地址
      const cart = this.data.cart;
      let orderDetails = [];
      //整合需要的订单数据
      cart.forEach(v => orderDetails.push({
        productID: v.product.ID,
        number: v.num,
        price: v.price,
        skuID: v.skus.ID
      }))
      // orderDetails=JSON.stringify(orderDetails);

      const orderParams = { totalPrice, address, orderDetails };
      // 4 准备发送请求 创建订单 获取订单编号
      const order_number = await request({ 
        url: "/order/create", 
        method: "POST", 
        data: orderParams 
      });

      console.log(order_number)
      if (order_number==="签名已过期"||order_number==="签名无效") {
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
      }


    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }
})