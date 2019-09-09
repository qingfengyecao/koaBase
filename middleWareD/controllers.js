const fs = require('fs');
var path = require('path');
//添加遍历循环映射
function addMapping(router, mapping) {
    // console.log(`oo:`+JSON.stringify(router));
    // console.log(`oo----:`+JSON.stringify(mapping));
    // console.log(`当前调用的是${router}`)
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`映射了一个get: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`映射了一个: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
function addControllers(router, dir) {
    //遍历文件夹
    var files = fs.readdirSync(process.cwd() + dir);
    // includes()：返回布尔值，表示是否找到了参数字符串。 
    // startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。 
    // endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
    //这是过滤并且返回后缀是js的文件
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    //获取到 -- js_files 的数组，里面包含着 js 的数组；
    for (var f of js_files) {
        // 添加映射；
        //这里需要进行一个判断当前这个文件里面的文件是否是能够正确执行的；
        // 如果里面没有错误的话，则需要对其进行调用一个函数addMapping();
        // let mapping = require(process.cwd() + dir+ "/"+f);
        // addMapping(router, mapping);
        try{
            let str_file = fs.readFileSync(process.cwd() + dir+ "/"+f,'utf-8');
            // console.log(JSON.stringify(str_file));
            // eval(str_file); //经过测试，这里并不用利用eval,去判断文件是否代码有错误；
            let mapping = require(process.cwd() + dir+ "/"+f);
            addMapping(router, mapping);
        }catch(err){
            //这里要对日志进行一个打印，因为启动文件在加载路由的时候有报错的一个行为；
            console.log(`日志报错的位置：${process.cwd()}执行路由加载的时候，${process.cwd() + dir+ "/"+f}内的文件有错误，错误类型：${err.stack}`);
        }
    }
}
module.exports = function (dir) {
    let
        controllers_dir = dir || '/controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};