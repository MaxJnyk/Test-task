import eventEmitter from '../utils/eventEmitter.js';
import Config from '../config.js';
import NewsService from '../services/newsService.js';

class NewsModel {
    constructor() {
        this.articles = [];
        this.featuredArticles = {
            mainStory: null,
            sideStories: []
        };
        this.totalResults = 0;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreNews = true;
        this.error = null;
        this.newsService = new NewsService();
    }
    async loadNews(options = {}) {
        if (this.isLoading) return;
        try {
            this.isLoading = true;
            this.error = null;
            eventEmitter.emit('news:loading', { append: options.append });
            const params = {
                country: options.country || Config.defaultParams.country,
                pageSize: 12,
                page: options.page || this.currentPage,
                category: options.category || ''
            };
            const result = await this.newsService.getTopHeadlines(params);
            if (options.append) {
                this.articles = [...this.articles, ...result.articles];
            } else {
                this.articles = options.initialLoad ? result.articles.slice(0, 8) : result.articles;
                this.currentPage = 1;
            }
            this.totalResults = result.totalResults;
            this.hasMoreNews = this.articles.length < this.totalResults;
            eventEmitter.emit('news:loaded', {
                articles: this.articles,
                totalResults: this.totalResults,
                hasMoreNews: this.hasMoreNews,
                append: options.append
            });
            return this.articles;
        } catch (error) {
            this.error = error;
            eventEmitter.emit('news:error', { error, append: options.append });
            return [];
        } finally {
            this.isLoading = false;
            eventEmitter.emit('news:loadingFinished');
        }
    }
    
    loadMoreNews() {
        if (this.isLoading || !this.hasMoreNews) return;
        this.currentPage++;
        return this.loadNews({ page: this.currentPage, append: true });
    }

    async loadFeaturedNews() {
        if (this.isLoading) return;
        try {
            this.isLoading = true;
            this.error = null;
            eventEmitter.emit('featuredNews:loading');
            const params = {
                country: Config.defaultParams.country,
                pageSize: 8,
                page: 1
            };
            const result = await this.newsService.getTopHeadlines(params);
            if (result && result.articles && result.articles.length > 0) {
                this.featuredArticles = {
                    mainStory: result.articles[0] || null,
                    sideStories: result.articles.slice(1, 5) || []
                };
                eventEmitter.emit('featuredNews:loaded', this.featuredArticles);
            } else {
                throw new Error('No featured articles found');
            }
            return this.featuredArticles;
        } catch (error) {
            this.error = error;
            eventEmitter.emit('featuredNews:error', { error });
            return { mainStory: null, sideStories: [] };
        } finally {
            this.isLoading = false;
        }
    }
}
export default NewsModel;
