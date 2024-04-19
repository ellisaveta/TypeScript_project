if (!import.meta.env.VITE_SERVER_BASE_URL) {
    throw new Error('Please specify VITE_SERVER_BASE_URL');
}

export const config = {
    serverBaseUrl: import.meta.env.VITE_SERVER_BASE_URL as string
};
