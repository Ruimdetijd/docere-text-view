"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const use_get_component_tree_1 = require("./use-get-component-tree");
const use_highlight_1 = require("./use-highlight");
function renderComponentTree(tree, props) {
    if (tree == null || typeof tree === 'string')
        return tree;
    return React.createElement(tree.componentClass, Object.assign(Object.assign({}, props.customProps), tree.props), tree.children.map(child => renderComponentTree(child, props)));
}
function DocereTextView(props) {
    const wrapperRef = React.useRef();
    const componentTree = use_get_component_tree_1.default(props);
    use_highlight_1.default(wrapperRef, componentTree, props.highlight, props.setHighlightAreas);
    return (React.createElement("div", { ref: wrapperRef }, renderComponentTree(componentTree, props)));
}
DocereTextView.defaultProps = {
    customProps: {},
    components: {},
    ignore: [],
    highlight: [],
};
exports.default = React.memo(DocereTextView, function areEqual(prevProps, nextProps) {
    const equalProps = Object.keys(prevProps).every(k => {
        if (k === 'customProps')
            return true;
        return prevProps[k] === nextProps[k];
    });
    const equalCustomProps = Object.keys(prevProps.customProps).every(k => {
        return prevProps.customProps[k] === nextProps.customProps[k];
    });
    return equalProps && equalCustomProps;
});
