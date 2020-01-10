"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const use_get_component_tree_1 = require("./use-get-component-tree");
function renderComponentTree(tree, props) {
    if (tree == null || typeof tree === 'string')
        return tree;
    return React.createElement(tree.componentClass, Object.assign(Object.assign({}, props.customProps), tree.props), tree.children.map(child => renderComponentTree(child, props)));
}
function DocereTextView(props) {
    const componentTree = use_get_component_tree_1.default(props);
    return renderComponentTree(componentTree, props);
}
DocereTextView.defaultProps = {
    customProps: {},
    components: {},
    ignore: [],
};
exports.default = React.memo(DocereTextView);
