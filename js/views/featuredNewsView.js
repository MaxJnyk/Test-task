import { formatTimeAgo } from './helpers/dateFormatter.js';
class FeaturedNewsView {
    constructor() {
        this.mainStoryContainer = document.getElementById('main-story');
        this.sideStoriesContainer = document.getElementById('side-stories');
    }
    renderFeaturedNews(featuredArticles) {
        if (!this.mainStoryContainer || !this.sideStoriesContainer) return;
        if (!featuredArticles) return;
        const { mainStory, sideStories } = featuredArticles;
        this._renderMainStory(mainStory);
        this._renderSideStories(sideStories);
    }
    _renderMainStory(mainStory) {
        if (!mainStory) return;
        const timeAgo = formatTimeAgo(new Date(mainStory.publishedAt));
        this.mainStoryContainer.innerHTML = `
            <a href="${mainStory.url}" class="main-story-link" target="_blank">
                <div class="main-story-image">
                    <img src="${mainStory.urlToImage || ''}" alt="${mainStory.title}">
                </div>
                <div class="main-story-content">
                    <h2>${mainStory.title}</h2>
                    <div class="main-story-meta">
                        <button class="explore-button">Explore <span class="arrow">→</span></button>
                    </div>
                </div>
            </a>
        `;
    }
    _renderSideStories(sideStories) {
        this.sideStoriesContainer.innerHTML = '';
        if (!sideStories || sideStories.length === 0) return;
        sideStories.forEach(article => {
            const timeAgo = formatTimeAgo(new Date(article.publishedAt));
            const sideStory = document.createElement('div');
            sideStory.className = 'side-story';
            sideStory.innerHTML = `
                <a href="${article.url}" class="side-story-link" target="_blank">
                    <h3>${article.title}</h3>
                    <p>${article.description || ''}</p>
                    <div class="side-story-meta">
                        <div class="news-date">${timeAgo}</div>
                        <div class="news-separator">|</div>
                        <div class="news-source">${article.source.name}</div>
                    </div>
                </a>
            `;
            this.sideStoriesContainer.appendChild(sideStory);
        });
    }
    showLoading() {
        if (!this.mainStoryContainer || !this.sideStoriesContainer) return;
        this.mainStoryContainer.innerHTML = `
            <div class="main-story-skeleton skeleton">
                <div class="main-story-image skeleton"></div>
                <div class="main-story-content skeleton">
                    <div class="main-story-title skeleton"></div>
                    <div class="main-story-meta skeleton"></div>
                </div>
            </div>
        `;
        this.sideStoriesContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const sideStorySkeleton = document.createElement('div');
            sideStorySkeleton.className = 'side-story skeleton';
            sideStorySkeleton.innerHTML = `
                <div class="side-story-title skeleton"></div>
                <div class="side-story-excerpt skeleton"></div>
                <div class="side-story-meta skeleton"></div>
            `;
            this.sideStoriesContainer.appendChild(sideStorySkeleton);
        }
    }
    showError() {
        this.showLoading();
    }
}
export default FeaturedNewsView;
