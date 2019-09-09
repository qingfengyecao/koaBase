
//所有页面的调用，都要从这个页面上进行一个引用和调用；
var fn_index = async (ctx, next) => {
    ctx.render('hello.html',{name: "小明"});
};

module.exports = {
    'GET /': fn_index,//这个是缓存主页的一个信息
};