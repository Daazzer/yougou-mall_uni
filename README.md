# 优购商城 uni-app 项目



## 项目介绍

优购商城小程序项目



## 项目技术

- 项目框架：[uni-app](https://uniapp.dcloud.io/)
- 样式预编译：[Sass](https://sass-lang.com/)
- 版本管理：[Git](https://git-scm.com/)
- 字体图标：[iconfont](https://www.iconfont.cn/)



## 项目目录结构

```bash
.
├─components
│  └─goods_detail
├─custom-tab-bar
├─pages
│  ├─cart
│  ├─category
│  ├─collect
│  ├─feedback
│  ├─goods_detail
│  ├─goods_list
│  ├─index
│  ├─login
│  ├─order
│  ├─pay
│  ├─search
│  └─user
├─static
│  ├─fonts
│  └─images
└─utils
    └─api
```



## 项目 API

https://api-hmugo-web.itheima.net/api/public/v1/



## 项目路由

| 名称     | 路径                        |
| -------- | --------------------------- |
| 首页     | `/pages/index/index`        |
| 商品分类 | `/pages/category/index`     |
| 购物车   | `/pages/cart/index`         |
| 个人中心 | `/pages/user/index`         |
| 搜索     | `/pages/search/index`       |
| 商品列表 | `/pages/goods_list/index`   |
| 商品详情 | `/pages/goods_detail/index` |
| 商品收藏 | `/pages/collect/index`      |
| 反馈     | `/pages/feedback/index`     |
| 登录     | `/pages/login/index`        |
| 订单查询 | `/pages/order/index`        |
| 支付     | `/pages/pay/index`          |



## 项目实现

- 全局微信自定义导航栏，用于非 tabbar 索引的页面
- 全局搜索栏组件
- 全局商品项组件，封装成多种状态
- 全局商品计总栏
- 全局 http 请求方法封装，统一错误处理
- 全局封装错误提示到 Vue 根实例原型，将 api 响应的信息不是 `200` 的响应数据提示集中处理
- 全局 api 请求方法封装，并挂载带 Vue 根实例原型
- 将 `uni.getStorageSync()` 与 `uni.setStorageSync()` 方法封装到根 Vue 原型上，实现对象的数据与本地数据同步，并且到处复用
- 公用方法：日期格式化、检测登录状态、DOM 元素矩形尺寸获取、响应错误提示
- 兼容 iPhone 的全面屏手势提示线的 CSS 值： [Designing Websites for iPhone X | WebKit](https://webkit.org/blog/7929/designing-websites-for-iphone-x/?hmsr=funteas.com&utm_medium=funteas.com&utm_source=funteas.com) 
  - `constant(safe-area-inset-bottom)` 用于兼容 iOS 11
  - `env(safe-area-inset-bottom)` 用于兼容 iOS 11.2beta+

  

### 首页

- 下拉刷新
- `<swiper>` 轮播图商品展示
- 搜索栏组件的引用，并且通过滚动监听实现固定定位，目的为了能配合下拉刷新时页面样式统一
- 分类导航
- 推荐商品楼层展示

### 商品分类

- 搜索栏组件引用
- 固定侧边分类导航栏
- 右侧商品子类展示
- `v-if` 判断当前分类索引控制展示商品分类数据中的子类数据

### 商品搜索

- 初次进入空列表显示初始文本
- 搜索框输入内容
- 点击搜索按钮进行搜索
- 搜索请求未响应时阻止用户重复点击搜索按钮
- 商品项组件引用，展示搜索结果的信息
- 如果没有搜索数据则显示空列表状态

### 商品列表

- 下拉刷新，重置分页效果
- 搜索栏组件引用，并且通过滚动监听实现固定定位，目的为了能配合下拉刷新时页面样式统一分类导航
- 自定义 `tabbar` 组件引用，实现不在 `tabbar` 配置中的路由也能显示 `tabbar`
- 筛选栏，滚动监听筛选栏固定定位，并设置出现过渡效果
- 通过 `onReachBottom` 实现瀑布流分页效果，并且做函数节流，阻止用户过快滚动到底部加载数据
- 商品项组件引用，展示商品信息，并且点击组件时跳转到对应商品详情

> **注意** 本案例使用官方案例的自定义 tabbar ，但是官方在自定义 tabbar 上使用了 cover-view 和 cover-image，如果用到 iOS 上显示，在引用 tabbar 的页面（在全局 "tabbar" 的 list 中没有的页面），比如这个**商品列表页**，会出现 tabbar 位置跳动的问题，最终改为 view image 标签进行解决
>
> 类似问题参考：
>
> - [自定义tabbar 在iPhone 8p中出现位置上移 | 微信开放社区 (qq.com)](https://developers.weixin.qq.com/community/develop/doc/000c240016caa09113096717656800)
> - [底部自定义tabbar | 微信开放社区 (qq.com)](https://developers.weixin.qq.com/community/develop/doc/000c0a903407385e0658a47035b400)

### 商品详情

- `<swiper>` 展示商品图片列表，如果商品无图片，隐藏索引点并且显示空图片
- 商品信息展示
- 分享：调用微信分享
- 收藏，将收藏商品部分信息存储到本地并且改变收藏图标状态
- `<rich-text>` 显示商品图文详情，图文详情为空时显示空状态
- 联系客服：调用微信联系客服 Api
- 购物车：跳转到购物车页
- 加入购物车：将当前商品部分数据存储到本地并且改变购物车图标状态，并显示信息提示
- 立即购买：将当前商品部分数据存储到本地后并且跳转到购物车

### 购物车

- 商品项组件的引用，开放出商品组件的选中、数量增减、数量显示、商品信息显示、点击图片跳转、点击商品信息选中商品的功能
- 商品总计栏组件引用：
  - 全选
  - 计算总价，利用 `Array.prototype.reduce` 进行加总
  - 删除按钮，如果没有选中商品则提示用户选中商品，如果没有商品则隐藏删除按钮
  - 结算，如果没有选中到商品则禁用结算按钮

### 支付

- 地址栏，如果本地存储没有地址信息则显示未选地址状态，如果本地存储有地址信息数据，则直接填充地址栏
- 商品组件引用，开放商品图片展示、商品信息展示、商品数量显示功能
- 商品总计栏组件引用：
  - 计算总价，利用 `Array.prototype.reduce` 进行加总
  - 支付按钮
- 商品支付
  - 登录状态判断，如果未登录，则提示用户登录
  - 以下操作都是在登录成功的前提条件下才能进行
  - 请求后端服务获取订单号码
  - 通过订单号码再次请求后端服务获取支付参数
  - 通过支付参数调用微信 API 生成付款码进行支付
  - 如果中断支付，则提示用户并且跳转到订单页切换成未付款选项
  - 如果支付成功，则提示用户并且跳转到订单页切换成未发货选项

### 个人中心

- 用户头像信息栏
  - 如果未登录则显示去登录的按钮
  - 如果登录成功，则显示用户头像与用于昵称
- 订单操作栏
  - 如果未登录，则点击一下选项会跳转到登录页
  - 点击待付款跳转到订单页并且切换成待付款选项
  - 点击全部订单则跳转订单页
  - 点击收藏，跳转到商品收藏页
- 联系客服，调用微信拨打电话 API，点击会拨打电话
- 意见反馈，跳转到意见反馈页
- 注销，清除本地存储中的用户数据，将用户头像信息栏状态改为未登录状态，并提示

### 登录

- 点击登录按钮调用微信登录 API
- 登录成功后显示欢迎信息并且页面回跳

### 订单查询

- 订单选项：全部、待付款、待发货
- 点击不同的订单选项向后端服务器请求不同状态的订单数据，每次点击不同的选项卡都会从第一页获取
- 瀑布流分页功能，配合滚动监听发送请求到后端服务器，获取下一页的数据

### 意见反馈

- 多选的问题类型按钮
- 问题描述内容填写
- 限制上传 4 张图片

### 收藏

- 获取在商品详情页存储到本地的收藏商品数据
- 引用商品项组件，显示商品信息，点击商品项跳转会对应的商品详情

