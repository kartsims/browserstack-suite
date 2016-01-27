exports = module.exports = function(req, res) {

	// TODO : sign out from Keystone too

	// clear cookie for authorizing the app access
	res.clearCookie('authorizedApp');
	req.flash('success', 'You have been successfully signed out');

	res.redirect('signin');
};
