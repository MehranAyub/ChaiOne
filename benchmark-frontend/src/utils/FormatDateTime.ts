export default function formatDateTime(dateString: string) {
    const d = new Date(dateString);
    const yy = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
    const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const t = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(d);
    let formatted = `${mm}/${dd}/${yy}, ${t}`;


    return formatted
}