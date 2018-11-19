## rn-img-cache

首先，该项目是在[react-native-img-cache](https://github.com/wcandillon/react-native-img-cache)的基础上修改的。[react-native-img-cache](https://github.com/wcandillon/react-native-img-cache)很好用，但是在实际使用过程中我发现它采取的下载机制没有对下载的内容做一个完整性的校验，这就导致图片可能只下载了一半(比如中途杀进程)而无法显示完整。我本来打算着手根据http的content-length来判断下下载内容是否完整，但是发现它内部的[RNFetchBlob](https://github.com/joltup/rn-fetch-blob)并没有抛出回调，我打算从js端着手，思路很简单，就是在下载的时候给文件一个临时名称，当下载完成后再修改回来，这样唯一的坏处就是之前下了一部分的不完整图片浪费掉了，但是我觉得这个影响完全可以忽略。

### 使用方式

直接下载引用即可

```js
import {CachedImage}            from "./rn-img-cache";
<CachedImage style={[{
        height: 100,
        width: 100,
	}]}
source={{uri: "https://img.jpg"}}/>
```
