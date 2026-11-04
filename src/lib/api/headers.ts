export const getFanvueHeaders = (accessToken: string) => ({
    "X-Fanvue-API-Version": "2025-06-26",
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
});