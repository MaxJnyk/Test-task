import eventEmitter from '../utils/eventEmitter.js';
import { calculateChartSummary, getMonthName } from '../utils/chartUtils.js';

class ChartModel {
    constructor() {
        this.currentMonth = 9;
        this.currentYear = 2024;
        this.chartData = {};
        this.isLoading = false;
        this.error = null;
    }
    async loadChartData(month, year) {
        if (this.isLoading) return;
        try {
            this.isLoading = true;
            this.error = null;
            eventEmitter.emit('chart:loading');
            
            const data = await this._fetchDataFromAPI(month, year);
            
            this.chartData = data;
            this.currentMonth = month;
            this.currentYear = year;
            const summary = calculateChartSummary(data);
            eventEmitter.emit('chart:loaded', {
                chartData: data,
                summary: summary,
                currentMonth: this.currentMonth,
                currentYear: this.currentYear
            });
            return data;
        } catch (error) {
            console.error('Error loading chart data:', error);
            this.error = error;
            eventEmitter.emit('chart:error', { error });
            return null;
        } finally {
            this.isLoading = false;
            eventEmitter.emit('chart:loadingFinished');
        }
    }
    
    async _fetchDataFromAPI(month, year) {
        try {
            // Здесь должен быть реальный запрос к API
            // Например: const response = await fetch(`https://api.example.com/traffic и так далее);
            
            // Пока API не настроен, используем временно мок-данные
            return this._generateMockData(month, year);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    _generateMockData(month, year) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1} ${getMonthName(month)}`);
        const dataset1 = [];
        const dataset2 = [];
        
        dataset1.push(0);
        dataset2.push(0);
        
        let value1 = 0.2;
        let value2 = 0.1;
        
        for (let i = 1; i < daysInMonth; i++) {
            const change1 = (Math.random() - 0.5) * 0.3; 
            const change2 = (Math.random() - 0.5) * 0.25;
            
            value1 = Math.max(0.1, Math.min(1.0, value1 + change1));
            value2 = Math.max(0.05, Math.min(0.7, value2 + change2));
            
            dataset1.push(value1);
            dataset2.push(value2);
        }
        const dataset1GB = dataset1.map(val => Math.round(val * 1000));
        const dataset2GB = dataset2.map(val => Math.round(val * 500));
        return {
            labels: labels,
            datasets: [
                {
                    label: 'Download Traffic',
                    data: dataset1GB,
                    borderColor: '#e63946',
                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                    borderWidth: 3,
                    tension: 0,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: false
                },
                {
                    label: 'Upload Traffic',
                    data: dataset2GB,
                    borderColor: '#1d3557',
                    backgroundColor: 'rgba(29, 53, 87, 0.1)',
                    borderWidth: 3,
                    tension: 0,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: false
                }
            ]
        };
    }

}
export default ChartModel;
