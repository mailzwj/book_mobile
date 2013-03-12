mobilelib（UX图书管理系统移动版）
=========

###1、preview

- 下载`assets`文件夹中的文件覆盖本地工程中的`assets`目录下文件
- 修改`js/library.js`中`$.sessionStorage.setItem("host", "http://10.13.124.197:8080");`的host值为自己的数据接口主机地址。
- 如果报错，确保src文件夹下的super.loadUrl()地址正确

###2、调试
- phonegap支持weinre调试并提供了一个在线工具：<http://debug.phonegap.com/>，尽情调试吧，少年！
