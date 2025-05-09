const Config = {
    api: {
        guardianApi: {
            key: 'test', // Замените на ваш реальный API ключ после регистрации
            baseUrl: 'https://content.guardianapis.com',
            endpoints: {
                search: '/search',
                singleItem: '/items'
            }
        }
    },
    
    defaultParams: {
        pageSize: 8,
        page: 1,
        orderBy: 'newest' 
    }
};

export default Config;
