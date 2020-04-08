# master-webpack
精通，熟练使用webpack

## 第一步先会简单使用webpack
- 命令行方式 使用场景不普遍，一般用处不大，不研究
- 配置文件方式：加载执行配置文件进行使用webpack，项目中叫常使用。

### 初始化项目环境
```bash
# 快速初始化package.json
npm init -y
# 本地安装
npm install webpack webpack-cli --save-dev

# 执行webpack 或者package.json文件配置执行脚本 dev
npx webpack
npm run dev

# 安装加载css相关loader
npm install --save-dev style-loader css-loader

# 安装 加载图片 file-loader
npm install --save-dev file-loader

```

### 简单业务场景
- 一个入口
- 依赖第三方模块库
- 依赖自己编写的模块
- 使用loader加载图片，样式. 学习loader配置使用
- 输出到dist目录下的step1目录下
- 开发环境
- 使用sourcemap方便调试
- 每次构建之前把相应输出目录清空
- 使用html模板

### 产品内容
- 显示一个helloword标题
- 显示一张图片
- 使用自定义样式
### 相关loader
- css-loader
- style-loader
- file-loader

### 相关插件
- clean-webpack-plugin
- html-webpack-plugin
### 注意事项
- output.path选项要是绝对地址字符串

### 本step回顾
- 安装webpack
- 配置文件
- 使用loader
- 使用plugin

