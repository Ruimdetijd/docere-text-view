/// <reference path="../src/types.d.ts" />
import * as React from 'react';
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
