import ChartModel from '../models/chartModel.js';
import ChartView from '../views/chartView.js';
import eventEmitter from '../utils/eventEmitter.js';
class ChartController {
    constructor() {
        this.model = new ChartModel();
        this.view = new ChartView();
        this._initEventListeners();
        this.initializeChart();
    }
    _initEventListeners() {
        eventEmitter.on('month:selected', (data) => {
            this.loadChartData(data.month, data.year);
        });
        eventEmitter.on('navigation:prev', () => {
            this._navigateMonth(-1);
        });
        eventEmitter.on('navigation:next', () => {
            this._navigateMonth(1);
        });
        eventEmitter.on('chart:loaded', (data) => {
            this.view.renderChart(data.chartData);
            this.view.updateSummary(data.summary);
        });
        eventEmitter.on('chart:loading', () => {
            this.view.showLoading();
        });
        eventEmitter.on('chart:loadingFinished', () => {
            this.view.hideLoading();
        });
        eventEmitter.on('chart:error', (data) => {
            console.error('Error loading:', data.error);
            this.view.hideLoading();
        });
    }
    async initializeChart() {
        try {
            await this.loadChartData(this.model.currentMonth, this.model.currentYear);
        } catch (error) {
            console.error('Error init:', error);
        }
    }
    async loadChartData(month, year) {
        try {
            await this.model.loadChartData(month, year);
            this.view.updateActiveMonthByValue(month, year);
        } catch (error) {
            console.error('Error loading:', error);
        }
    }
    _navigateMonth(direction) {
        let newMonth = this.model.currentMonth + direction;
        let newYear = this.model.currentYear;
        if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        }
        
        const existingButton = this._findMonthButton(newMonth, newYear);
        
        if (!existingButton) {
            this.view.createMonthButton(newMonth, newYear);
        }
        
        this.loadChartData(newMonth, newYear);
    }
    
    _findMonthButton(month, year) {
        const buttons = document.querySelectorAll('.month-button');
        for (const button of buttons) {
            const buttonMonth = parseInt(button.dataset.month);
            const buttonYear = parseInt(button.dataset.year);
            if (buttonMonth === month && buttonYear === year) {
                return button;
            }
        }
        return null;
    }
}
export default ChartController;
