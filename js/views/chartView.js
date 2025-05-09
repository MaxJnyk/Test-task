import eventEmitter from '../utils/eventEmitter.js';
class ChartView {
    constructor() {
        this.chartContainer = document.querySelector('.chart-container');
        this.chartCanvas = document.getElementById('dataChart');
        this.chartTooltip = document.getElementById('chartTooltip');
        this.chartValue1 = document.querySelector('.chart-value-1');
        this.chartValue2 = document.querySelector('.chart-value-2');
        this.monthButtons = document.querySelectorAll('.month-button');
        this.prevButton = document.querySelector('.prev-button');
        this.nextButton = document.querySelector('.next-button');
        this.chart = null;
        this._initEventListeners();
    }
    _initEventListeners() {
        this.monthButtons.forEach(button => {
            button.addEventListener('click', () => {
                const month = parseInt(button.dataset.month);
                const year = parseInt(button.dataset.year);
                eventEmitter.emit('month:selected', { month, year });
                this._updateActiveMonth(button);
            });
        });
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                eventEmitter.emit('navigation:prev');
            });
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                eventEmitter.emit('navigation:next');
            });
        }
    }
    _updateActiveMonth(activeButton) {
        this.monthButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
        
        this._scrollToActiveMonth(activeButton);
    }
    
    _scrollToActiveMonth(activeButton) {
        const monthSelector = document.querySelector('.month-selector');
        if (!monthSelector) return;
        
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = monthSelector.getBoundingClientRect();
        
        const scrollLeft = activeButton.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
        
        monthSelector.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    updateActiveMonthByValue(month, year) {
        this.monthButtons = document.querySelectorAll('.month-button');
        let activeButton = null;
        
        this.monthButtons.forEach(button => {
            const buttonMonth = parseInt(button.dataset.month);
            const buttonYear = parseInt(button.dataset.year);
            if (buttonMonth === month && buttonYear === year) {
                activeButton = button;
            }
        });
        
        if (activeButton) {
            this._updateActiveMonth(activeButton);
        }
    }
    
    createMonthButton(month, year) {
        const monthSelector = document.querySelector('.month-selector');
        if (!monthSelector) return;
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[month - 1];
        const yearShort = String(year).slice(-2);
        
        const button = document.createElement('button');
        button.className = 'month-button';
        button.dataset.month = month;
        button.dataset.year = year;
        button.textContent = `${monthName}, ${yearShort}`;
        
        const lastButton = monthSelector.lastElementChild;
        const firstButton = monthSelector.firstElementChild;
        
        if (lastButton) {
            const lastMonth = parseInt(lastButton.dataset.month);
            const lastYear = parseInt(lastButton.dataset.year);
            
            if (year > lastYear || (year === lastYear && month > lastMonth)) {
                monthSelector.appendChild(button);
            } else {
                monthSelector.insertBefore(button, firstButton);
            }
        } else {
            monthSelector.appendChild(button);
        }
        
        button.addEventListener('click', () => {
            const month = parseInt(button.dataset.month);
            const year = parseInt(button.dataset.year);
            eventEmitter.emit('month:selected', { month, year });
            this._updateActiveMonth(button);
        });
        
        this.monthButtons = document.querySelectorAll('.month-button');
        
        return button;
    }
    renderChart(chartData) {
        if (!this.chartCanvas) return;
        if (this.chart) {
            this.chart.destroy();
        }
        const ctx = this.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                elements: {
                    line: {
                        tension: 0, 
                        borderWidth: 3 
                    },
                    point: {
                        radius: 4,
                        hoverRadius: 6 
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: false,
                        external: this._externalTooltipHandler.bind(this)
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' GB';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        this._addAccessibleDescription(chartData);
    }
    _externalTooltipHandler(context) {
        const {chart, tooltip} = context;
        const tooltipEl = this.chartTooltip;
        if (tooltip.opacity === 0) {
            tooltipEl.style.display = 'none';
            return;
        }
        if (tooltip.body) {
            const dataPoints = tooltip.dataPoints;
            if (dataPoints.length > 0) {
                const date = dataPoints[0].label;
                const value1 = dataPoints[0].raw + ' GB';
                const value2 = dataPoints.length > 1 ? dataPoints[1].raw + ' GB' : 'N/A';
                const dateDiv = tooltipEl.querySelector('.tooltip-date');
                const value1Div = tooltipEl.querySelector('.tooltip-value-1');
                const value2Div = tooltipEl.querySelector('.tooltip-value-2');
                if (dateDiv) dateDiv.textContent = date;
                if (value1Div) value1Div.textContent = value1;
                if (value2Div) value2Div.textContent = value2;
            }
        }
        tooltipEl.style.display = 'block';
        tooltipEl.style.left = tooltip.caretX + 'px';
        tooltipEl.style.top = tooltip.caretY + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    }
    updateSummary(summary) {
        if (this.chartValue1) {
            this.chartValue1.textContent = `${summary.chart1} GB`;
        }
        if (this.chartValue2) {
            this.chartValue2.textContent = `${summary.chart2} GB`;
        }
    }
    showLoading() {
        if (!this.chartContainer) return;
        this.chartContainer.classList.add('loading');
    }
    hideLoading() {
        if (!this.chartContainer) return;
        this.chartContainer.classList.remove('loading');
    }
    _addAccessibleDescription(chartData) {
        if (!chartData || !chartData.datasets || !this.chartCanvas) return;
        const dataset1 = chartData.datasets[0];
        const dataset2 = chartData.datasets[1];
        const maxValue1 = Math.max(...dataset1.data);
        const minValue1 = Math.min(...dataset1.data);
        const avgValue1 = Math.round(dataset1.data.reduce((a, b) => a + b, 0) / dataset1.data.length);
        const maxValue2 = Math.max(...dataset2.data);
        const minValue2 = Math.min(...dataset2.data);
        const avgValue2 = Math.round(dataset2.data.reduce((a, b) => a + b, 0) / dataset2.data.length);
        const description = `Chart showing data usage trends. 
            Download traffic (red line) ranges from ${minValue1} GB to ${maxValue1} GB with an average of ${avgValue1} GB. 
            Upload traffic (blue line) ranges from ${minValue2} GB to ${maxValue2} GB with an average of ${avgValue2} GB.`;
        this.chartCanvas.setAttribute('aria-label', description);
    }
}
export default ChartView;
