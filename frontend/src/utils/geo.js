export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject(new Error('Geolocation is not supported by your browser.'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude}),
            (err) => {
                const message = {
                    1: 'Location permission denied.',
                    2: 'Your location cannot be determined.',
                    3: 'Location time out.',
                };
                reject(new Error(message[err.code] || 'Unable to get your location.'));
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000},
        );
    });
}
export function distanceInKm(a, b){
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}