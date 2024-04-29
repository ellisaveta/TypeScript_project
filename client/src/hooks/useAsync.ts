import { DependencyList, useEffect, useState } from "react";
import { useAsyncAction } from "./useAsyncAction";

export function useAsync<T>(
  action: () => Promise<T>,
  dependencies: DependencyList
) {
  const { trigger, data, loading, error } = useAsyncAction(action, {
    loading: true,
  });

  useEffect(trigger, dependencies);

  return {
    data,
    loading,
    error,
    reload: trigger,
  };
}
