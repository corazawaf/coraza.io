/*!
 * Connector syntax highlighters: YAML, Caddyfile, NGINX, HAProxy
 * Uses Chroma CSS classes for consistency with the rest of the site.
 */

(() => {
  'use strict';

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function span(cls, val) {
    return `<span class="${cls}">${esc(val)}</span>`;
  }

  // ── YAML ───────────────────────────────────────────────────────────────────
  function highlightYaml(code) {
    return code.split('\n').map(line => {
      // Comment
      const commentMatch = line.match(/^(\s*)(#.*)$/);
      if (commentMatch) {
        return esc(commentMatch[1]) + span('c1', commentMatch[2]);
      }

      // List item with key: value  (  - key: value)
      const listKeyVal = line.match(/^(\s*-\s+)([a-zA-Z_"@.-]+)(\s*:\s*)(.*)$/);
      if (listKeyVal) {
        return esc(listKeyVal[1]) + span('nt', listKeyVal[2]) + esc(listKeyVal[3]) + highlightYamlValue(listKeyVal[4]);
      }

      // key: value
      const keyVal = line.match(/^(\s*)([a-zA-Z_"@.-]+)(\s*:\s*)(.*)$/);
      if (keyVal) {
        return esc(keyVal[1]) + span('nt', keyVal[2]) + esc(keyVal[3]) + highlightYamlValue(keyVal[4]);
      }

      // List item (bare)
      const listItem = line.match(/^(\s*-\s+)(.*)$/);
      if (listItem) {
        return esc(listItem[1]) + highlightYamlValue(listItem[2]);
      }

      return esc(line);
    }).join('\n');
  }

  function highlightYamlValue(val) {
    if (!val) return '';
    // Block scalar indicator |, >
    if (/^\s*[|>]/.test(val)) return span('o', val.trim());
    // Quoted string
    if (/^".*"$/.test(val.trim())) return span('s2', val.trim());
    if (/^'.*'$/.test(val.trim())) return span('s1', val.trim());
    // Boolean / null
    if (/^(true|false|null|~)$/.test(val.trim())) return span('kc', val.trim());
    // Number
    if (/^-?\d+(\.\d+)?$/.test(val.trim())) return span('mi', val.trim());
    return esc(val);
  }

  // ── Caddyfile ──────────────────────────────────────────────────────────────
  const CADDY_DIRECTIVES = new Set([
    'order','http','https','tls','encode','file_server','reverse_proxy',
    'handle','handle_errors','respond','header','root','rewrite',
    'redir','log','coraza_waf','route','push','php_fastcgi','templates',
    'basicauth','forward_auth'
  ]);

  function highlightCaddy(code) {
    return code.split('\n').map(line => {
      const commentMatch = line.match(/^(\s*)(#.*)$/);
      if (commentMatch) {
        return esc(commentMatch[1]) + span('c1', commentMatch[2]);
      }

      // Braces
      if (/^\s*[{}]\s*$/.test(line)) return span('o', line);

      // Backtick string spans are handled token by token below
      const tokens = [];
      const trimmed = line.trimStart();
      const indent = line.slice(0, line.length - trimmed.length);
      tokens.push(esc(indent));

      // Split on spaces, preserving backtick strings
      const parts = [];
      let buf = '';
      let inBt = false;
      for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        if (ch === '`') {
          inBt = !inBt;
          buf += ch;
          if (!inBt) { parts.push(buf); buf = ''; }
        } else if (ch === ' ' && !inBt) {
          if (buf) { parts.push(buf); buf = ''; }
          parts.push(' ');
        } else {
          buf += ch;
        }
      }
      if (buf) parts.push(buf);

      parts.forEach((p, i) => {
        if (p === ' ') { tokens.push(' '); return; }
        if (p.startsWith('`') && p.endsWith('`')) { tokens.push(span('s', p)); return; }
        if (p === '{' || p === '}') { tokens.push(span('o', p)); return; }
        if (i === 0 && CADDY_DIRECTIVES.has(p)) { tokens.push(span('k', p)); return; }
        if (i === 0 && indent.length > 0) { tokens.push(span('na', p)); return; }
        tokens.push(esc(p));
      });

      return tokens.join('');
    }).join('\n');
  }

  // ── NGINX ──────────────────────────────────────────────────────────────────
  const NGINX_BLOCKS = new Set([
    'http','server','location','events','stream','upstream','geo','map',
    'types','limit_except'
  ]);
  const NGINX_DIRECTIVES = new Set([
    'load_module','worker_processes','error_log','pid','include',
    'listen','server_name','root','index','try_files','proxy_pass',
    'proxy_set_header','add_header','return','rewrite','access_log',
    'coraza_enable','coraza_on','coraza_rules_file','coraza_rules',
    'coraza_rules_dir','coraza_mode'
  ]);

  function highlightNginx(code) {
    return code.split('\n').map(line => {
      const commentMatch = line.match(/^(\s*)(#.*)$/);
      if (commentMatch) {
        return esc(commentMatch[1]) + span('c1', commentMatch[2]);
      }
      if (/^\s*[{}]\s*$/.test(line)) return span('o', line);

      const m = line.match(/^(\s*)(\S+)(.*?)(;?)$/);
      if (!m) return esc(line);
      const [, ws, word, rest, semi] = m;
      let wordSpan = esc(word);
      if (NGINX_BLOCKS.has(word)) wordSpan = span('k', word);
      else if (NGINX_DIRECTIVES.has(word)) wordSpan = span('na', word);
      return esc(ws) + wordSpan + esc(rest) + (semi ? span('o', ';') : '');
    }).join('\n');
  }

  // ── HAProxy ────────────────────────────────────────────────────────────────
  const HAPROXY_SECTIONS = new Set([
    'global','defaults','frontend','backend','listen','userlist','peers','resolvers'
  ]);

  function highlightHAProxy(code) {
    return code.split('\n').map(line => {
      const commentMatch = line.match(/^(\s*)(#.*)$/);
      if (commentMatch) {
        return esc(commentMatch[1]) + span('c1', commentMatch[2]);
      }

      const m = line.match(/^(\s*)(\S+)(.*)$/);
      if (!m) return esc(line);
      const [, ws, word, rest] = m;

      if (HAPROXY_SECTIONS.has(word)) {
        // section name + arg
        const argMatch = rest.match(/^(\s+)(\S+)(.*)$/);
        if (argMatch) {
          return span('k', word) + esc(argMatch[1]) + span('nv', argMatch[2]) + esc(argMatch[3]);
        }
        return span('k', word) + esc(rest);
      }

      if (ws.length > 0) {
        // option / directive inside a section
        return esc(ws) + span('na', word) + esc(rest);
      }

      return esc(line);
    }).join('\n');
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.highlightConnectorCode = function(code, lang) {
    switch (lang) {
      case 'yaml':    return highlightYaml(code);
      case 'caddy':   return highlightCaddy(code);
      case 'nginx':   return highlightNginx(code);
      case 'haproxy': return highlightHAProxy(code);
      default:        return esc(code);
    }
  };
})();
