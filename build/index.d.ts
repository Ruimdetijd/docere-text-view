import * as React from 'react';
interface Props {
    components?: {
        [selector: string]: any;
    };
    highlight?: string[];
    node?: Node;
    url?: string;
    xml?: string;
    rootSelector?: string;
}
export default class DocereTextView extends React.PureComponent<Props> {
    private currentHighlight;
    private node;
    static defaultProps: Partial<Props>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    render(): any;
    private setRootNode;
    private getComponentClass;
    private getAttributes;
    private domToComponent;
    private highlight;
}
export {};
