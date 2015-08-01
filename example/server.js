var http = require('http'),
    connect = require('connect'),
    bodyParser = require('body-parser'),
    user = require('../'),
    Browser = require('../component/browser'),
    Region = require('../component/region');
    //Auth = require('../component/auth');

user.registerComponent(new Browser({
    dataPath : '/usr/share/uatraits/browser.xml'
}));

user.registerComponent(new Region({
    geodataPath : '/run/geobaas/geobaas.sock'
}));
//
//user.registerComponent(new Auth({
//    blackbox : {
//        host : 'passport.yandex.ru',
//        port : 443
//    }
//}));

var app = connect();
app.use(bodyParser.urlencoded({ extended : true }));

// 1. Simple middleware
/*
app.use(
    user('browser', 'auth', 'region'),
    function(req, res, next) {
        console.log(req.user);
    }
);
*/

// 2. Custom `user` initialization logic

app.use(
    user(function(req, res) {
        return req.user.init('browser').then(function(user) {
            //var redirect = user.auth.redirect;
            //if(redirect) {
            //  throw new Error('EREDIRIN', redirect.location);
            //}
            return user.init('region');
        });
    }),
    function(req, res) {
        console.log('??????');
        console.log(req.user.region, req.user.browser);
        res.end('Ok!');
    }
);

http.createServer(app).listen(3001);
