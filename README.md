mobilelib（UX图书管理系统移动版）
=========

###1、安装
1. 参照<http://www.phonegap.cn/?page_id=442#android>安装好Eclipse等必备工具并创建好一个Android project后，将本仓库内的四个文件夹和AndroidManifest.xml替换掉刚创建好的Android project相应文件夹及文件；
2. 确保本地web仓库<https://github.com/mailzwj/book>代码最新并启动服务后;
3. 修改`assets/js/library.js`中`$.sessionStorage.setItem("host", "http://10.13.124.197:8080");`的host值为自己的数据接口主机地址。
4. run!!!


###2、调试
- phonegap支持weinre调试并提供了一个在线工具：<http://debug.phonegap.com/>，尽情调试吧，少年！
