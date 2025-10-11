import { env } from "./env";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        // To send the cookies of auth in the request
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };


    const response = await fetch(`${env.VITE_API_BASE_URL}${endpoint}`, defaultOptions);

    if (!response.ok) {
        // Handle HTTP errors (e.g., 401 Unauthorized, 500 Server Error)
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) return;
    // Handle cases where the response body might be empty (e.g., for a 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return; // Return undefined for non-JSON responses
}
