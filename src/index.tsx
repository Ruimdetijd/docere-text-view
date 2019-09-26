import * as React from 'react'
import { wrap, fetchXml, attrsToObject } from './utils'

function NoopComp(props: any) { return props.children } 

type ReactComponent = React.FunctionComponent<any> | React.ComponentClass<any>

export interface DocereTextViewProps {
	components?: { [ selector: string ]: ReactComponent }
	customProps?: { [ key: string ]: any }
	highlight?: string[]
	html?: string
	ignore?: string[]
	node?: Node
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
		ignore: [],
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
		return this.domToComponent(this.node)
	}

	/**
	 * Set the document. There are three props options.
	 * 1 `node`: a node (HTMLDocument, XMLDocument, Element) is directly passed to the Component.
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

		this.forceUpdate(() => {
			if (this.props.onRootElementChange != null) this.props.onRootElementChange(this.node)
		})
	}

	private getComponentClass(el: Element): ReactComponent {
		const foundIgnore = this.props.ignore.some(selector => el.matches(selector))
		if (foundIgnore) return null

		const selector = Object.keys(this.props.components).find(selector => el.matches(selector))
		if (selector == null) return NoopComp

		return this.props.components[selector]
	}

	private getAttributes(node: Element, index: string) {
		// Prepare attributes. React does not accept all attribute names (ref, class, style, key)
		const unacceptedAttributes = ['ref', 'class', 'style', 'key']
		unacceptedAttributes.forEach(attr => {
			if (node.hasAttribute(attr)) {
				node.setAttribute(`_${attr}`, node.getAttribute(attr))
				node.removeAttribute(attr)
			}
		})

		const nodeAttributes = {
			...attrsToObject(node.attributes),
			...this.props.customProps,
			key: index,
		}

		return nodeAttributes
	}

	private domToComponent(root: Node, rootIndex?: string): any {
		// If root is null or undefined, return null, which is a valid output for a React.Component
		if (root == null) return null

		// If root is a text node, just return the text content, which is a valid child for a React.Component
		if (root.nodeType === 3) return root.textContent

		// Only process Elements after this
		if (root.nodeType !== 1) return null

		const componentClass = this.getComponentClass(root as Element)
		if (componentClass == null) return null

		// Create the React.Component
		return React.createElement(
			componentClass,
			this.getAttributes(root as Element, rootIndex),
			Array.from(root.childNodes).map((child, index) => this.domToComponent(child, `${rootIndex}-${index}`))
		)
	}

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
