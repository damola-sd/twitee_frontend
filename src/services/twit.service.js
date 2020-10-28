import axios from 'axios';
// import authHeader from './auth-header';
import AuthService from "./auth.service";


const API_URL = "https://twitee-backend.herokuapp.com/";
const token = AuthService.getToken();


class TwitService {
    
    getallTwits() {
        return axios.get(API_URL + 'api/twit')
    }
    createNewTwit(twit) {
        return axios.post(API_URL + 'api/twit/new', { twit }, { headers: { token }});
    }
    deleteTwit(twitId) {
        return axios.delete(API_URL + 'api/twit/' + twitId, { headers: { token } });
    }
    addComment(comment, twitId) {
        return axios.post(`${API_URL}api/twit/${twitId}/comment`, { comment }, { headers: { token }});
    }
}

export default new TwitService();