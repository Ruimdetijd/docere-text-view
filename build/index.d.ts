import * as React from 'react';
interface Props {
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
export default class DocereTextView extends React.PureComponent<Props> {
    private currentHighlight;
    private node;
    static defaultProps: Partial<Props>;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: Props): Promise<void>;
    render(): any;
    private setRootNode;
    private getComponentClass;
    private getAttributes;
    private domToComponent;
    private highlight;
}
export {};
