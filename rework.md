# 重构规划

重构预计在八月底前完成，第一期只要能够完全还原当前的所有功能和特性即可。

## 开发规范

1. 所以非必须使用别的`namespace`的类、函数、结构体等等，全部放到`SeinJS`命名空间下隔离，规范的同时以防不测。
2. 其他没啥规范了，按照自己的喜好就行（当然格式还是要统一的）。

## 目录结构

顶层分为两个目录，**bin**目录中存有最终的Toolkit的unitypackage包，而实际的开发工程在**project**目录下，其是一个Unity工程。

### Assets/SeinJSUnityToolkit

存储着实际的Toolkit的代码，具体见下面**SeinJSUnityToolkit**一节。

### Assets/Resources

其中保存着所有测试用的模型资源，可以用这些资源进行工具特性的测试。

### SeinCustomMaterials

用于存储自定义的Sein.js材质，用于`Sein_customMaterials`的测试。

### Demos

存储着一些场景，每个场景代表一种或多种特性，具体见下面**Demos**一节。

## SeinJSUnityToolkit

对于实际的扩展工程，其代码结构也非常清晰：

### Dependencies

存放着依赖库，目前有GlTF官方序列化库、Zip库和Json库。

### Common

工具中通用的代码库，里面主要存储着GlTF相关的一些通用资源操作，以及包含检查更新逻辑的`SeinUtils`。

### Exporter

工具的导出部分，需要大幅重构，理想中是一个`ExporterWindow`类用于处理导出界面，`Exporter`类用于代理实际的导出操作。

### Importer

工具的导入部分，基本逻辑已然清晰，不需要大幅修改（只需处理好计划中的Extension部分）。

### Extensions

所有Sein.js中内核需要集成的标准扩展存放的地方，需要大幅重构，理想状况是每个扩展一个文件，足够覆盖掉序列化和反序列化的所有能力。

### Converter

转换器，目前主要存放着从Unity标准材质到Sein.js材质的转换器。

### Shaders

Sein.js默认集成的材质存放的地方，最重要的是`Sein/PBR`，其他都可有可无。

### Broswer

备用文件夹，为未来的资源在线管理部分预留。

## Demos

>由于还没重构完成，编译错误的原因，所以有些DEMO场景暂时无法实现（比如Sein扩展、材质等部分）。

### Basic

基础测试集，用于测试各种基础能力：  

1. 基本模型的图元数据导出、图片数据导出、材质数据导出。
2. 多个相同的模型只导出一份图元数据，多个相同材质只导出一份材质数据。
3. 测试打包导出和每个顶层节点分别导出的能力。
4. 测试图片导出时的压缩和强制导出PNG选项的正确。
5. 导出时清空文件夹的提示。
6. 是否能保存上一次选择。

### UnityPBR

用于测试Unity的三种基准材质是否能正确导出到GlTF规定的PBR。

### SeinPBR

用于测试Sein/PBR材质的导出是否正确。同时测试`Unlit Mode`、`Blend mode`、`cloneForInst`这些选项是否有用。

### CustomMaterial

用于测试自定义材质的两种模式（`SeinCustomMaterial`组件或者`Sein/XXX`编写的材质）的导出是否正确。

### SkinAnimation

用于测试蒙皮信息和动画数据是否能够正确导出。

### Morph

用于测试变形体是否能正常导出。

### CameraAndLight

测试摄像机和灯光是否能正常导出，灯光目前也包括当`LightSetting`中环境光设为`Color`时的环境光。

### BasicExtensions

一些SeinJS基础扩展的测试，包括：  

1. Sein_Node
2. Sein_animator
3. Sein_physicBody
4. Sein_renderer的阴影和gamma矫正部分

### AudioExtension

测试音频扩展系统的导出是否正常：

1. Sein_audioClip
2. Sein_audioSource
3. Sein_audioListener

### LightMapExtension

测试`Sein_renderer`扩展中的光照贴图部分是否正确。

### IBLExtension

测试IBL系统扩展`Sein_ibl`导出是否正确。

### 导入

导入部分需要自行用GlTF或ZIP文件测试，只需要保证导出和导出的东西完全一致（包括组件）即可。
