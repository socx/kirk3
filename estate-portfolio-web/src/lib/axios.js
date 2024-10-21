import axios from 'axios';

export const getBaseUrl = () => {
  let url;
  switch(process.env.NODE_ENV) {
    case 'production':
      url = 'https://estate-portfolio-api.onrender.com';
      break;
    case 'development':
    default:
      url = 'http://localhost:4040';
  }
  return url;
}

export default axios.create({
  baseURL: getBaseUrl()
});

export const  axiosPrivate = (accessToken) => {
  return axios.create({
    baseURL: getBaseUrl(),
    headers: {'Authorization': `Bearer ${accessToken}`}
  });
}
