class Auth {
  static authenticateUser(token) {
    console.log('setting token: ', token, ' on local storage!');
    localStorage.setItem('token', token);
  }

  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  static deauthenticateUser() {
    console.log('Removing token from local storage!');
    localStorage.removeItem('token');
  }

  static getToken() {
    return localStorage.getItem('token');
  }
}

export default Auth;
