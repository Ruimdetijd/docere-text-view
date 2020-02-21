/// <reference path="./types.d.ts" />

import * as React from 'react'
import useGetComponentTree from './use-get-component-tree'
import useHighlight from './use-highlight'

function renderComponentTree(tree: ComponentLeaf, props: DocereTextViewProps): any {
	if (tree == null || typeof tree === 'string') return tree

	return React.createElement(
		tree.componentClass,
		{ ...props.customProps, ...tree.props },
		tree.children.map(child => renderComponentTree(child, props))
	)
}

function DocereTextView(props: DocereTextViewProps) {
	const wrapperRef = React.useRef()
	const componentTree = useGetComponentTree(props)
	useHighlight(wrapperRef, componentTree, props.highlight, props.setHighlightAreas)
	return (
		<div ref={wrapperRef}>
			{renderComponentTree(componentTree, props)}
		</div>
	)
}

DocereTextView.defaultProps = {
	customProps: {},
	components: {},
	ignore: [],
	highlight: [],
}

export default React.memo(DocereTextView)
