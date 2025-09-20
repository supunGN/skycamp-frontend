import { useState, useEffect } from "react";
import { API } from "../api";

export function usePendingVerificationCount(refreshKey = 0) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCount = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.admin.getPendingVerificationCount();
      if (response.success) {
        setCount(response.count);
      } else {
        setError("Failed to fetch verification count");
      }
    } catch (err) {
      console.error("Error fetching pending verification count:", err);
      setError(err.message || "Failed to fetch verification count");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [refreshKey]);

  return { count, loading, error, refetch: fetchCount };
}
