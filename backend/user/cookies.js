export function auth_token() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; auth_token=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
}