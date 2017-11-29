class Auth {
  static authenticateUser(token) {
    console.log('setting token: ', token, ' on local storage!');
    localStorage.setItem('token', token);
  }

  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  static deauthenticateUser() {
    localStorage.removeItem('token');
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static isValidToken() {
    return !!(Auth.getToken() !== 'undefined');
  }
}

export default new Auth();
