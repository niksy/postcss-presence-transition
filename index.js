var postcss = require('postcss');
var parse = require('postcss-value-parser');

module.exports = postcss.plugin('postcss-presence-transition', function ( opts ) {

	opts = opts || {};
	opts.prefix = opts.prefix || '';

	var startString = opts.prefix + 'presence-start';
	var endString = opts.prefix + 'presence-end';

	return function ( css, result ) {
		css.walkDecls(/^transition|transition-property/, function ( decl ) {

			var ast = parse(decl.value);
			var rule = decl.parent;
			// Value array is cloned so it can be manipulated easily
			var clonedParsedNodes = [].concat(ast.nodes);
			var nextNode;

			ast.walk(function ( node, i, nodes ) {

				if ( node.type === 'word' && node.value === startString ) {

					node.value = 'opacity';
					clonedParsedNodes = clonedParsedNodes.concat([
						{ type: 'div', value: ',' , before: '', after: ' ' },
						parse('visibility 0s linear ' + nodes[i+2].value),
					]);
					rule.append({
						prop: 'visibility',
						value: 'hidden'
					});

				} else if ( node.type === 'word' && node.value === endString ) {

					rule.append({
						prop: 'transition-delay',
						value: '0s'
					}, {
						prop: 'visibility',
						value: 'visible'
					});

					// Remove value and it’s separator (if it exists)
					var newValue = decl.value.split(',').map(function ( value ) {
						return value.trim();
					});
					newValue.splice(newValue.indexOf(endString), 1);
					clonedParsedNodes = parse(newValue.join(', ')).nodes;

					// If `presence-end` is the only value in this rule,
					// remove the rule completely
					if ( !clonedParsedNodes.length ) {
						decl.remove();
					}

				}

			});

			ast.nodes = clonedParsedNodes;
			decl.value = ast.toString();

		});
	};

});
