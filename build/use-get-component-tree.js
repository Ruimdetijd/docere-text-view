"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const utils_1 = require("./utils");
function NoopComp(props) { return props.children; }
function getComponentClass(el, props) {
    const foundIgnore = props.ignore.some(selector => el.matches(selector));
    if (foundIgnore)
        return null;
    const selector = Object.keys(props.components).find(selector => el.matches(selector));
    if (selector == null)
        return NoopComp;
    return props.components[selector];
}
function nodeToComponentTree(root, props, rootIndex) {
    if (root == null)
        return null;
    if (root.nodeType === 3)
        return root.textContent;
    if (root.nodeType !== 1)
        return null;
    const element = root;
    const componentClass = getComponentClass(element, props);
    if (componentClass == null)
        return null;
    return {
        componentClass,
        props: {
            attributes: utils_1.attrsToObject(element.attributes),
            key: rootIndex,
        },
        children: Array.from(element.childNodes).map((childNode, index) => nodeToComponentTree(childNode, props, `${rootIndex}-${index}`))
    };
}
function prepareNode(node, props) {
    if (node instanceof XMLDocument || node instanceof HTMLDocument)
        node = node.documentElement;
    if (props.rootSelector != null)
        node = node.querySelector(props.rootSelector);
    return nodeToComponentTree(node, props);
}
function useGetComponentTree(props) {
    const [node, setNode] = React.useState(null);
    React.useEffect(() => {
        if (props.url != null) {
            utils_1.fetchXml(props.url).then(node => setNode(prepareNode(node, props)));
        }
        else {
            let tmpNode;
            if (props.node != null) {
                tmpNode = props.node;
            }
            else if (props.xml != null) {
                const parser = new DOMParser();
                tmpNode = parser.parseFromString(props.xml, 'application/xml');
            }
            else if (props.html != null) {
                const parser = new DOMParser();
                tmpNode = parser.parseFromString(props.html, 'text/html');
            }
            setNode(prepareNode(tmpNode, props));
        }
    }, [props.html, props.node, props.url, props.xml]);
    return node;
}
exports.default = useGetComponentTree;
