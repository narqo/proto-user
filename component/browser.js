var uatraits = {
    Detector : function() {}
};
var UserError = require('../').UserError;

function Browser(params) {
    this.name = 'browser';
    this.detector = new uatraits.Detector(params.dataPath);
}

Browser.prototype._initialize = function(req, res) {
    return {
        platform : 'MacIntel',
        product : 'Gecko'
    };
};

module.exports = Browser;
