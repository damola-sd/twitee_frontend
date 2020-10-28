import axios from "axios";


const API_URL = "https://twitee-backend.herokuapp.com/";

class AuthService {
    register(email, password) {
        return axios.post(API_URL + 'api/user/register', {
            email,
            password    
        })
        .then(response => {
            console.log(response);
            if (response.data.token) {
                localStorage.setItem('token', JSON.stringify(response.data.token));
            }

            return response;
        });
    }

    login(email, password) {
        return axios.post(API_URL + 'api/user/login', {
            email,
            password    
        })
        .then(response => {
            if (response.data.data.token) {
                localStorage.setItem('token', JSON.stringify(response.data.data.token));
            }

            return response.data;
        });
    }

    logout() {
        localStorage.removeItem('token');
    }

    getToken() {
        return JSON.parse(localStorage.getItem('token'));
    }
}

export default new AuthService();