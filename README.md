# Installation

	npm install

# Usage

	node bin/screenshot.js --help

# Dev

Pour dev sur l'UI : `grunt serve`

# Troubleshooting

Si au lancement de l'application, ce message apparaît :

	{ [Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND' }
	js-bson: Failed to load c++ bson extension, using pure JS version

Il suffit d'éxécuter la commande suivante ([Source](http://stackoverflow.com/a/28932441/3169999))

	cp node_modules/bson/browser_build/bson.js node_modules/bson/build/Release/bson.js

# Mettre à jour la liste des browsers

	npm run update-browsers

Ajoute les nouveaux browsers supportés par l'API Automate de BrowserStack
