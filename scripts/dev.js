"use strict";
// 开发环境变量配置
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";


const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('../webpack.config');

const config = configFactory('development');

