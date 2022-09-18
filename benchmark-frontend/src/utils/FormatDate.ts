export default function formatDate(dateString: string, today?: any) {
    const d = new Date(dateString);
    const y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const m = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const t = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(d);
    let formatted = '';

    if (today) {

        if(typeof today === "string") {
            const todayFormatted:any = formatDate(today);
            if (todayFormatted && todayFormatted.day === day && todayFormatted.m === m && todayFormatted.y === y) {
                formatted = `Today, ${t}`;
            } else {
                formatted = `${m} ${day}`;
            }
        } else {
            formatted = `${m} ${day}`;
        }
    }
    return today ? formatted : { day, m, y }
}