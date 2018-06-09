export class URLS {
    
    static debug = 'https://yhymar.webfactional.com/';
    static imagePost = 'https://yhymar.webfactional.com/api/propietario/marca/';
    static imagePostCompare = 'https://yhymar.webfactional.com/api/compare/';
    
    /*
    static imagePost = 'http://127.0.0.1:8000/api/propietario/marca/';
    static imagePostCompare = 'http://127.0.0.1:8000/api/compare/';
    static debug = 'http://127.0.0.1:8000';
    */
   
    static setToken(token: string) {
        sessionStorage.setItem('token', token);
    }

    static getToken() {
        return sessionStorage.getItem('token');
    }

    static setIdRegistration(id: string){
        sessionStorage.setItem('registration_id', id);
    }

    static getIdRegistration() {
        return sessionStorage.getItem('registration_id');
    }
}