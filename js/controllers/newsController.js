import eventEmitter from '../utils/eventEmitter.js';
import NewsModel from '../models/newsModel.js';
import NewsView from '../views/newsView.js';

class NewsController {
    constructor() {
        this.model = new NewsModel();
        this.view = new NewsView();
        this._initEventListeners();
        this.initializeNews();
    }
    async initializeNews() {
        eventEmitter.emit('featuredNews:loading');
        eventEmitter.emit('news:loading', { append: false });
        
        // Загружаем оба блока независимо друг от друга, другого решения не нашел, все остальное поведение меня не устроило как юзерфрендли
        try {
            await this.loadFeaturedNews();
        } catch (error) {
            console.error('Error loading featured news:', error);
        }
        
        try {
            await this.loadNews({ initialLoad: true });
        } catch (error) {
            console.error('Error loading latest news:', error);
        }
    }

    _initEventListeners() {
        eventEmitter.on('loadMore:clicked', () => {
            this.loadMoreNews();
        });
    }

    async loadNews(options = {}) {
        try {
            await this.model.loadNews(options);
        } catch (error) {
            console.error('Error', error);
        }
    }

    async loadMoreNews() {
        try {
            await this.model.loadMoreNews();
        } catch (error) {
            console.error('Error', error);
        }
    }

    async loadFeaturedNews() {
        try {
            await this.model.loadFeaturedNews();
        } catch (error) {
            console.error('Error', error);
        }
    }
}
export default NewsController;
