# BrowserStack Suite

BrowserStack automated tests private UI

## Features

Test your applications and integrate with your favorite CI tool.

- CLI to trigger builds (making it easy to integrate with your CI tool)
- Multiple application instances
- Specific browser list for each instance
- Password-protected UI (define password for each applicaton)
- Administration interface (♥  [KeystoneJS](http://keystonejs.com/))
- No more testing headache with VMs and mobile devices

## Core concepts

This tool uses [BrowserStack](https://www.browserstack.com)'s awesome features. **You will need a [BrowserStack Automate account](https://www.browserstack.com/accounts/subscriptions) to use it.** 

Public UI is a simple JS app based on [Vue.js](http://vuejs.org/). Default URL : [http://localhost:3000](http://localhost:3000)

Admin interface is provided by the awesome work of the [KeystoneJS](http://keystonejs.com/) team. You may want to check them out on their [GitHub repo](https://github.com/keystonejs/keystone/). Default URL : [http://localhost:3000/keystone](http://localhost:3000/keystone)

## Install

	npm install

After installation, and before starting the application you will need to configure your environment using the `.env.example` file provided.

	cp .env.example .env
	$EDITOR .env

## Usage

### Start the web UI

	npm start

The first time you start the UI, all updates are executed. If you don't have a valid BrowserStack account yet, you may delete `update/0.0.2-browsers.js` file. 

The admin access will be the one configured in your `.env` file. First thing you want to do is change this default password/email combination.

### Trigger an automated test
	
	node bin/build.js --help

## Troubleshooting

This rather annoying message may appear :

	{ [Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND' }
	js-bson: Failed to load c++ bson extension, using pure JS version

This is a bug related to MongoDB NPM module. You may copy/paste this in the main directory ([Source](http://stackoverflow.com/a/28932441/3169999)) : 

	cp node_modules/bson/browser_build/bson.js node_modules/bson/build/Release/bson.js

## Updates

The list of browsers provided in the admin is based on [BrowserStack API supported browsers list](https://www.browserstack.com/list-of-browsers-and-platforms?product=automate).

This list **needs to be updated on regularly**, by running :

	npm run update-browsers

This will keep you up-to-date with the latest supported browsers.

Test commit