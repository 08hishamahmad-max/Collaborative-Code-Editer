import { useMemo } from "react";
import type { Language } from "../../types/workspace";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  code: string;
  language: Language;
}

type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "tag"
  | "attr"
  | "property"
  | "text";

interface Token {
  type: TokenType;
  value: string;
}

/* ---------- Language rules ---------- */

const JS_KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for",
  "while", "do", "switch", "case", "break", "continue", "import",
  "from", "export", "default", "class", "extends", "new", "this",
  "typeof", "instanceof", "true", "false", "null", "undefined", "async",
  "await", "try", "catch", "finally", "throw",
]);

const TS_KEYWORDS = new Set([
  ...JS_KEYWORDS,
  "type", "interface", "enum", "implements", "readonly", "public",
  "private", "protected", "string", "number", "boolean", "any", "void",
  "never", "unknown",
]);

const CSS_KEYWORDS = new Set([
  "important", "inherit", "initial", "unset", "auto", "none", "block",
  "inline", "flex", "grid", "absolute", "relative", "fixed", "static",
]);

/* ---------- Tokenizers ---------- */

function tokenizeJsLike(code: string, keywords: Set<string>): Token[] {
  const regex =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'`])((?:\\.|(?!\2)[^\\])*)\2|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }

    const [full, comment, quote, , number, ident] = match;

    if (comment) {
      tokens.push({ type: "comment", value: full });
    } else if (quote) {
      tokens.push({ type: "string", value: full });
    } else if (number) {
      tokens.push({ type: "number", value: full });
    } else if (ident) {
      if (keywords.has(ident)) {
        tokens.push({ type: "keyword", value: ident });
      } else {
        const after = code.slice(regex.lastIndex);
        if (/^\s*\(/.test(after)) {
          tokens.push({ type: "function", value: ident });
        } else {
          tokens.push({ type: "text", value: ident });
        }
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

function tokenizeHtml(code: string): Token[] {
  const regex =
    /(<!--[\s\S]*?-->)|(<\/?)([A-Za-z][\w-]*)|([A-Za-z-]+)=("[^"]*"|'[^']*')|(>|\/>)/g;

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }

    const [, comment, openClose, tagName, attrName, attrValue, closer] = match;

    if (comment) {
      tokens.push({ type: "comment", value: comment });
    } else if (openClose) {
      tokens.push({ type: "text", value: openClose });
      tokens.push({ type: "tag", value: tagName });
    } else if (attrName) {
      tokens.push({ type: "attr", value: attrName });
      tokens.push({ type: "text", value: "=" });
      tokens.push({ type: "string", value: attrValue });
    } else if (closer) {
      tokens.push({ type: "text", value: closer });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

function tokenizeCss(code: string): Token[] {
  const regex =
    /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms)?\b)|(--[\w-]+|[a-zA-Z-]+)(?=\s*:)|([a-zA-Z-]+)(?=\s*\()/g;

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }

    const [full, comment, str, number, property, func] = match;

    if (comment) tokens.push({ type: "comment", value: full });
    else if (str) tokens.push({ type: "string", value: str });
    else if (number) tokens.push({ type: "number", value: full });
    else if (property) tokens.push({ type: "property", value: full });
    else if (func) {
      tokens.push(
        CSS_KEYWORDS.has(func)
          ? { type: "keyword", value: full }
          : { type: "function", value: full },
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

function tokenizeJson(code: string): Token[] {
  const regex =
    /("(?:\\.|[^"\\])*")(\s*:)?|(\b-?\d+(?:\.\d+)?\b)|\b(true|false|null)\b/g;

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }

    const [, str, colon, number, bool] = match;

    if (str) {
      tokens.push({ type: colon ? "property" : "string", value: str });
      if (colon) tokens.push({ type: "text", value: colon });
    } else if (number) {
      tokens.push({ type: "number", value: number });
    } else if (bool) {
      tokens.push({ type: "keyword", value: bool });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

function tokenize(code: string, language: Language): Token[] {
  switch (language) {
    case "javascript":
      return tokenizeJsLike(code, JS_KEYWORDS);
    case "typescript":
      return tokenizeJsLike(code, TS_KEYWORDS);
    case "html":
      return tokenizeHtml(code);
    case "css":
      return tokenizeCss(code);
    case "json":
      return tokenizeJson(code);
    default:
      return [{ type: "text", value: code }];
  }
}

function CodeViewer({ code, language }: CodeViewerProps) {
  const lines = useMemo(() => {
    const tokens = tokenize(code, language);
    const result: Token[][] = [[]];

    for (const token of tokens) {
      const parts = token.value.split("\n");
      parts.forEach((part, idx) => {
        if (part.length > 0) {
          result[result.length - 1].push({ type: token.type, value: part });
        }
        if (idx < parts.length - 1) {
          result.push([]);
        }
      });
    }

    return result;
  }, [code, language]);

  return (
    <div className={styles.viewer} role="region" aria-label="Code viewer">
      <pre className={styles.pre}>
        <code>
          {lines.map((lineTokens, i) => (
            <div key={i} className={styles.line}>
              <span className={styles.lineNumber}>{i + 1}</span>
              <span className={styles.lineContent}>
                {lineTokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  lineTokens.map((t, j) => (
                    <span key={j} className={styles[t.type]}>
                      {t.value}
                    </span>
                  ))
                )}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default CodeViewer;