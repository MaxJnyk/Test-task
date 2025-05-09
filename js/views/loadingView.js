class LoadingView {
    constructor() {
        this.loadMoreButton = document.getElementById('load-more');
    }
    
    showLoading() {
        if (this.loadMoreButton) {
            this.loadMoreButton.classList.add('loading');
            this.loadMoreButton.textContent = 'Loading...';
            this.loadMoreButton.disabled = true;
        }
        
        return this;
    }
    
    hideLoading() {
        if (this.loadMoreButton) {
            this.loadMoreButton.classList.remove('loading');
            this.loadMoreButton.textContent = 'Read more';
            this.loadMoreButton.disabled = false;
        }
        
        return this;
    }
    
    createSkeletonItem() {
        const skeletonItem = document.createElement('article');
        skeletonItem.className = 'news-item skeleton';
        
        skeletonItem.innerHTML = `
            <div class="news-image skeleton"></div>
            <div class="news-content">
                <h2 class="skeleton"></h2>
                <p class="news-excerpt skeleton"></p>
                <div class="news-meta">
                    <span class="news-date skeleton"></span>
                    <span class="news-category skeleton"></span>
                </div>
            </div>
        `;
        
        return skeletonItem;
    }
}

export default LoadingView;
