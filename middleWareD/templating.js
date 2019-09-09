const nunjucks = require('nunjucks');
const fs = require('fs');

function createEnv(path, opts) {
    
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape;
    var noCache = opts.noCache || false;
    var watch = opts.watch || false;
    var throwOnUndefined = opts.throwOnUndefined || true;
    console.log(`控制输出是否被转义=>${autoescape}`);
    console.log(`使用缓存，每次都重新编译=>${noCache}`);
    console.log(`文件系统上的模板变化了，系统会自动更新他。使用前请确保已安装可选依赖 =>${watch}`);
    console.log(`当输出为 null 或 undefined 会抛出异常=>:${throwOnUndefined}`);
    
    //这里判断是否是启用指定的文件位置，如果不是的时候，则输出
    
    // var stat = fs.lstatSync(path);
    // var is_direc = stat.isDirectory();// true || false 判断是不是文件夹
    // if(is_direc){
    //     console.log(`当前使用的位置是${path}`)
    // }
    console.log(`当前使用的位置是====${path}`);
    var env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path || "views", {
                noCache: noCache,//(default: false) 不使用缓存，每次都重新编译
                watch: watch,//文件系统上的模板变化了，系统会自动更新他。使用前请确保已安装可选依赖 chokidar。  
            }), {
                autoescape: autoescape,//(默认值: true) 控制输出是否被转义
                throwOnUndefined: throwOnUndefined//当输出为 null 或 undefined 会抛出异常
            });
        
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function templating(path, opts) {
    // 创建Nunjucks的env对象;
    var env = createEnv(path, opts);
    // console.log(env)
    return async (ctx, next) => {
        // 给ctx绑定render函数:
        ctx.render = function (view, model) {
            // 把render后的内容赋值给response.body:
            console.log(env.render(view, Object.assign({}, ctx.state || {}, model || {})))
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            // 设置Content-Type:
            ctx.response.type = 'text/html';
            
        };
        // 继续处理请求:
        await next();
    };
}

module.exports = templating;