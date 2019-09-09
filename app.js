// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('koa-bodyparser');
console.log("/middleWareD/controllers")
// let staticFiles = require(__dirname+'/middleWareD/static-files');
const middleWareD_controllers = require(__dirname+'/middleWareD/controllers');
const CONFIG = require(__dirname+"/config");
const templating = require(__dirname+'/middleWareD/templating');
// 这里我们定义了一个常量isProduction，它判断当前环境是否是production环境。
//如果是，就使用缓存，如果不是，就关闭缓存。在开发环境下，关闭缓存后，我们修改View，可以直接刷新浏览器看到效果，否则，每次修改都必须重启Node程序，会极大地降低开发效率。
// Node.js在全局变量process中定义了一个环境变量env.NODE_ENV，为什么要使用该环境变量？因为我们在开发的时候，环境变量应该设置为'development'，而部署到服务器时，环境变量应该设置为'production'。在编写代码的时候，要根据当前环境作不同的判断。
// 注意：生产环境上必须配置环境变量NODE_ENV = 'production'
// 而开发环境不需要配置，实际上NODE_ENV可能是undefined，所以判断的时候，不要用NODE_ENV === 'development'。
process.env.NNODE_ENV = 'development';//这里表示的是开发者模式
const isProduction = process.env.NODE_ENV === 'production';//判断当前是不是生产的环境

// 这是因为在生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。

//这里表示是不是非开发环境，是的话，则需要从



// 创建一个Koa对象表示web app本身:
const app = new Koa();
// 第一个middleware是记录URL以及页面执行时间：
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// 第二个middleware处理静态文件：
if (! isProduction) {
    let staticFiles = require(__dirname+'/middleWareD/static-files');
    // 这个是获取静态文件访问的一个位置
    app.use(staticFiles('/static/', __dirname + '/static'));
}



//bodyParser()middleware解析POST请求
//由于middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上。
app.use(bodyParser());

//这里是获取指定的一个视图存放的一个位置
app.use(templating(CONFIG.views, {
    noCache: !isProduction,
    watch: !isProduction
}));

// 使用middleware -- middleWareD_controllers[使用中间件，去加载路由里面的接口];
app.use(middleWareD_controllers('/controllers'));
//这里假如触发不到

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');