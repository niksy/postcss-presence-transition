# PostCSS presence transition [![Build Status](https://travis-ci.org/niksy/postcss-presence-transition.svg)](https://travis-ci.org/niksy/postcss-presence-transition)

[PostCSS](https://github.com/postcss/postcss) plugin for presence transition.

Implementation of [technique](http://www.greywyvern.com/?post=337) which solves 
situation where you would like to transition `display` property.

```css
/* Before */

.foo {
	transition:presence-start 0.2s ease-in-out;
	opacity:0;
}

.foo:hover {
	transition:presence-end;
	opacity:1;
}

/* After */

.foo {
	transition:opacity 0.2s ease-in-out, visibility 0s linear 0.2s;
	opacity:0;
	visibility:hidden;
}

.foo:hover {
	opacity:1;
	transition-delay:0s;
	visibility:visible;
}
```

## Installation

```sh
npm install postcss-presence-transition --save-dev
```

## Usage

```js
postcss([ require('postcss-presence-transition')({ /* options */ }) ])
```

## Options

#### `prefix`

Type: `String`  
Default: ` `

Prefix to use for `presence-start` and `presence-end`.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
