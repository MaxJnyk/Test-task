import eventEmitter from '../utils/eventEmitter.js';
import FeaturedNewsView from './featuredNewsView.js';
import LatestNewsView from './latestNewsView.js';
import LoadingView from './loadingView.js';

class NewsView {
    constructor() {
        this.featuredNewsView = new FeaturedNewsView();
        this.latestNewsView = new LatestNewsView();
        this.loadingView = new LoadingView();
        this.loadMoreButton = document.getElementById('load-more');
        this._initEventListeners();
        this._subscribeToEvents();
    }
    
    _initEventListeners() {
        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => {
                eventEmitter.emit('loadMore:clicked');
            });
        }
    }
    
    _subscribeToEvents() {
        eventEmitter.on('news:loading', (data) => {
            this.latestNewsView.showLoading(data.append);
        });
        
        eventEmitter.on('news:loaded', (data) => {
            this.latestNewsView.renderNews(data.articles, data.append);
            this.latestNewsView.updateLoadMoreButton(data.hasMoreNews);
        });
        
        eventEmitter.on('news:error', (data) => {
            if (!data.append) {
                this.latestNewsView.showError();
            }
        });
        
        eventEmitter.on('featuredNews:loading', () => {
            this.featuredNewsView.showLoading();
        });
        
        eventEmitter.on('featuredNews:loaded', (featuredArticles) => {
            this.featuredNewsView.renderFeaturedNews(featuredArticles);
        });
        
        eventEmitter.on('featuredNews:error', (data) => {
            this.featuredNewsView.showError();
        });
        
        eventEmitter.on('news:loadingFinished', () => {
            this.loadingView.hideLoading();
        });
    }
}

export default NewsView;
