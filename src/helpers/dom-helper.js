export default class DOMHelper {

    static parseStrToDom(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    static wrapTextNodes(dom) {
        const body = dom.body;
        const textNodes = [];
        function recursy(element) {
            element.childNodes.forEach((child) => {
                if (
                    child.nodeName === '#text' &&
                    child.nodeValue.replace(/\s+/g, '').length
                ) {
                    textNodes.push(child);
                } else {
                    recursy(child);
                }
            });
        }
        recursy(body);
        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute('data-nodeid', i);
        });
        return dom;
    }

    static serializeDomToString(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    static unwrapTextNodes(dom) {
        dom.body.querySelectorAll('text-editor').forEach((element) => {
            element.parentNode.replaceChild(element.firstChild, element);
        });
    }
}
