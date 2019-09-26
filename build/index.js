"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const utils_1 = require("./utils");
function NoopComp(props) { return props.children; }
class DocereTextView extends React.PureComponent {
    componentDidMount() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.setRootNode();
        });
    }
    componentDidUpdate(prevProps) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (prevProps.node != this.props.node ||
                prevProps.url != this.props.url ||
                prevProps.xml != this.props.xml ||
                prevProps.html != this.props.html) {
                yield this.setRootNode();
            }
            this.highlight(prevProps);
        });
    }
    render() {
        return this.domToComponent(this.node);
    }
    setRootNode() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let node;
            if (this.props.node != null) {
                node = this.props.node;
            }
            else if (this.props.xml != null) {
                const parser = new DOMParser();
                node = parser.parseFromString(this.props.xml, 'application/xml');
            }
            else if (this.props.html != null) {
                const parser = new DOMParser();
                node = parser.parseFromString(this.props.html, 'text/html');
            }
            else if (this.props.url != null) {
                node = yield utils_1.fetchXml(this.props.url);
            }
            if (node instanceof XMLDocument || node instanceof HTMLDocument)
                node = node.documentElement;
            this.node = (this.props.rootSelector == null) ? node : node.querySelector(this.props.rootSelector);
            this.forceUpdate(() => {
                if (this.props.onRootElementChange != null)
                    this.props.onRootElementChange(this.node);
            });
        });
    }
    getComponentClass(el) {
        const foundIgnore = this.props.ignore.some(selector => el.matches(selector));
        if (foundIgnore)
            return null;
        const selector = Object.keys(this.props.components).find(selector => el.matches(selector));
        if (selector == null)
            return NoopComp;
        return this.props.components[selector];
    }
    getAttributes(node, index) {
        const unacceptedAttributes = ['ref', 'class', 'style', 'key'];
        unacceptedAttributes.forEach(attr => {
            if (node.hasAttribute(attr)) {
                node.setAttribute(`_${attr}`, node.getAttribute(attr));
                node.removeAttribute(attr);
            }
        });
        const nodeAttributes = Object.assign({}, utils_1.attrsToObject(node.attributes), this.props.customProps, { key: index });
        return nodeAttributes;
    }
    domToComponent(root, rootIndex) {
        if (root == null)
            return null;
        if (root.nodeType === 3)
            return root.textContent;
        if (root.nodeType !== 1)
            return null;
        const componentClass = this.getComponentClass(root);
        if (componentClass == null)
            return null;
        return React.createElement(componentClass, this.getAttributes(root, rootIndex), Array.from(root.childNodes).map((child, index) => this.domToComponent(child, `${rootIndex}-${index}`)));
    }
    highlight(_prevProps) {
        if (this.node != null &&
            Array.isArray(this.props.highlight) &&
            this.props.highlight.length > 0 &&
            this.props.highlight !== this.currentHighlight) {
            const treeWalker = document.createTreeWalker(this.node, NodeFilter.SHOW_TEXT);
            const map = new Map();
            const re = new RegExp(this.props.highlight.join('|'), 'gui');
            while (treeWalker.nextNode()) {
                let result;
                const indices = [];
                while (result = re.exec(treeWalker.currentNode.textContent))
                    indices.push(result);
                if (indices.length)
                    map.set(treeWalker.currentNode, indices);
            }
            for (const [node, indices] of map.entries()) {
                let currentNode = node;
                let prevIndex = 0;
                let prevFoundLength = 0;
                for (const result of indices) {
                    utils_1.wrap(currentNode, result.index - prevIndex - prevFoundLength, result[0]);
                    currentNode = currentNode.nextSibling.nextSibling;
                    prevIndex = result.index;
                    prevFoundLength = result[0].length;
                }
            }
            this.currentHighlight = this.props.highlight;
            this.forceUpdate();
        }
    }
}
DocereTextView.defaultProps = {
    customProps: {},
    components: {},
    ignore: [],
};
exports.default = DocereTextView;
