# modularAI V0.0.1
The result two week pressure cooker in which I'll develop a Modular AI prototype.

_Version: 0.1.0 - 24 April 2015_

By [Stefan Weck](http://www.stefanweck.nl),

- Follow me on [Twitter](https://twitter.com/stefanweck)
- Email me at contact@stefanweck.nl

## How to Build

I provide a fully compiled version of the project in the `dist` folder. Both plain and minified formats are in there.

Install NPM if you haven't already done so. NPM is a package manager that ships with Node.js. Then open up your console and navigate to the root folder of this project.

Run `npm install` once to install all the dependencies needed by this project. Next there are a few options:

Run `grunt build` to perform a new build to the `dist` folder. This way Browserify will generate a bundle from every required script in the `lib` folder, this will also generate a minified file of the bundle. This is preferred when you are done developing and want to push your new changes, as this version doesn't include the debug map.

Run `grunt dev` to watch every module needed in the project for changes. Watchify will take care of rebuilding the bundle so the only thing you have to do is refresh your browser. No need to run `grunt build` everytime you make a change. This version includes a debug map so you are able to debug single files while the .js file included is still the bundle file.

Run `grunt debug` to let JSHint check the code for you, a tool that helps to detect errors and potential problems in your JavaScript code.

## Changelog

**v0.1.0**

- First version and demonstration of the prototype

**v0.0.1**

- Initial setup of the system

## Contribute

- Feel free to fork the repository, check out the demo and propose a pull request!

## Contact

Do you have great ideas, do you want to contribute or just send 
me an email. You can reach me by emailing to contact@stefanweck.nl!

## License
This project ( the code ) is licensed under the terms of the MIT license,
found in [LICENSE.md](LICENSE.md)
