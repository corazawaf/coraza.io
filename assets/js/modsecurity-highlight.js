/*!
 * ModSecurity/SecLang syntax highlighter
 * Highlights modsecurity code blocks using Chroma CSS classes
 */

(() => {
  'use strict';

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tokenize(code) {
    const tokens = [];
    let i = 0;
    const len = code.length;

    while (i < len) {
      const ch = code[i];

      // Newline
      if (ch === '\n') {
        tokens.push({ type: 'text', value: '\n' });
        i++;
        continue;
      }

      // Line continuation
      if (ch === '\\' && i + 1 < len && code[i + 1] === '\n') {
        tokens.push({ type: 'text', value: '\\\n' });
        i += 2;
        continue;
      }

      // Comment (# to end of line)
      if (ch === '#') {
        let end = code.indexOf('\n', i);
        if (end === -1) end = len;
        tokens.push({ type: 'comment', value: code.slice(i, end) });
        i = end;
        continue;
      }

      // Double-quoted string
      if (ch === '"') {
        let j = i + 1;
        while (j < len && code[j] !== '\n') {
          if (code[j] === '\\' && j + 1 < len) {
            j += 2;
          } else if (code[j] === '"') {
            j++;
            break;
          } else {
            j++;
          }
        }
        tokens.push({ type: 'string', value: code.slice(i, j) });
        i = j;
        continue;
      }

      // Single-quoted string
      if (ch === "'") {
        let j = i + 1;
        while (j < len && code[j] !== '\n') {
          if (code[j] === '\\' && j + 1 < len) {
            j += 2;
          } else if (code[j] === "'") {
            j++;
            break;
          } else {
            j++;
          }
        }
        tokens.push({ type: 'string', value: code.slice(i, j) });
        i = j;
        continue;
      }

      // Macro expansion %{...}
      if (ch === '%' && i + 1 < len && code[i + 1] === '{') {
        let end = code.indexOf('}', i);
        if (end !== -1) {
          end++;
          tokens.push({ type: 'macro', value: code.slice(i, end) });
          i = end;
          continue;
        }
      }

      // Operator (@word) or negated operator (!@word)
      if (ch === '@') {
        let j = i + 1;
        while (j < len && /[a-zA-Z_]/.test(code[j])) j++;
        if (j > i + 1) {
          tokens.push({ type: 'operator', value: code.slice(i, j) });
          i = j;
          continue;
        }
      }

      // Words (directives, variables, actions, etc.)
      if (/[a-zA-Z_]/.test(ch)) {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_]/.test(code[j])) j++;
        const word = code.slice(i, j);

        // Directives start with Sec or are Include
        if (/^Sec[A-Z]/.test(word) || word === 'Include') {
          tokens.push({ type: 'directive', value: word });
        }
        // Variables are ALL_CAPS
        else if (/^[A-Z][A-Z0-9_]{2,}$/.test(word)) {
          tokens.push({ type: 'variable', value: word });
        }
        // Action keywords
        else if (/^(deny|drop|pass|allow|redirect|proxy|pause|log|nolog|auditlog|noauditlog|chain|skip|skipAfter|block|status|capture|t|setvar|initcol|setsid|setuid|setenv|exec|ctl|multiMatch|tag|ver|rev|severity|logdata|msg|phase|id|accuracy|maturity|xmlns|expirevar|deprecatevar|append|prepend|sanitiseArg|sanitiseMatched|sanitiseMatchedBytes|sanitiseRequestHeader|sanitiseResponseHeader)$/.test(word)) {
          tokens.push({ type: 'action', value: word });
        }
        else {
          tokens.push({ type: 'text', value: word });
        }
        i = j;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(ch)) {
        let j = i + 1;
        while (j < len && /[0-9.]/.test(code[j])) j++;
        tokens.push({ type: 'number', value: code.slice(i, j) });
        i = j;
        continue;
      }

      // Pipe, ampersand, exclamation (variable modifiers)
      if (ch === '|' || ch === '&' || ch === '!') {
        tokens.push({ type: 'punct', value: ch });
        i++;
        continue;
      }

      // Everything else
      tokens.push({ type: 'text', value: ch });
      i++;
    }

    return tokens;
  }

  function highlight(code) {
    return tokenize(code).map(t => {
      const v = escapeHtml(t.value);
      switch (t.type) {
        case 'comment':   return `<span class="c1">${v}</span>`;
        case 'directive': return `<span class="k">${v}</span>`;
        case 'variable':  return `<span class="nv">${v}</span>`;
        case 'operator':  return `<span class="nd">${v}</span>`;
        case 'string':    return `<span class="s">${v}</span>`;
        case 'number':    return `<span class="mi">${v}</span>`;
        case 'macro':     return `<span class="si">${v}</span>`;
        case 'action':    return `<span class="na">${v}</span>`;
        case 'punct':     return `<span class="o">${v}</span>`;
        default:          return v;
      }
    }).join('');
  }

  document.querySelectorAll('code.language-modsecurity').forEach(el => {
    el.innerHTML = highlight(el.textContent);
  });
})();
