import styles from "./CodePreview.module.css";

/**
 * Static, decorative code-editor mockup for the landing page.
 * Not a real editor — purely visual. Monaco will be used on the editor page.
 */
function CodePreview() {
  return (
    <div className={styles.window} role="img" aria-label="Code editor preview">
      {/* Window chrome */}
      <div className={styles.titleBar}>
        <div className={styles.dots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <div className={styles.tab}>collab-session.ts</div>
        <div className={styles.spacer} />
      </div>

      {/* Code body */}
      <pre className={styles.code} aria-hidden="true">
        <code>
          <Line n={1}>
            <K>import</K> {"{ "}<V>io</V>{" }"} <K>from</K> <S>"socket.io-client"</S>;
          </Line>
          <Line n={2}>
            <K>import</K> {"{ "}<V>Doc</V>{" }"} <K>from</K> <S>"yjs"</S>;
          </Line>
          <Line n={3}> </Line>
          <Line n={4}>
            <C>{"// Join a collaborative coding session"}</C>
          </Line>
          <Line n={5}>
            <K>export function</K> <F>joinRoom</F>(<V>roomId</V>: <T>string</T>) {"{"}
          </Line>
          <Line n={6}>
            {"  "}<K>const</K> <V>doc</V> = <K>new</K> <F>Doc</F>();
          </Line>
          <Line n={7}>
            {"  "}<K>const</K> <V>socket</V> = <F>io</F>(<S>"https://collabcode.dev"</S>);
          </Line>
          <Line n={8}> </Line>
          <Line n={9}>
            {"  "}<V>socket</V>.<F>emit</F>(<S>"room:join"</S>, {"{ "}<V>roomId</V>{" }"});
          </Line>
          <Line n={10}>
            {"  "}<V>socket</V>.<F>on</F>(<S>"doc:update"</S>, (<V>update</V>) {"=> {"}
          </Line>
          <Line n={11}>
            {"    "}<V>doc</V>.<F>applyUpdate</F>(<V>update</V>);
          </Line>
          <Line n={12}>{"  "}{"});"}</Line>
          <Line n={13}> </Line>
          <Line n={14}>
            {"  "}<K>return</K> <V>doc</V>;
          </Line>
          <Line n={15}>{"}"}</Line>
        </code>
      </pre>
    </div>
  );
}

/* ---------- Tiny inline helpers to keep JSX readable ---------- */

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className={styles.line}>
      <span className={styles.lineNumber}>{n}</span>
      <span className={styles.lineContent}>{children}</span>
    </span>
  );
}

const K = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.keyword}>{children}</span>
);
const S = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.string}>{children}</span>
);
const F = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.func}>{children}</span>
);
const V = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.variable}>{children}</span>
);
const T = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.type}>{children}</span>
);
const C = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.comment}>{children}</span>
);

export default CodePreview;