const BASE_URL = 'https://gamt-api.vercel.app'

export const Fetch = async (URL) => {
    try {
        const response = await fetch(`${BASE_URL}${URL}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}