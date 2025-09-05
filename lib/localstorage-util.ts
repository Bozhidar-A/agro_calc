/** Get a value from localStorage by key. Returns null if not found or not in browser. */
export function GetLocalStorageItem<T = string>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        // fallback to string if not JSON
        return raw as unknown as T;
    }
}

/** Set a value in localStorage by key. Serializes objects to JSON. */
export function SetLocalStorageItem<T = string>(key: string, value: T): void {
    try {
        if (typeof window !== 'undefined') {
            const toStore = typeof value === 'string' ? value : JSON.stringify(value);
            window.localStorage.setItem(key, toStore);
        }
    } catch {
        // ignore
    }
}

/** Remove a value from localStorage by key. */
export function RemoveLocalStorageItem(key: string): void {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
        }
    } catch {
        // ignore
    }
}
