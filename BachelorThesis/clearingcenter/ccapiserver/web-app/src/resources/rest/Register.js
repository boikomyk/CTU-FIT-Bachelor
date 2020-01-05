import rest from 'resources/Rest';

const RegisterApi = {
  register,
  confirmEmail
};

function register(username, email, password) {
  return rest({
    url: '/api/register',
    method: 'post',
    data: {
      username,
      email,
      password
    }
  });
}

function confirmEmail(username, token) {
  return rest({
    url: '/api/tokens/verify',
    method: 'patch',
    params: {
      username: username,
      token: token
    }
  });
}
export default RegisterApi;
