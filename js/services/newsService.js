import Config from '../config.js';
import http from '../utils/http.js';

class NewsService {
    constructor() {
        this.apiKey = Config.api.guardianApi.key;
        this.baseUrl = Config.api.guardianApi.baseUrl;
        this.endpoints = Config.api.guardianApi.endpoints;
    }
    
    async getTopHeadlines(params = {}) {
        try {
            const queryParams = {
                'api-key': this.apiKey,
                'show-fields': 'headline,trailText,thumbnail,byline,publication,lastModified,shortUrl',
                'page-size': params.pageSize || Config.defaultParams.pageSize,
                'page': params.page || Config.defaultParams.page,
                'order-by': params.orderBy || Config.defaultParams.orderBy,
                'section': params.section || Config.defaultParams.section
            };
        
            const url = `${this.baseUrl}${this.endpoints.search}`;
            const response = await http.get(url, queryParams);
            
            if (!response.response || !response.response.results) {
                throw new Error('Invalid Guardian API response');
            }
            
            const articles = response.response.results.map(item => {
                // Используем категорию напрямую из API
                return {
                    title: item.webTitle,
                    description: item.fields?.trailText || '',
                    url: item.webUrl,
                    urlToImage: item.fields?.thumbnail || '',
                    publishedAt: item.webPublicationDate,
                    source: {
                        id: 'guardian',
                        name: item.sectionName || item.pillarName || 'News'
                    },
                    author: item.fields?.byline || ''
                };
            });
            
            return {
                articles: articles,
                totalResults: response.response.total
            };
        } catch (error) {
            console.error('Error fetching from Guardian API:', error);
            throw error;
        }
    }
}

export default NewsService;
