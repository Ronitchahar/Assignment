import apiClient from "./apiClient";

export async function getThreads() {
  const res = await apiClient.get("/api/threads");
  return res.data.threads;
}
