/// <reference path="./types.d.ts" />

import * as React from 'react'
import useGetComponentTree from './use-get-component-tree'

function renderComponentTree(tree: ComponentLeaf, props: DocereTextViewProps): any {
	if (tree == null || typeof tree === 'string') return tree

	return React.createElement(
		tree.componentClass,
		{ ...tree.props, ...props.customProps },
		tree.children.map(child => renderComponentTree(child, props))
	)
}

function DocereTextView(props: DocereTextViewProps) {
	const componentTree = useGetComponentTree(props)
	return renderComponentTree(componentTree, props)
}

DocereTextView.defaultProps = {
	customProps: {},
	components: {},
	ignore: [],
}

export default React.memo(DocereTextView)

/*
export default class DocereTextView extends React.PureComponent<DocereTextViewProps> {
	private currentHighlight: string[]
	private node: Element


	async componentDidMount() {
		await this.setRootNode()
	}

	async componentDidUpdate(prevProps: DocereTextViewProps) {
		if (
			prevProps.node != this.props.node ||
			prevProps.url != this.props.url ||
			prevProps.xml != this.props.xml ||
			prevProps.html != this.props.html
		) {
			await this.setRootNode()
		}

		this.highlight(prevProps)
	}

	render() {
		return this.domToComponent(this.node)
	}

	/**
	 * Set the document. There are three props options.
	 * 1 `node`: a node (HTMLDocument, XMLDocument, Element) is directly passed to the Component.
	 * 2 `xml`: a string of XML is parsed by DOMParser.
	 * 3 `url`: an XMLDocument is fetched by XMLHttpRequest.

	private highlight(_prevProps: DocereTextViewProps) {
		if (
			this.node != null &&
			Array.isArray(this.props.highlight) &&
			this.props.highlight.length > 0 &&
			this.props.highlight !== this.currentHighlight
		) {
			const treeWalker = document.createTreeWalker(this.node, NodeFilter.SHOW_TEXT)
			const map = new Map()
			const re = new RegExp(this.props.highlight.join('|'), 'gui')

			while (treeWalker.nextNode()) {
				let result: RegExpMatchArray
				const indices: RegExpMatchArray[] = []
				while (result = re.exec(treeWalker.currentNode.textContent)) indices.push(result)
				if (indices.length) map.set(treeWalker.currentNode, indices)
			}

			for (const [node, indices] of map.entries()) {
				let currentNode = node
				let prevIndex = 0
				let prevFoundLength = 0
				for (const result of indices) {
					wrap(currentNode, result.index - prevIndex - prevFoundLength, result[0])
					currentNode = currentNode.nextSibling.nextSibling
					prevIndex = result.index
					prevFoundLength = result[0].length
				}
			}

			this.currentHighlight = this.props.highlight
			this.forceUpdate()
		}
	}
}
*/
