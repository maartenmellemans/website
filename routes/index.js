/*
 * GET home page.
 */

 var auth = require('http-auth');

 var basic = auth({
 	authRealm: "Private area.",
 	authList: ['maarten:testtest']
 })

exports.index = function(req, res){
	res.render('index', {message:"ingelogd"});
};

exports.partials = function (req, res) {
	var name = req.params.name;

	if (name== "admin") {
	  	basic.apply(req, res, function(username) {
	  		res.render('partials/' + name);
	  	});
	} else {
		res.render('partials/' + name);
	}
};
