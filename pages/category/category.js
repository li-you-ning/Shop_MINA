// 0 引入 用来发送请求的 方法
import { request } from
  "../../requset/request.js"
// import regeneratorRuntime from
//   '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的分类数据
    rigthContent: [],
    //被点击的左侧的菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    0 web中本地存储和 小程序中的本地存储的区别
      1写代码的方式不一样了
      web: localStorage . setItem ( "key"，"value") localStorage . getItem( "key" )
      小程序中: wx . setStorageSync("key", "value"); wWx . getStorageSync("key");
      2:存的时候有没有做类型转换
      web:不管存入的是什么类型的数据，最终都会先调用以下toString(), 把数据变成了字符串再存入进去
      小程序:不存在类型转换的这个操作存什么类似的数据进去，获取的时候就是什么类型

     1 先判断一下本地储存中有没有旧的数据
     {time:Data.now(),data:[...]}
     2 没有旧的数据 直接发送新请求
     3 有旧的数据 同时 旧的数据也没有过期 就使用 本地储存中的旧数据即可
     */

    //1 获取本地存储中的数据（小程序中也是存在本地储存的）
    const Cates = wx.getStorageSync("cates");
    //2 判断
    if (!Cates) {
      //不存在 发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据 定义过期时间 测试：10s 正式：5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates();
      } else {
        //可以使用旧数据
        this.Cates = Cates.data;

        //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.Name);
        // let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的商品数据
        let rigthContent = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rigthContent,
          //重新设置 右侧内容的scroll-view标签的距离顶部的距离
          scrollTop: 0
        })
      }
    }


  },

  //获取 分类数据
  async getCates() {
    // request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories' })
    // request({ url: 'http://localhost:61798/api/ProductCategory' })
    // .then(res => {
    //   console.log(res)

    //   this.Cates = res.data.Data

    //   //把接口的数据存入到本地储存中
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })

    //   //构造左侧的大菜单数据
    //   // let leftMenuList = this.Cates.map(v => v.cat_name);
    //   let leftMenuList = this.Cates.map(v => v.Name);
    //   //构造右侧的商品数据
    //   let rigthContent = this.Cates[0].children;

    //   this.setData({
    //     leftMenuList,
    //     rigthContent
    //   })
    // })

    // 1 使用es7的async await来发送请求
    const res = await request({ url: "/ProductCategory" })
    // const res = await request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/categories" })
    console.log(res)

    this.Cates = res

    //把接口的数据存入到本地储存中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })

    //构造左侧的大菜单数据
    // let leftMenuList = this.Cates.map(v => v.cat_name);
    let leftMenuList = this.Cates.map(v => v.Name);

    //构造右侧的商品数据
    let rigthContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rigthContent
    })
  },

  //左侧菜单的点击事件
  handleItemTap(e) {
    /* 
    1 获取被点击标题身上的索引
    2 给data中的currentIndex赋值就可以了
     */
    const { index } = e.currentTarget.dataset;
    //构造右侧的商品数据
    let rigthContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rigthContent,
      //重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
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