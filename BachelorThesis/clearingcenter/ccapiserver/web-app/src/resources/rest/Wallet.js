import rest from 'resources/Rest';
import { getAccessTokenHeader } from 'helpers/ls/LocalStorage';

function getWallet() {
  return rest({
    url: '/api/wallet',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}

function updateAmount(amount) {
  return rest({
    url: '/api/wallet',
    method: 'post',
    headers: getAccessTokenHeader(),
    data: {
      amount
    }
  });
}

export const wallet = {
  getWallet,
  updateAmount
};
