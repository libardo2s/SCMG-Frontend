export class URLS {
    /*
    static debug = 'http://ganadoya.com';
    static imagePost = 'http://ganadoya.com/api/propietario/marca/';
    static imagePostCompare = 'http://ganadoya.com/api/compare/';
    */
    static imagePost = 'http://127.0.0.1:8000/api/propietario/marca/';
    static imagePostCompare = 'http://127.0.0.1:8000/api/compare/';
    static debug = 'http://127.0.0.1:8000';

    static setToken(token: string) {
        sessionStorage.setItem('token', token);
    }

    static getToken() {
        return sessionStorage.getItem('token');
    }
}