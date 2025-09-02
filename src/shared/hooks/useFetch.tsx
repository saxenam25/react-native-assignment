import { useEffect, useState } from "react";
import asyncStorage from '../../core/asyncStorage';

type UseFetchResult<T> = {
    data: T;
    loading: boolean;
    error: Error | null;
};

function useFetch<T = any>(url: string, asyncStorageKey: string =  ''): UseFetchResult<T> {
    const [data, setData] = useState<T>([] as unknown as T);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const result = await response.json();
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

        loadData();
    }, [url, asyncStorageKey]);

    return { data, loading, error };
}

export default useFetch;
