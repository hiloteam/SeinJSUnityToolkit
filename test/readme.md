# test

一个基于Sein.js的游戏。

官网：http://seinjs.com

## 开发

安装依赖并启动开发：

```shell
npm i
npm run dev
```

然后直接可以在`localhost:8888`打开开发。

## 构建生产版本

执行以下命令可以构建生产版本：

```shell
npm run build
```

将会构建到`dist`目录中。

## 注意事项

1. 可以自行修改`webpack`配置中的`seinjs-gltf-loader`参数，来决定如何压缩、打包和发布gltf资源，详见[seinjs-gltf-loader](http://seinjs.com/cn/extension/toolchains/seinjs-gltf-loader)
2. 可以自行修改`webpack`配置中的`seinjs-atlas-loader`参数，来决定如何发布图集资源，详见[seinjs-atlas-loader](http://seinjs.com/cn/extension/toolchains/seinjs-atlas-loader)。
