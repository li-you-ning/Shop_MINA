
// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
  // // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  // let header = { ...params.header };
  // if (params.url.includes("/my/")) {
  //   // 拼接header 带上token
  //   header["Authorization"] = wx.getStorageSync("token");
  // }


  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  // 定义公共的url
  const baseUrl = "http://localhost:61798/api";

  let header = {
    'content-type': 'application/json'
  }

  let token = wx.getStorageSync("token");
  if (token) {
    header['Authorization'] = token.token
  }
  console.log(header)

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        console.log(result);

        if (result.statusCode == 200) {
          if (result.data.Data == null) {
            resolve(result.data);
          }
          resolve(result.data.Data);
        }
        else if (result.statusCode == 401) {
          //获取refreshToken
          const refreshToken = wx.getStorageSync('refreshToken');
          if (Date.now() - refreshToken.time > refreshToken.expire) {//refreshToken过期

            wx.navigateTo({
              url: '/pages/auth/auth'
            });
            return
          }
          else {

            //刷新token
            wx.request({
              url: baseUrl + '/auth/getTokenByRefreshToken',
              data: { rToken: refreshToken.refreshToken },
              header: { 'content-type': 'application/json' },
              method: 'GET',
              success: (result) => {
                console.log(result)

                if (result.data.Code==500) {
                  wx.navigateTo({
                    url: '/pages/auth/auth'
                  });
                  return
                }

                wx.setStorageSync("token", { time: Date.now(), token: result.data.Data.Token });
                wx.setStorageSync("refreshToken", { time: Date.now(), refreshToken: result.data.Data.RefreshToken, expire: result.data.Data.Expire });

                //携带新的token重新发起请求
                var reqTask = wx.request({
                  ...params,
                  url: baseUrl + params.url,
                  header: {
                    'content-type': 'application/json',
                    'Authorization': result.data.Data.Token
                  },
                  success: (result) => {
                    if (result.data.Data == null) {
                      resolve(result.data);
                    }
                    resolve(result.data.Data);
                  }
                });
              }
            });
          }


        }


      },
      fail: (err) => {
        console.log(err)
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}