function Region(params) {
    this.name = 'region';
    this.geodataPath = params.geodataPath;
}

Region.prototype._initialize = function(req, res) {
    return {
        platform : 'MacIntel',
        product : 'Gecko'
    };
};

module.exports = Region;
