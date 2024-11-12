class ApiService {

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getAll(endpoint) {
        const url = `${this.baseUrl}/${endpoint}`;

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else {
            throw new Error(response.statusText);
        }
    }
}

export default ApiService;