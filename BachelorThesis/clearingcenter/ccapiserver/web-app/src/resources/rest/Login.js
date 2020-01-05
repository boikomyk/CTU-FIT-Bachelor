import rest from 'resources/Rest';

export default function login(email, password) {
  return rest({
    url: '/api/authorization',
    method: 'post',
    data: {
      password,
      email
    }
  });
}
