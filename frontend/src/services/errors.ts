import axios from "axios";

export type NormalizedError = {
  title: string;
  message: string;
  status?: number;
};

export function normalizeError(err: unknown): NormalizedError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as { message?: string; error?: string };
    const message =
      data?.message ||
      data?.error ||
      err.message ||
      "Something went wrong. Please try again.";
    return {
      title: status === 401 ? "Unauthorized" : "Error",
      message,
      status,
    };
  }

  if (err instanceof Error) {
    return {
      title: "Error",
      message: err.message,
    };
  }

  return {
    title: "Error",
    message: "Something went wrong. Please try again.",
  };
}
