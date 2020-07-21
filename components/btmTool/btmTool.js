// components/btmTool/btmTool.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击事件
    showSku(e) {
      // 1 获取点击的索引
      const index = 1;
      // 2 触发 父组件中的事件 自定义
      this.triggerEvent("showSku", { index });
    }
  }
})
