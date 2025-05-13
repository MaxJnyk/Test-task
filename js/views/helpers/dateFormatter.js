export function formatTimeAgo(date) {
    // Проверяем, что date является валидной датой
    if (isNaN(date.getTime())) {
        return ''; // Возвращаем пустую строку, если дата невалидна
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    } else {
        return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
    }
}
