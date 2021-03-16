import axios from 'axios';

export const getPlaceList = (data) => {
    const googleAPIKey = 'OWN_GOOGLE_KEY'
    return axios.get(`https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=places`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err)
        });
};