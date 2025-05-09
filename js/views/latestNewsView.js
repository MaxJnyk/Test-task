import { formatTimeAgo } from './helpers/dateFormatter.js';
import LoadingView from './loadingView.js';
class LatestNewsView {
    constructor() {
        this.newsGrid = document.querySelector('.news-grid');
        this.loadMoreButton = document.getElementById('load-more');
        this.loadingView = new LoadingView();
    }

    renderNews(articles, append = false) {
        if (!this.newsGrid) return;

        if (!append) {
            this.newsGrid.innerHTML = '';
        }

        if (!articles || articles.length === 0) return;
        articles.forEach((article) => {
            if (!article.title || !article.url) return;
            const newsItem = this._createNewsItem(article);
            this.newsGrid.appendChild(newsItem);
        });
    }

    _createNewsItem(article) {
        const timeAgo = formatTimeAgo(new Date(article.publishedAt));
        const newsItem = document.createElement('article');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <a href="${article.url}" class="news-link" target="_blank">
                <div class="news-image">
                    <img src="${article.urlToImage || ''}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <h2>${article.title}</h2>
                    <p class="news-excerpt">${article.description || ''}</p>
                    <div class="news-meta">
                        <div class="news-date">${timeAgo}</div>
                        <div class="news-separator">|</div>
                        <div class="news-source">${article.source.name}</div>
                    </div>
                </div>
            </a>
        `;
        return newsItem;
    }

    updateLoadMoreButton(hasMoreNews) {
        if (!this.loadMoreButton) return;
        if (hasMoreNews) {
            this.loadMoreButton.style.display = 'inline-flex';
        } else {
            this.loadMoreButton.style.display = 'none';
        }
    }
    showLoading(append) {
        this.loadingView.showLoading(append);
        if (!append && this.newsGrid) {
            this.newsGrid.innerHTML = '';
            // Добавил скелетоны независимо от загрузки
            for (let i = 0; i < 8; i++) {
                const skeletonItem = this.loadingView.createSkeletonItem();
                this.newsGrid.appendChild(skeletonItem);
            }
        }
    }
    showError() {
        this.showLoading(false);
    }
}
export default LatestNewsView;
