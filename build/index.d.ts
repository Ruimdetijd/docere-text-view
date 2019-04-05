import * as React from 'react';
export interface DocereTextViewProps {
    components?: {
        [selector: string]: any;
    };
    customProps?: {
        [key: string]: any;
    };
    highlight?: string[];
    html?: string;
    node?: Node;
    noop?: any;
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
