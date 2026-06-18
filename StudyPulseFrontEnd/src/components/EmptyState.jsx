function EmptyState() {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>No study data yet</h3>
      <p style={styles.text}>Start your first study session to see stats, streaks, and weekly progress here.</p>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#111827",
    border: "1px dashed #334155",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
  },
  title: {
    margin: "0 0 10px",
    color: "#ffffff",
    fontSize: "20px",
  },
  text: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
};

export default EmptyState;