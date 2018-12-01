# rn-img-cache
First, this project is improved from [react-native-img-cache](https://github.com/wcandillon/react-native-img-cache). Honestly, [react-native-img-cache](https://github.com/wcandillon/react-native-img-cache) is very easy to use, but I don't find it verifing whether the file correct in my real worikng situation, so sometimes we just could see a part of a image(kill the app process when downloading the image).So I modified the code to create a temp file when downloading, and made it right after the downloading was done. It's just so easy.

## Showcase

### incomplete image

<img width=500 height=400 src="./test/test.png"/>

### real origin image

[show the origin image](https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1210/01/c1/14222204_14222204_1349049772031.jpg)
<br>
<img width=500 height=400 src="./test/img.png"/>

### fade anim

<img width=500 height=400 src="./test/show.gif"/>

## Installation

### rn-fetch-blob
This package has a dependency with [rn-fetch-blob](https://github.com/joltup/rn-fetch-blob).
If your project doesn't have a dependency with this package already, please refer to [their installation instructions](https://github.com/joltup/rn-fetch-blob#user-content-installation).

```bash
npm install rn-img-cache
```

## Usage

```js
import {CachedImage} from "rn-img-cache";
//the defaultImg
const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
//const preview = require("xxx");
const uri = "https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1210/01/c1/14222204_14222204_1349049772031.jpg";
//the http request config , it's optional
let options={
    method:'GET',
    headers:{"Content-Type":"image/jpg"}
}
<CachedImage style={[{
        height: 100,
        width: 100,
}]}
transitionDuration={4000} //the fadeIn anim duration
{...{preview,options, uri}}/>
```
- if both <b>defaultSource</b> and <b>preview</b> all defined , use <b>preview</b> finally.

- preview, we can use require or uri

- uri, the remote image file

- options(optional),  when requesting the remote , we can set the http method&headers by this param

- transitionDuration(optional,default 300ms), the fadeIn anim duration (ms)

---

首先，该项目是在[react-native-img-cache](https://github.com/wcandillon/react-native-img-cache)的基础上修改的。[react-native-img-cache](https://github.com/wcandillon/react-native-img-cache)很好用，但是在实际使用过程中我发现它采取的下载机制没有对下载的内容做一个完整性的校验，这就导致图片可能只下载了一半(比如中途杀进程)而无法显示完整。我本来打算着手根据http的content-length来判断下下载内容是否完整，但是发现它内部的[RNFetchBlob](https://github.com/joltup/rn-fetch-blob)并没有抛出回调，我打算从js端着手，思路很简单，就是在下载的时候给文件一个临时名称，当下载完成后再修改回来，这样唯一的坏处就是之前下了一部分的不完整图片浪费掉了，但是我觉得这个影响完全可以忽略。
## 示例

### 不完整显示

<img width=500 height=400 src="./test/test.png"/>

### 实际图片

[查看原图](https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1210/01/c1/14222204_14222204_1349049772031.jpg)
<br>
<img width=500 height=400 src="./test/img.png"/>

### 渐显效果

<img width=500 height=400 src="./test/show.gif"/>

## 安装

```bash
npm install rn-img-cache
```

## 使用方式

直接下载引用即可

```jsx
import {CachedImage} from "rn-img-cache";
//默认图片
const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
//const preview = require("xxx");
const uri = "https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1210/01/c1/14222204_14222204_1349049772031.jpg";
//下载图片的请求头设置
let options={
    method:'GET',
    headers:{"Content-Type":"image/jpg"}
}
<CachedImage style={[{
        height: 100,
        width: 100,
}]}
transitionDuration={4000} //下载完成后图片渐变显示的时长(淡入效果)
{...{preview,options, uri}}/>
```

- 如果<b>defaultSource</b>和<b>preview</b>都定义了，则优先选择<b>preview</b>

- preview, 可以设置本地资源(require)和网络资源(uri)

- uri, 网络图片的地址

- options(可选的),  请求网络图片的时候，可以设置请求头信息

- transitionDuration(可选的,默认 300毫秒), 渐显动画的时长，单位毫秒
