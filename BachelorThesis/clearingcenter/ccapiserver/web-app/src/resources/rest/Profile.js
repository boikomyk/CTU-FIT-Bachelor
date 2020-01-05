import rest from 'resources/Rest';
import { getAccessTokenHeader } from 'helpers/ls/LocalStorage';

export default function getProfile() {
  return rest({
    url: '/api/user',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}
