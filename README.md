## EasyAi-uniapp-再开发版本
EasyAi-uniapp—前端优化（二开）版本
起初是因为有位朋友说有这方面的需求，于是我就做出来了，结果这哥们只是随口说说搞得我很尴尬，果然搞技术的就是心眼子太少了。于是，秉承着官方的开源精神。我把这套而开前端分享给大家。适用于官方3.1.0版本的后端  
大家如果有什么问题可以加作者微信：hdmlgzs  
如果你觉得这个项目帮到你了，可以请作者喝个咖啡，我肯定会熬夜赶进度的    
## 另外，作者还支持该小程序的定制修改，以及Comfyui的定制节点，有需要可以加作者微信咨询：hdmlgzs  
## 关于小程序不能链接 xxxxxxxx/websocket的报错，需要在nginx后台中再以3002端口配置一个/websocket的反向代理就可以了



## 安装教程  
【官网文档】：https://doc.51easyai.com/getting-started/quickstart

#### 使用方法:  
物料准备：微信小程序开发工具、HbX(https://www.dcloud.io/hbuilderx.html)  
0. 使用小程序前，请按照官方的文档把相关配置配置好，小程序如果要部署，需要https，已经配置合法域名。  
0.1 修改.env文件中的域名或ip(体验的话可以暂时使用作者的服务器)  
0.2 编译使用该工具（https://www.dcloud.io/hbuilderx.html）直接运行到小程序即可，如果要发布建议点发布-运行  
1.直接创建一个文件夹，然后把项目解压或者克隆进去  
2. 用管理员身份打开命令行窗口，输入npm -i   
3.安装完成后，打开hbuilderX，右键，导入本地项目  
4.然后进入src/pages/index/index,运行到微信开发者工具即可  
5.麻烦大家不要用作者的oss图片，作者是按量付费的，项目也没做成，钱也花了一大堆。我把前端用到的静态资源给大家放在/src/static文件里了。大家自己上传oss替换掉就行了

## 2025/4/2第5次更新  
## 0. 修改了一些显而易见的bug  
### 1. 等官方把邀请码接口修改了会有一次大更新，已经给官方提交需求半个月了。
### 2. 官方的新功能还没有兼容

## 2025/3/1第4次更新  
### 0.  新增控制台（权限需要在普通管理员以及之上），目前只有轮播图管理功能，其他功能慢慢加  


      


## 2025/2/24第3次更新  
### 0. 优化了绘画历史图片显示，新增加画廊  
### 1. 优化了个人主页的ui 
<img src="https://github.com/chinahu-woker/easyai2work/blob/master/20250224myself.png" width="210px"/><img src="https://github.com/chinahu-woker/easyai2work/blob/master/pic.png" width="210px"/>

  
  
  
## 2025/2/16第2次更新
### 0. 修改.env文件里的域名VITE_CHAT_URL是你oneapi的域名（完成大语言模型配置）
### 1. 新增加了AI聊天页面，支持对接官方的oneapi接口，可以通过oneapi对接各大ai厂商，实现对话功能    
### 2.优化了包的大小，超过2M小程序不能上传，把之前的图片全删了，大家可以直接用我的oss下载图片  
### 3. 支持官方3.0.2版本的管理后台  
### 4. 搭建之前请按照官方文档把所有的配置都配置好！！！  
### 5. 支持点击消息复制消息，AI对话，模型/渠道选择（oneapi的渠道）

  
## 2025/2/8第一次更新;
### 1.重新设计了官方的ui设计
### 2.创意页面可以显示视频、图片
### 3.新增加了音频上传组件，可以上传和播放音频(使用音频组件需要在后台工作流配置的时候设置默认值，而且默认值后缀必须是mp3，可以是音频url)
### 4.修改了绘画历史的展示方式
### 5.绘画历史可以显示：图+文、视频、图片的
### 6.新添加了微信客服的功能
### 7.添加了工作流展示
<img src="https://github.com/chinahu-woker/easyai2work/blob/master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250208193439.png" width="210px"/><img src="https://github.com/chinahu-woker/easyai2work/blob/master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250208193548.png" width="210px"><img src="https://github.com/chinahu-woker/easyai2work/blob/master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250208193616.png" width="210px"><img src="https://github.com/chinahu-woker/easyai2work/blob/master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250208193623.png" width="210px"><img src="https://github.com/chinahu-woker/easyai2work/blob/master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250208193627.png" width="210px"><img src="https://github.com/chinahu-woker/easyai2work/blob/master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20250208193635.png" width="210px">









