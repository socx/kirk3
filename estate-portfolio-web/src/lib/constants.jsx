export const API_ROUTES = {
  REGISTER: `/users/register`,
  LOGIN: `/users/authenticate`,
  LOGOUT: `/users/logout`,
  COMPLETE_SIGN_UP: `/users/:email/activate-user`,
};

export const getBaseUrl = () => {
  switch(process.env.NODE_ENV) {
    case 'production':
      return 'https://aureus-2li7.onrender.com';
    case 'development':
    default:
      return 'http://localhost:4040';
  }
}
