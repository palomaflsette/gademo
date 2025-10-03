if (window.location.hostname.includes('onrender.com')) {
    window.API_ENDPOINT = 'https://gademo-api.onrender.com';
} else if (
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost'
) {
    window.API_ENDPOINT = 'http://127.0.0.1:8000';
} else if (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('palomasette.com')
) {
    window.API_ENDPOINT = 'https://gademo-api-80847e4a6e18.herokuapp.com';
} else {
    window.API_ENDPOINT = 'https://servicosmaxwell.vrac.puc-rio.br';
}
