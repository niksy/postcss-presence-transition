import parse from 'postcss-value-parser';

export default (options) => {
	options = options || {};
	options.prefix = options.prefix || '';

	const startString = `${options.prefix}presence-start`;
	const endString = `${options.prefix}presence-end`;

	const walkDeclaration = (decl) => {
		const ast = parse(decl.value);
		const rule = decl.parent;
		// Value array is cloned so it can be manipulated easily
		let clonedParsedNodes = [].concat(ast.nodes);

		ast.walk((node, i, nodes) => {
			if (node.type === 'word' && node.value === startString) {
				node.value = 'opacity';
				clonedParsedNodes = clonedParsedNodes.concat([
					{ type: 'div', value: ',', before: '', after: ' ' },
					parse(`visibility 0s linear ${nodes[i + 2].value}`)
				]);
				rule.append({
					prop: 'visibility',
					value: 'hidden'
				});
			} else if (node.type === 'word' && node.value === endString) {
				rule.append(
					{
						prop: 'transition-delay',
						value: '0s'
					},
					{
						prop: 'visibility',
						value: 'visible'
					}
				);

				// Remove value and it’s separator (if it exists)
				const newValue = decl.value.split(',').map(function(value) {
					return value.trim();
				});
				newValue.splice(newValue.indexOf(endString), 1);
				clonedParsedNodes = parse(newValue.join(', ')).nodes;

				/*
				 * If `presence-end` is the only value in this rule,
				 * remove the rule completely
				 */
				if (!clonedParsedNodes.length) {
					decl.remove();
				}
			}
		});

		ast.nodes = clonedParsedNodes;
		decl.value = ast.toString();
	};

	return {
		postcssPlugin: 'postcss-presence-transition',
		Declaration: {
			transition: walkDeclaration,
			'transition-property': walkDeclaration
		}
	};
};

export const postcss = true;
