//这里文件夹专门用来配置静态文件的一个引用位置
let path = require("path");
let CONFIG = {
    views:[path.resolve('views')],//这里如果配置的是一个数组【】，则会从这多个数组里面进行查询跟加载
};
module.exports = CONFIG;