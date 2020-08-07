import { request } from "../../request/request.js";
import { login } from "../../utils/asyncWx.js";

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 1 获取用户信息
      const { userInfo } = e.detail;
      console.log(userInfo);

      // 2 获取小程序登录成功后的code
      const { code } = await login();
      console.log(code);

      //  3 发送请求 获取用户的token
      const {Token,RefreshToken,Expire} = await request({
        url: "/auth/getToken",
        data: { userInfo: userInfo, code },
        method: "post"
      });

      console.log("token:"+Token);
      console.log("refreshToken:"+RefreshToken);

      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync("token", {time: Date.now(),token:Token});
      wx.setStorageSync("refreshToken", {time: Date.now(),refreshToken:RefreshToken,expire:Expire});

      const ok = await request({
        url:"/auth/test",
        method:"get"
      })
      if (ok==="Auth OK") {
        wx.navigateTo({
          url: '/pages/pay/pay'
        });
      }

    } catch (error) {
      console.log(error);
    }
  }
})