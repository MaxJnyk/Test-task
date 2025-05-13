const Config = {
    api: {
        guardianApi: {
            key: 'test', // Тестовый ключ The Guardian
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
