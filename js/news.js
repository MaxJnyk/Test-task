import NewsController from './controllers/newsController.js';
class News {
    constructor() {
        this.controllers = {};
    }
    init() {
        this._initControllers();
    }
    _initControllers() {
        if (document.querySelector('.news-grid')) {
            this.controllers.news = new NewsController();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const app = new News();
    app.init();
});
export default News;
