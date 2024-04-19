import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncActionResult<Args extends any[], T> {
    data: T | undefined;
    loading: boolean;
    error?: unknown;
    trigger: (...args: Args) => void;
    perform: (...args: Args) => Promise<T>;
}


export function useAsyncAction<Args extends any[], T>(
    action: (...args: Args) => Promise<T>,
    initialState: { data?: T, loading?: boolean } = {}
): UseAsyncActionResult<Args, T> {
    const [loading, setLoading] = useState(initialState?.loading ?? false);
    const [error, setError] = useState<unknown>();
    const [data, setData] = useState<T | undefined>(initialState?.data);

    const requestIdRef = useRef(0);

    const actionRef = useRef(action);
    actionRef.current = action;

    const perform = useCallback(async (...args: Args) => {
        requestIdRef.current += 1;
        const myRequestId = requestIdRef.current;

        setLoading(true);
        try {
            const result = await actionRef.current(...args);

            if (requestIdRef.current === myRequestId) {
                setLoading(false);
                setError(undefined);
                setData(result);
            }

            return result;
        } catch (error) {
            if (requestIdRef.current === myRequestId) {
                setLoading(false);
                setError(error);
            }

            console.error(error);
            throw error;
        }
    }, []);

    const trigger = useCallback((...args: Args) => {
        perform(...args).catch(() => {
            // Intentionally ignored
        });
    }, []);

    useEffect(() => {
        return () => {
            requestIdRef.current += 1
        };
    }, []);

    return {
        loading,
        error,
        data,
        trigger,
        perform
    };
}
