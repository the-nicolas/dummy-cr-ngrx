//import storage from 'store2';
import Cookies from 'js-cookie';


export class TokenStorageMixin {
    
    static getStoredToken:any;
    
    token: any;
    
    removeToken() {

        this.token = null;
        //storage.set('token', this.token);
        Cookies.set('token', this.token);
        return Promise.resolve(this.token);

    }

    storeToken(token) {

        this.token = token ? token : null;
        //storage.set('token', this.token);
        Cookies.set('token', this.token);
        //console.log('storeToken', storage.get('token'));
        return Promise.resolve(this.token);

    }

    getStoredToken() {

        //console.log('getStoredToken', storage.get('token'));
        let storedToken = this.token;
        if (!storedToken) {
            try {
                //storedToken = storage.get('token');
                storedToken = Cookies.getJSON('token');
                //console.log('TokenStorageMixin', 'getStoredToken', Cookies.getJSON('token'));
            } catch (e) {

            }
        }
        return Promise.resolve(storedToken);

    }

}

TokenStorageMixin.getStoredToken = () => {
    //console.log('TokenStorageMixin', 'getStoredToken', Cookies(), Cookies.getJSON('token'));
    //return storage.get('token');
    return Cookies.getJSON('token');
};
