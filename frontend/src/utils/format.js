const priceFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
});
export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);
export function truncate(text = '', maxLength = 140) {
    if (text.length <= maxLength) return text;
    const cut = text.slice(0, maxLength);
    return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : maxLength)}...`;
}
export function resolveImageUrl(url) {
    if (!url) return '';
    if (/^(https?:|data:|blob:)/.test(url)) return url;
    const base = import.meta.env.VITE_API_URL || '';
    return `${base}${url}`;
}
