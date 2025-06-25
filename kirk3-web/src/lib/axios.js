import axios from 'axios';

export const getBaseUrl = () => {
  return import.meta.env.VITE_REACT_APP_API_BASE_URL;
}

export default axios.create({
  baseURL: getBaseUrl()
});

export const  axiosPrivate = (accessToken, isFile=false) => {
  return isFile ?
    axios.create({
      baseURL: getBaseUrl(),
      headers: {'Authorization': `Bearer ${accessToken}`},
      responseType: 'arraybuffer'
    }):
    axios.create({
      baseURL: getBaseUrl(),
      headers: {'Authorization': `Bearer ${accessToken}`}
    });
}
