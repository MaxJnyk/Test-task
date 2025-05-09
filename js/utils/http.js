class HttpService {
    async get(url, params = {}) {
        const queryString = this._buildQueryString(params);
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
    _buildQueryString(params) {
        return Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
}
const http = new HttpService();
export default http;
