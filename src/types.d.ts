type ReactComponent = React.FunctionComponent<any> | React.ComponentClass<any>

interface DocereTextViewProps {
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
