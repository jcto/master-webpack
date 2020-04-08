// 这是入口文件
// 使用样式 css文件
import("./index.css");
// 使用样式 less文件
// 使用图片
import img from './assets/01.jpg'

var image=new Image()
image.src=img


document.querySelector('body').appendChild(image)