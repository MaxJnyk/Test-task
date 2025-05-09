/**
 * Утилиты для работы с данными графиков
 */

/**
 * Рассчитывает суммарные значения для наборов данных графика
 * @param {Object} data - Данные графика
 * @returns {Object} Объект с суммарными значениями
 */
export function calculateChartSummary(data) {
    if (!data || !data.datasets || data.datasets.length < 2) {
        return { chart1: 0, chart2: 0 };
    }
    
    const chart1Data = data.datasets[0].data;
    const chart2Data = data.datasets[1].data;
    
    const chart1Value = chart1Data.reduce((sum, value) => sum + value, 0);
    const chart2Value = chart2Data.reduce((sum, value) => sum + value, 0);
    
    return {
        chart1: chart1Value,
        chart2: chart2Value
    };
}

/**
 * Возвращает сокращенное название месяца по его номеру
 * @param {number} month - Номер месяца (1-12)
 * @returns {string} Сокращенное название месяца
 */
export function getMonthName(month) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[(month - 1) % 12];
}
