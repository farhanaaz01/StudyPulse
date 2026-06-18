function SubjectSelector({ subjects, selectedSubject, onSelectSubject }) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Select Subject</h3>

      <div style={styles.chips}>
        {subjects.map((subject) => {
          const active = selectedSubject?.id === subject.id;

          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject)}
              style={{
                ...styles.chip,
                background: active ? "#2563eb" : "#1f2937",
                color: active ? "#ffffff" : "#d1d5db",
                borderColor: active ? "#2563eb" : "#334155",
              }}
            >
              {subject.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#111827",
    border: "1px solid #243244",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "24px",
  },
  title: {
    margin: "0 0 14px",
    color: "#ffffff",
    fontSize: "18px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  chip: {
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default SubjectSelector;