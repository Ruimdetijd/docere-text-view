import * as React from 'react'
import { wrap, fetchXml } from './utils'

function Noop(props: any) { return props.children } 

export interface DocereTextViewProps {
	components?: { [ selector: string ]: any }
	customProps?: { [ key: string ]: any }
	highlight?: string[]
	html?: string
	node?: Node
	noop?: any
	onRootElementChange?: (newRoot: Element) => void
	url?: string
	xml?: string
	rootSelector?: string
}
export default class DocereTextView extends React.PureComponent<DocereTextViewProps> {
	private currentHighlight: string[]
	private node: Element

	static defaultProps: Partial<DocereTextViewProps> = {
		customProps: {},
		components: {},
		noop: Noop,
	}

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
		if (this.node == null) return null
		return this.domToComponent(this.node)
	}

	/**
	 * Set the document. There are three props options.
	 * 1 `doc`: an XMLDocument is directly passed to the Component.
	 * 2 `xml`: a string of XML is parsed by DOMParser.
	 * 3 `url`: an XMLDocument is fetched by XMLHttpRequest.
	 */
	private async setRootNode() {
		let node
		if (this.props.node != null) {
			node = this.props.node
		}
		else if (this.props.xml != null) {
			const parser = new DOMParser()
			node = parser.parseFromString(this.props.xml, 'application/xml')
		}
		else if (this.props.html != null) {
			const parser = new DOMParser()
			node = parser.parseFromString(this.props.html, 'text/html')
		}
		else if (this.props.url != null) {
			node = await fetchXml(this.props.url)
		}

		if (node instanceof XMLDocument || node instanceof HTMLDocument) node = node.documentElement
		this.node = (this.props.rootSelector == null) ? node : node.querySelector(this.props.rootSelector)

		if (this.props.onRootElementChange != null) this.props.onRootElementChange(this.node)

		this.forceUpdate()
	}

	private getComponentClass(el: Element) {
		const selector = Object.keys(this.props.components).find(selector => el.matches(selector))
		if (selector == null) return this.props.noop
		return this.props.components[selector]
	}

	private getAttributes(node: Element, index: number) {
		// Prepare attributes. React does not accept all attribute names (ref, class, style, key)
		const unacceptedAttributes = ['ref', 'class', 'style', 'key']
		unacceptedAttributes.forEach(attr => {
			if (node.hasAttribute(attr)) {
				node.setAttribute(`_${attr}`, node.getAttribute(attr))
				node.removeAttribute(attr)
			}
		})

		// Convert NamedNodeMap to Object
		const nodeAttributes: { [key: string]: string | number } = {
			key: index,
			...this.props.customProps
		}
		for (const attr of node.attributes) {
			 nodeAttributes[attr.name] = attr.value
		}

		return nodeAttributes
	}

	private domToComponent(root: Node, index?: number): any {
		// If root is null or undefined, return null, which is a valid output for a React.Component
		if (root == null) return null

		// If root is a text node, just return the text content, which is a valid child for a React.Component
		if (root.nodeType === 3) return root.textContent

		// Only process Elements after this
		if (root.nodeType !== 1) return null

		// Map children to component
		const childNodes = Array.from(root.childNodes)
		const children = childNodes.map((child, index) => this.domToComponent(child, index))

		// Create the React.Component
		return React.createElement(
			this.getComponentClass(root as Element),
			this.getAttributes(root as Element, index),
			children
		)
	}

	private highlight(_prevProps: DocereTextViewProps) {
		if (
			this.props.highlight != null &&
			this.node != null &&
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
