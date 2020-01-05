class Profile extends Object {
  constructor(username = '', email = '', lastLogin = '') {
    super();
    this._username = username;
    this._email = email;
    this._lastLogin = new Date(lastLogin);
  }

  get username() {
    return this._username;
  }

  set username(value) {
    this._username = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  get lastLogin() {
    return this._lastLogin;
  }

  set lastLogin(value) {
    this._lastLogin = value;
  }

  static fromJSON(json) {
    const profile = Object.create(Profile.prototype);
    return Object.assign(profile, json);
  }
}
export default Profile;
