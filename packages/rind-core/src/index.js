// Rind.js Core Runtime

const EVENT_ALIASES = { doubleclick: 'dblclick' };

let _buildFn = null;
let _root = null;

export function createElement(type, props, ...restChildren) {
  const propChildren = props && props.children ?
    (Array.isArray(props.children) ? props.children : [props.children]) : [];
  const allChildren = [...propChildren, ...restChildren];

  const cleanProps = { ...props };
  delete cleanProps.children;

  return {
    type,
    props: {
      ...cleanProps,
      children: allChildren.map(child =>
        typeof child === 'object' && child !== null
          ? child
          : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: { nodeValue: String(text), children: [] },
  };
}

export function render(element, container) {
  if (typeof element !== 'object' || element === null) {
    container.appendChild(document.createTextNode(String(element)));
    return;
  }

  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type);

  Object.keys(element.props)
    .filter(key => key !== 'children')
    .forEach(name => {
      const value = element.props[name];
      if (name === 'style' && typeof value === 'object') {
        Object.assign(dom.style, value);
      } else if (name === 'nodeValue') {
        dom.nodeValue = value;
      } else if (name.startsWith('on') && typeof value === 'function') {
        let eventName = name.slice(2).toLowerCase();
        if (EVENT_ALIASES[eventName]) eventName = EVENT_ALIASES[eventName];
        dom.addEventListener(eventName, value);
      } else if (name === 'className' || name === 'class') {
        dom.setAttribute('class', value);
      } else {
        dom[name] = value;
      }
    });

  (element.props.children || []).forEach(child => render(child, dom));
  container.appendChild(dom);
}

export function renderApp(buildFn, root) {
  _buildFn = buildFn;
  _root = root;
  _doRender();
}

export function rerender() {
  _doRender();
}

export const RERENDER = rerender;

function _doRender() {
  if (!_buildFn || !_root) return;
  _root.innerHTML = '';
  render(_buildFn(), _root);
}

export default { createElement, render, renderApp, rerender, RERENDER };