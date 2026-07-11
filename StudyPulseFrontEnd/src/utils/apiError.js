export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the server. Make sure the backend is running.";
  }

  return fallback;
}

export function isDuplicateSubjectError(error) {
  const status = Number(error?.response?.status);
  const message = getApiErrorMessage(error, "").toLowerCase();

  return (
    status === 400 ||
    message.includes("already exists") ||
    message.includes("duplicate")
  );
}
