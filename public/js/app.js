// pour eviter les erreurs de linter :-/
var $ = $ || null;
var Vue = Vue || null;

$(function() {

	new Vue({
		el: 'body',
		methods: {
			// LOAD BUILDS LIST
			loadBuilds: function() {
				var self = this;
				$.getJSON('/builds.json', function(data) {
					self.builds = data;
					if (data.length > 0) {
						self.viewBuild(data[0]);
					}
				});
			},
			// SCREENSHOTS
			viewScreenshot: function(screenshot) {
				this.currentScreenshotBrowser = screenshot.Browser.name;
				this.currentScreenshotUri = screenshot.url.replace(/^(https?\:\/\/)?[^\/]*/, '');
				this.currentScreenshot = screenshot;
			},
			// NAVIGATION
			switchBrowser: function(browserName) {
				if (typeof browserName === 'undefined') {
					browserName = $('#current-browser').val();
				}

				var self = this;
				var screenshot = this.currentBuild.screenshots.filter(function(screenshot) {
					return screenshot.Browser.name === browserName && screenshot.url === self.currentScreenshot.url;
				});

				// aucun screenshot correspondant à ce browser pour la même URL
				if (screenshot.length === 0) {
					return this.viewScreenshot(this.currentBuild.screenshots[0]);
				}

				return this.viewScreenshot(screenshot[0]);
			},
			switchUri: function(uri) {
				if (typeof uri === 'undefined') {
					uri = $('#current-uri').val();
				}

				var self = this;
				var screenshot = this.currentBuild.screenshots.filter(function(screenshot) {
					return screenshot.url === self.currentBuild.appInstance.baseurl + uri && screenshot.Browser.name === self.currentScreenshot.Browser.name;
				});

				// aucun screenshot correspondant à ce browser pour la même URL
				if (screenshot.length === 0) {
					return this.viewScreenshot(this.currentBuild.screenshots[0]);
				}

				return this.viewScreenshot(screenshot[0]);
			},
			// BUILDS
			switchBuild: function(offset) {
				var buildIndex = this.builds.indexOf(this.currentBuild) + offset;
				if (buildIndex < this.builds.length && buildIndex >= 0) {
					this.viewBuild(this.builds[buildIndex]);
				}
			},
			viewBuild: function(build) {
				var self = this;
				this.loadBuild(build, function() {
					self.currentBuild = build;
					console.log(build);

					if (typeof build.screenshots === 'undefined' || build.screenshots.length === 0) {
						self.currentScreenshot = null;
						return;
					}

					self.viewScreenshot(build.screenshots[0]);

					self.currentBuildBrowsers = build.screenshots.map(function(screenshot) {
						return screenshot.Browser.name;
					});
					self.currentBuildBrowsers = self.currentBuildBrowsers.filter(function(value, index, self) {
						return self.indexOf(value) === index;
					});
				});
			},
			loadBuild: function(build, cb) {
				if (typeof(build.screenshots) === 'undefined') {
					$.getJSON('/builds/' + build._id + '.json', function(data) {
						build.screenshots = data.screenshots;
						if (typeof cb !== 'undefined') {
							cb();
						}
					});
				} else if (typeof cb !== 'undefined') {
					cb();
				}
			},
			// KEY BINDINGS
			initKeyEvents: function(){
				var self = this;
				$(document).keydown(function(e) {
					// ctrl-right
					if (e.ctrlKey && e.which === 39) {
						self.switchBuild(-1);
					}
					// ctrl-left
					else if (e.ctrlKey && e.which === 37) {
						self.switchBuild(1);
					}
					// up
					else if (e.which === 38) {
						var newOption = $('#current-uri :selected').prev();
						if (newOption.length > 0) {
							$('#current-uri').val(newOption.val());
							self.switchUri();
						}
					}
					// down
					else if (e.which === 40) {
						var newOption = $('#current-uri :selected').next();
						if (newOption.length > 0) {
							$('#current-uri').val(newOption.val());
							self.switchUri();
						}
					}
					// left
					else if (e.which === 37) {
						var newOption = $('#current-browser :selected').prev();
						if (newOption.length > 0) {
							$('#current-browser').val(newOption.val());
							self.switchBrowser();
						}
					}
					// right
					else if (e.which === 39) {
						var newOption = $('#current-browser :selected').next();
						if (newOption.length > 0) {
							$('#current-browser').val(newOption.val());
							self.switchBrowser();
						}
					}
					// other
					else {
						return;
					}
					e.preventDefault();
				});
			},
			hideKeyPanels: function() {
		    var d = new Date();
		    d.setTime(d.getTime() + (9999*24*60*60*1000));
		    document.cookie = "showKeyPanels=0; expires=" + d.toUTCString();
				$('#key-bindings').slideUp();
			},
			showKeyPanels: function() {
				if (!document.cookie.match(/showKeyPanels=0/)) {
					$('#key-bindings').slideDown();
				}
			}
		},
		created: function() {
			this.initKeyEvents();
		},
		compiled: function() {
			this.loadBuilds();
			this.showKeyPanels();
		},
		data: {
			currentScreenshot: null,
			currentScreenshotUri: null,
			currentScreenshotBrowser: null,
			currentBuild: null,
			currentBuildBrowsers: null,
			builds: []
		}
	});
});
