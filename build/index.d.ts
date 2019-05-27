import * as React from 'react';
declare type ReactComponent = React.FunctionComponent<any> | React.ComponentClass<any>;
export interface DocereTextViewProps {
    components?: {
        [selector: string]: ReactComponent;
    };
    customProps?: {
        [key: string]: any;
    };
    highlight?: string[];
    html?: string;
    ignore?: string[];
    node?: Node;
    onRootElementChange?: (newRoot: Element) => void;
    url?: string;
    xml?: string;
    rootSelector?: string;
}
export default class DocereTextView extends React.PureComponent<DocereTextViewProps> {
    private currentHighlight;
    private node;
    static defaultProps: Partial<DocereTextViewProps>;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: DocereTextViewProps): Promise<void>;
    render(): any;
    private setRootNode;
    private getComponentClass;
    private getAttributes;
    private domToComponent;
    private highlight;
}
export {};
