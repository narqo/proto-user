var Terror = require('terror');
var vow = require('vow');

var Err = Terror.create('UserError', {
    NO_COMPONENT : 'No component passed',
    UNKNOWN_COMPONENT : 'Unknown component "%name%"'
});

function Manager() {
    this.components = {};
}

Manager.prototype.registerComponent = function(name, component) {
    this.components[name] = {
        component : component
    };
};

Manager.prototype._component = function(name) {
    if(!this.components[name]) {
        throw Err.createError(Err.CODES.UNKNOWN_COMPONENT, { name : name });
    }
    return this.components[name];
};

function User(req, res, manager) {
    this.req = req;
    this.res = res;
    this._manager = manager;
}

User.prototype.init = function(names_) {
    var names;
    if(typeof names_ == 'undefined') {
        throw Err.createError(Err.CODES.NO_COMPONENT);
    } else if(arguments.length === 1) {
        names = [names_];
    } else {
        names = Array.prototype.slice.call(arguments);
    }
    return this._init(names).then(function() { return this }, this);
};

User.prototype._init = function(names) {
    var _this = this,
        manager = this._manager;

    return names.reduce(function(promise, name) {
        return promise.then(function() {
            var componentPtp = manager._component(name).component,
                component = Object.create(componentPtp);
            return component._initialize(_this.req, _this.res);
        })
        .then(function(compData) {
            _this[name] = compData;
            return _this;
        });
    }, vow.resolve());
};

var manager = new Manager();

module.exports = exports = function user(params) {
    var names, initFn;

    if(typeof params === 'function') {
        initFn = params;
    } else {
        names = Array.prototype.slice.call(arguments);
        initFn = function(req, res) {
            return req.user._init(names);
        }
    }

    return function userMiddleware(req, res, next) {
        req.user = new User(req, res, manager);
        vow.invoke(initFn, req, res).then(function() { next() }, next);
    };
};

exports.registerComponent = function(name, component) {
    if(arguments.length === 1) {
        component = name;
        name = component.name;
    }
    manager.registerComponent(name, component);
};

exports.User = User;
exports.UserError = Err;
