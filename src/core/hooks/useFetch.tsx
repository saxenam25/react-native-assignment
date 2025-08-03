import { useEffect, useState } from "react";

type UseFetchResult<T> = {
    data: T;
    loading: boolean;
    error: Error | null;
};

function useFetch<T = any>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T>([] as unknown as T);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const result = await response.json();
                setData(result);
            } catch (error: any) {
                console.error("Error fetching data:", error);
                setError(error instanceof Error ? error : new Error(String(error)));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

export default useFetch;
