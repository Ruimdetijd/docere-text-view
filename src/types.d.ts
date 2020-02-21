type ReactComponent = React.FunctionComponent<any> | React.ComponentClass<any>

type ComponentLeaf = ComponentTree | string
interface ComponentTree { componentClass: ReactComponent, props: any, children: ComponentLeaf[] }

interface DocereTextViewProps {
	components?: { [ selector: string ]: ReactComponent }
	// TODO rename to componentProps
	customProps?: { [ key: string ]: any }
	highlight?: string[]
	html?: string
	ignore?: string[]
	node?: Node
	onRootElementChange?: (newRoot: Element) => void
	rootSelector?: string
	setHighlightAreas?: (areas: number[]) => void
	url?: string
	xml?: string
}
