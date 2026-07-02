const fs = require('fs');
const path = require('path');

const COLOR_TOKENS_PATH = path.join(__dirname, 'color-token.json');
const DESIGN_TOKENS_PATH = path.join(__dirname, 'design-tokens.tokens.json');
const OUTPUT_PATH = path.join(__dirname, 'tokens.css');

function flattenTokens(obj, prefix = '') {
  let tokens = {};
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !value.hasOwnProperty('value')) {
      Object.assign(tokens, flattenTokens(value, newKey));
    } else {
      tokens[newKey] = value;
    }
  }
  return tokens;
}

const FALLBACKS = {
  'color.palette.error.40': 'hsl(0, 100%, 40%)',
  'color.palette.error.80': 'hsl(0, 100%, 80%)',
  'color.palette.error.100': 'hsl(0, 0%, 100%)',
  'color.palette.error.30': 'hsl(0, 100%, 30%)',
  'color.palette.error.20': 'hsl(0, 100%, 20%)',
  'color.palette.error.90': 'hsl(0, 100%, 90%)',
  'color.palette.neutral.6': 'hsl(270, 7%, 6%)',
  'color.palette.neutral.4': 'hsl(270, 7%, 4%)',
  'color.palette.neutral.12': 'hsl(270, 7%, 12%)',
  'color.palette.neutral.17': 'hsl(270, 7%, 17%)',
  'color.palette.neutral.22': 'hsl(270, 7%, 22%)',
  'color.palette.neutral.24': 'hsl(270, 7%, 24%)',
};

function resolveValue(value, tokenMap) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^{(.*)}$/);
  if (match) {
    const path = match[1];
    const resolved = tokenMap[path];
    if (resolved === undefined) {
      if (FALLBACKS[path]) {
        console.warn(`Using fallback for missing token: ${path}`);
        return FALLBACKS[path];
      }
      console.warn(`Could not resolve token: ${path}`);
      return value;
    }
    return resolveValue(resolved, tokenMap);
  }
  return value;
}

function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
}

function generateCSS() {
  const colorData = JSON.parse(fs.readFileSync(COLOR_TOKENS_PATH, 'utf8'));
  const designData = JSON.parse(fs.readFileSync(DESIGN_TOKENS_PATH, 'utf8'));

  const colorTokenMap = flattenTokens(colorData);
  
  let css = '/* \n * THIS FILE IS GENERATED FROM DESIGN TOKENS. \n * DO NOT EDIT DIRECTLY. \n * UI should use color roles only.\n */\n\n';
  
  css += ':root {\n';

  // Process Typography
  const typography = designData.typography;
  for (const category in typography) {
    const properties = typography[category];
    for (const prop in properties) {
      const valObj = properties[prop];
      if (valObj && valObj.value !== undefined) {
        let value = valObj.value;
        if (valObj.type === 'dimension' || typeof value === 'number') {
          if (prop !== 'fontWeight' && !isNaN(value)) {
            value = `${value}px`;
          }
        }
        const varName = `--typography-${kebabCase(category)}-${kebabCase(prop)}`;
        css += `  ${varName}: ${value};\n`;
      }
    }
  }

  css += '\n  /* Light Mode Color Roles */\n';
  const lightRoles = colorData.color.role.light;
  for (const role in lightRoles) {
    const resolved = resolveValue(lightRoles[role], colorTokenMap);
    css += `  --color-${kebabCase(role)}: ${resolved};\n`;
  }

  css += '}\n\n';

  // Dark Mode
  css += '@media (prefers-color-scheme: dark) {\n  :root {\n';
  const darkRoles = colorData.color.role.dark;
  for (const role in darkRoles) {
    const resolved = resolveValue(darkRoles[role], colorTokenMap);
    css += `    --color-${kebabCase(role)}: ${resolved};\n`;
  }
  css += '  }\n}\n\n';

  css += '.dark {\n';
  for (const role in darkRoles) {
    const resolved = resolveValue(darkRoles[role], colorTokenMap);
    css += `  --color-${kebabCase(role)}: ${resolved};\n`;
  }
  css += '}\n';

  const appDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, css);
  console.log(`CSS tokens generated at ${OUTPUT_PATH}`);
}

generateCSS();
