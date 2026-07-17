const Loader = () => {
  const dots = [0, 1, 2];

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.75; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div style={styles.card}>
        <div style={styles.orbit}>
          <div style={styles.ring} />
          <div style={{ ...styles.ring, ...styles.ringSecondary }} />
          <div style={styles.core} />
        </div>

        <div style={styles.textBlock}>
          <h3 style={styles.title}>Loading...</h3>
          {/* <p style={styles.subtitle}>
            Syncing your messages and conversations...
          </p> */}
        </div>

        <div style={styles.dots}>
          {dots.map((dot) => (
            <span
              key={dot}
              style={{
                ...styles.dot,
                animationDelay: `${dot * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: "2000",
    background:
      "radial-gradient(circle at top, #1f2a44 0%, #0f172a 60%, #020617 100%)",
    opacity: 0.9,
    backgroundBlendMode: "darken",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    borderRadius: "24px",
    padding: "32px 24px",
    background: "rgba(15, 23, 42, 0.72)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 45px rgba(2, 6, 23, 0.45)",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    textAlign: "center",
  },
  orbit: {
    position: "relative",
    width: "140px",
    height: "140px",
    margin: "0 auto 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "4px solid transparent",
    borderTopColor: "#8b5cf6",
    borderRightColor: "#38bdf8",
    animation: "spin 1.2s linear infinite",
    boxShadow: "0 0 18px rgba(56, 189, 248, 0.35)",
  },
  ringSecondary: {
    inset: "18px",
    borderTopColor: "#34d399",
    borderLeftColor: "#f59e0b",
    animationDirection: "reverse",
    animationDuration: "1.8s",
  },
  core: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6, #38bdf8)",
    boxShadow: "0 0 24px rgba(56, 189, 248, 0.45)",
    animation: "pulse 1.4s ease-in-out infinite",
  },
  textBlock: {
    marginBottom: "16px",
  },
  title: {
    margin: "0 0 8px",
    color: "#f8fafc",
    fontSize: "22px",
    fontWeight: 700,
  },
  subtitle: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "10px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
    animation: "float 1s ease-in-out infinite",
  },
};

export default Loader;
