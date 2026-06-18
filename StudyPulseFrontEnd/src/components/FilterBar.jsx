function FilterBar({
  filterPeriod,
  setFilterPeriod,
  filterSubject,
  setFilterSubject,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="panel filter-panel">
        <div className="skeleton skeleton-text medium" />
        <div className="filter-grid">
          <div className="skeleton skeleton-select" />
          <div className="skeleton skeleton-select" />
        </div>
      </div>
    );
  }

  return (
    <div className="panel filter-panel">
      <p className="panel-title">Filters</p>

      <div className="filter-grid">
        <label className="filter-label">
          Period
          <select
            className="filter-select"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="all">All Time</option>
          </select>
        </label>

        <label className="filter-label">
          Subject
          <select
            className="filter-select"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            <option value="General">General</option>
            <option value="DSA">DSA</option>
            <option value="Java">Java</option>
            <option value="React">React</option>
            <option value="Spring Boot">Spring Boot</option>
            <option value="AI">AI</option>
            <option value="Math">Math</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default FilterBar;