export const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getTodayKey = () => {
  return getDateKey(new Date());
};

export const shiftDateKey = (dateKey, offset) => {
  const date = new Date(`${dateKey}T00:00:00`);

  date.setDate(date.getDate() + offset);

  return getDateKey(date);
};

export const readJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};