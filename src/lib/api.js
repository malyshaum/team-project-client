const DEFAULT_API_BASE_URL = 'https://questboard-server-production.up.railway.app';
const TOKEN_STORAGE_KEY = 'questboard.auth.token';
const USER_STORAGE_KEY = 'questboard.auth.user';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY) || '';

export const getStoredUser = () => {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
};

export const persistSession = ({ token, user }) => {
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
};

export const clearStoredSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
};

const buildHeaders = (headers, token, body) => {
    const normalizedHeaders = new Headers(headers || {});
    if (body !== undefined && !normalizedHeaders.has('Content-Type')) {
        normalizedHeaders.set('Content-Type', 'application/json');
    }
    if (token) {
        normalizedHeaders.set('Authorization', `Bearer ${token}`);
    }
    return normalizedHeaders;
};

export const apiRequest = async (path, options = {}) => {
    const { body, headers, token = getStoredToken(), ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: buildHeaders(headers, token, body),
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => '');

    if (!response.ok) {
        const message =
            payload?.message ||
            payload?.error ||
            payload?.details ||
            (typeof payload === 'string' && payload) ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return payload;
};

export const apiFormRequest = async (path, { formData, headers, token = getStoredToken(), ...rest } = {}) => {
    const normalizedHeaders = new Headers(headers || {});
    if (token) {
        normalizedHeaders.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: normalizedHeaders,
        body: formData
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => '');

    if (!response.ok) {
        const message =
            payload?.message ||
            payload?.error ||
            payload?.details ||
            (typeof payload === 'string' && payload) ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return payload;
};
