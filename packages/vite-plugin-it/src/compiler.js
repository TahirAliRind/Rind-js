// .it syntax compiler - v7 (fixed CSS values)

const EVENT_MAP = {
  'ONCLICK': 'onClick', 'ONCHANGE': 'onChange', 'ONINPUT': 'onInput',
  'ONSUBMIT': 'onSubmit', 'ONMOUSEENTER': 'onMouseEnter',
  'ONMOUSELEAVE': 'onMouseLeave', 'ONFOCUS': 'onFocus', 'ONBLUR': 'onBlur',
  'ONKEYDOWN': 'onKeyDown', 'ONKEYUP': 'onKeyUp', 'ONDBLCLICK': 'onDoubleClick',
};

const STYLE_MAP = {
  'WI': 'width', 'HE': 'height', 'HEI': 'height',
  'MIWI': 'minWidth', 'MAWI': 'maxWidth', 'MIHE': 'minHeight', 'MAHE': 'maxHeight',
  'COL': 'color', 'BG': 'backgroundColor',
  'MA': 'margin', 'PA': 'padding',
  'BO': 'border', 'BOR': 'borderRadius',
  'DI': 'display',
  'FLE': 'flexDirection', 'FLX': 'flex', 'FLEW': 'flexWrap',
  'ALI': 'alignItems', 'JUS': 'justifyContent', 'GAP': 'gap',
  'FON': 'fontSize', 'FONW': 'fontWeight', 'FONF': 'fontFamily',
  'TEXA': 'textAlign', 'LINE': 'lineHeight',
  'POS': 'position', 'TOP': 'top', 'LEF': 'left', 'RIG': 'right', 'BOT': 'bottom',
  'OVF': 'overflow', 'OVE': 'overflowY', 'OVX': 'overflowX',
  'CUR': 'cursor', 'TRA': 'transition',
  'BOX': 'boxShadow', 'OPA': 'opacity', 'ZIN': 'zIndex',
};

const SIZE_MAP = {
  'XS': '100px', 'SM': '200px', 'MD': '400px', 'LG': '600px',
  'XL': '100%', 'FULL': '100%', 'AUTO': 'auto', 'HALF': '50%',
};

const HEIGHT_SIZE_MAP = {
  'XS': '100px', 'SM': '200px', 'MD': '400px', 'LG': '600px',
  'XL': '100vh', 'FULL': '100%', 'AUTO': 'auto', 'HALF': '50%',
};

function splitTopLevel(str) {
  const parts = [];
  let depth = 0;
  let inQuote = null;
  let current = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (inQuote) {
      current += ch;
      if (ch === inQuote) inQuote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      current += ch;
    } else if (ch === '[' || ch === '{' || ch === '(') {
      depth++;
      current += ch;
    } else if (ch === ']' || ch === '}' || ch === ')') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

function parsePair(str) {
  const idx = str.indexOf('-');
  if (idx === -1) return null;
  return {
    key: str.slice(0, idx).trim(),
    value: str.slice(idx + 1).trim(),
  };
}

function isPureString(value) {
  const v = value.trim();
  if (v.length < 2) return false;
  const first = v[0];
  const last = v[v.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    const inner = v.slice(1, -1);
    if (!inner.includes(first)) return true;
  }
  return false;
}

function isJsCode(value) {
  const v = value.trim();
  if (!v) return false;
  if (/\bSTATE\s*\./.test(v)) return true;
  if (/\bprops\s*\./.test(v)) return true;
  if (/^[a-zA-Z_$][\w$]*\s*\.\s*[a-zA-Z_$][\w$]*(\s*[+\-*/]\s*.+)?$/.test(v)) return true;
  if (/\s\+\s/.test(v)) return true;
  if (/\s\?\s/.test(v)) return true;
  if (/\s===\s/.test(v)) return true;
  if (/\s!==\s/.test(v)) return true;
  if (/\s&&\s/.test(v)) return true;
  if (/\s\|\|\s/.test(v)) return true;
  return false;
}

function valueToCode(value) {
  const v = value.trim();
  if (v.includes('${')) {
    return '`' + v.replace(/`/g, '\\`') + '`';
  }
  if (isPureString(v)) return v;
  if (isJsCode(v)) return v;
  return JSON.stringify(v);
}

function resolveSize(value, cssKey) {
  const upper = value.toUpperCase();
  if (cssKey === 'height' && HEIGHT_SIZE_MAP[upper]) return HEIGHT_SIZE_MAP[upper];
  if (SIZE_MAP[upper]) return SIZE_MAP[upper];
  return value;
}

function buildStyleString(props) {
  const entries = [];
  for (const p of props) {
    const cssName = STYLE_MAP[p.key.toUpperCase()] || p.key.toLowerCase();
    let valueCode;
    const raw = p.value;
    if (raw.includes('${')) {
      valueCode = '`' + raw.replace(/`/g, '\\`') + '`';
    } else if (isJsCode(raw)) {
      valueCode = `(${raw})`;
    } else {
      const resolved = resolveSize(raw, cssName);
      valueCode = JSON.stringify(resolved);
    }
    entries.push(`${JSON.stringify(cssName)}: ${valueCode}`);
  }
  return `{ ${entries.join(', ')} }`;
}

function processProps(props) {
  const styleProps = [];
  const events = [];
  const attrs = [];

  for (const p of props) {
    const upperKey = p.key.toUpperCase();
    if (EVENT_MAP[upperKey]) {
      events.push(`${EVENT_MAP[upperKey]}: ${p.value}`);
    } else if (upperKey === 'ID') {
      attrs.push(`id: ${JSON.stringify(p.value)}`);
    } else if (upperKey === 'CLASS') {
      attrs.push(`className: ${JSON.stringify(p.value)}`);
    } else {
      styleProps.push(p);
    }
  }

  const propsList = [];
  if (styleProps.length > 0) {
    propsList.push(`style: ${buildStyleString(styleProps)}`);
  }
  events.forEach(e => propsList.push(e));
  attrs.forEach(a => propsList.push(a));
  return propsList;
}

function compileChildElement(childStr) {
  const inner = childStr.slice(1, -1).trim();
  const parts = splitTopLevel(inner);

  const props = [];
  let textRaw = null;
  let elementType = null;
  let useComponent = null;
  let eachExpr = null;
  let asVar = 'item';
  const children = [];

  for (const part of parts) {
    const p = part.trim();
    if (!p) continue;
    if (p.startsWith('{') && p.endsWith('}')) {
      children.push(p);
      continue;
    }
    const pair = parsePair(p);
    if (!pair) continue;

    const keyUpper = pair.key.toUpperCase();
    if (keyUpper === 'TEXT' || keyUpper === 'TX') {
      textRaw = pair.value;
    } else if (keyUpper === 'TAG') {
      elementType = pair.value.toLowerCase();
    } else if (keyUpper === 'USE') {
      useComponent = pair.value;
    } else if (keyUpper === 'EACH') {
      eachExpr = pair.value;
    } else if (keyUpper === 'AS') {
      asVar = pair.value;
    } else {
      props.push(pair);
    }
  }

  if (useComponent) {
    const propsEntries = props.map(p => {
      const key = p.key.toLowerCase();
      return `${key}: ${valueToCode(p.value)}`;
    });
    return `${useComponent}({ ${propsEntries.join(', ')} })`;
  }

  if (eachExpr) {
    if (children.length === 0) {
      throw new Error('EACH ke saath kam az kam ek { } body honi chahiye');
    }
    const bodyCodes = children.map(c => compileChildElement(c));
    const bodyExpr = bodyCodes.length === 1
      ? bodyCodes[0]
      : `createElement('div', {}, ${bodyCodes.join(', ')})`;

    const type = elementType || 'div';
    const propsList = processProps(props);
    const propsStr = `{ ${propsList.join(', ')} }`;

    return `createElement('${type}', ${propsStr}, ...(${eachExpr} || []).map(${asVar} => ${bodyExpr}))`;
  }

  if (!elementType) {
    elementType = textRaw !== null ? 'p' : 'div';
  }

  const propsList = processProps(props);
  const childArgs = [];
  if (textRaw !== null) {
    childArgs.push(valueToCode(textRaw));
  }
  for (const c of children) childArgs.push(compileChildElement(c));

  const allArgs = [`'${elementType}'`, `{ ${propsList.join(', ')} }`, ...childArgs];
  return `createElement(${allArgs.join(', ')})`;
}

function parseStateBlock(stateCode) {
  const entries = splitTopLevel(stateCode);
  const objParts = [];

  for (const entry of entries) {
    const p = entry.trim().replace(/,$/, '').trim();
    if (!p) continue;
    const pair = parsePair(p);
    if (!pair) continue;

    let value = pair.value;
    if (/^-?\d+(\.\d+)?$/.test(value)) {
    } else if (value === 'true' || value === 'false') {
    } else if (isPureString(value)) {
    } else {
      value = JSON.stringify(value);
    }
    objParts.push(`${pair.key}: ${value}`);
  }

  return `{ ${objParts.join(', ')} }`;
}

function parseItFile(source) {
  let text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n');
  let treeStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith('[')) {
      treeStart = i;
      break;
    }
  }
  if (treeStart === -1) {
    throw new Error('.it file mein element tree ka [ nahi mila');
  }
  const headerBlock = lines.slice(0, treeStart).join('\n').trim();
  const itCode = lines.slice(treeStart).join('\n').trim();

  let stateCode = null;
  let scriptCode = null;

  if (headerBlock) {
    const stateMatch = headerBlock.match(/^STATE\s*[:\-]\s*([\s\S]*?)(?=\nSCRIPT\s*[:\-]|$)/i);
    if (stateMatch) stateCode = stateMatch[1].trim();

    const scriptMatch = headerBlock.match(/SCRIPT\s*[:\-]\s*([\s\S]*)/i);
    if (scriptMatch) scriptCode = scriptMatch[1].trim();
  }

  return { stateCode, scriptCode, itCode };
}

export function transformItToJs(source) {
  const { stateCode, scriptCode, itCode } = parseItFile(source);

  const trimmedTree = itCode.trim();
  if (!trimmedTree.startsWith('[') || !trimmedTree.endsWith(']')) {
    throw new Error('.it syntax ghalat: File [ se shuru aur ] par khatam honi chahiye.');
  }

  const inner = trimmedTree.slice(1, -1).trim();
  const parts = splitTopLevel(inner);

  const props = [];
  const children = [];

  for (const part of parts) {
    const p = part.trim();
    if (!p) continue;
    if (p.startsWith('{') && p.endsWith('}')) {
      children.push(p);
    } else {
      const pair = parsePair(p);
      if (pair) props.push(pair);
    }
  }

  const propsList = processProps(props);
  const childrenCode = children.map(c => compileChildElement(c));

  const createElementArgs = [
    `'div'`,
    `{ ${propsList.join(', ')} }`,
    ...childrenCode,
  ].join(', ');

  const stateBlock = stateCode
    ? `export const STATE = ${parseStateBlock(stateCode)};\n\n`
    : '';

  const scriptBlock = scriptCode ? scriptCode + '\n\n' : '';

  return `
import { createElement, rerender as RERENDER } from 'tahir-code-easy';

${stateBlock}${scriptBlock}export default function build() {
  return createElement(${createElementArgs});
}
  `.trim();
}