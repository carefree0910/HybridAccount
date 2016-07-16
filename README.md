# Blend-Account
Ionic + Mongoose

学习全栈时为巩固所学知识而做的安卓小作品

使用和测试方法（完整的功能测试只能在安卓模拟器上进行）：

  1）下载 MongoDB
  
  2）在 ./MongoDB 下执行 mongod --dbpath-data
  
  3）在 ./Server 下执行 npm install 和 npm start
  
  4）在 ./Main 下执行 ionic platform add android 和 ionic build android
  
  5）将 ./Main/www/js/services.js 中的 (your ip here) 换成测试机器的 ip 地址
  
  6）在 ./Main 下执行 ionic emulate android 即可进行测试（如果直接这样不行，可以试试先打开安卓模拟器再执行命令）
