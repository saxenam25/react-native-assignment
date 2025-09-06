import { useEffect, useState, useMemo } from "react";
import asyncStorage from '../../core/asyncStorage';

type UseFetchResult<T> = {
    data: T;
    loading: boolean;
    error: Error | null;
};

type UseFetchOptions = {
    delayApiInterval?: number; // Optional delay in milliseconds
};

function useFetch<T = any>(url: string, asyncStorageKey: string = '', options?: UseFetchOptions): UseFetchResult<T> {
    console.log("🚀 ~ url:", url)
    const [data, setData] = useState<T>([] as unknown as T);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Memoize the options to prevent unnecessary re-renders
    const memoizedOptions = useMemo(() => options, [options?.delayApiInterval]);

    useEffect(() => {
        // Reset loading state when URL changes (including refresh key changes)
        setLoading(true);
        setError(null);
        
        const fetchData = async () => {
            try {
                // Add minimum loading delay if specified in options
                const startTime = Date.now();
                
                const response = await fetch(url);
                const result = await response.json();

                console.log("🚀 ~ result:", result)
                
                // Apply delay only if delayApiInterval is provided
                if (memoizedOptions?.delayApiInterval) {
                    // Calculate remaining time to reach the specified delay
                    const elapsedTime = Date.now() - startTime;
                    const remainingDelay = Math.max(0, memoizedOptions.delayApiInterval - elapsedTime);
                    
                    // Wait for remaining time if needed
                    if (remainingDelay > 0) {
                        await new Promise(resolve => setTimeout(resolve, remainingDelay));
                    }
                }
                
                setData(result);
                // Only save to async storage if key is provided and valid
                if (asyncStorageKey && asyncStorageKey.trim() !== '') {
                    asyncStorage.saveData(asyncStorageKey, result);
                }
            } catch (error: any) {
                console.error("Error fetching data:", error);
                setError(error instanceof Error ? error : new Error(String(error)));
            } finally {
                setLoading(false);
            }
        };

        const loadData = async () => {
            try {
                // Only check async storage if key is provided and valid
                if (asyncStorageKey && asyncStorageKey.trim() !== '') {
                    // Check if data exists in async storage
                    const cachedData = await asyncStorage.getData(asyncStorageKey);
                    if (cachedData) {
                        setData(cachedData);
                        setLoading(false);
                        return; // Exit early if cached data is found
                    }
                }

                // If no async storage key or no cached data, fetch from API
                await fetchData();
            } catch (error: any) {
                console.error("Error loading cached data:", error);
                await fetchData(); // Fallback to fetch if cache fails
            }
        };

        // Only proceed if we have a valid URL
        if (url) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [url, asyncStorageKey, memoizedOptions]); // Use memoizedOptions instead of options

    return { data, loading, error };
}

export default useFetch;
