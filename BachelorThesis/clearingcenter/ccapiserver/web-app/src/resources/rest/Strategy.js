import rest from 'resources/Rest';
import { getAccessTokenHeader } from 'helpers/ls/LocalStorage';

export const strategyApi = {
  getStrategies,
  followStrategy,
  getStrategy,
  getUserStrategies,
  getMarkets,
  getIndicators,
  createStrategy,
  editStrategy,
  getStrategySignals,
  getAllSignals,
  getCandles,
  getAllFollowingStrategies,
  subscribeStrategy
};

function getUserStrategies() {
  return rest({
    url: '/api/mystrategies',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}
function createStrategy(market, indicators, fee, name, about) {
  return rest({
    url: '/api/strategies',
    method: 'post',
    headers: getAccessTokenHeader(),
    data: {
      market,
      indicators,
      fee,
      name,
      about
    }
  });
}

function editStrategy(market, indicators, fee, name, about, id) {
  return rest({
    url: '/api/strategies/' + id,
    method: 'patch',
    headers: getAccessTokenHeader(),
    data: {
      market,
      indicators,
      fee,
      name,
      about
    }
  });
}

async function subscribeStrategy(id, subscribe) {
  return rest({
    url: '/api/strategies/' + id + '/subscribe',
    method: 'post',
    headers: getAccessTokenHeader(),
    data: {
      subscribe
    }
  });
}

async function followStrategy(id, follow) {
  return rest({
    url: '/api/strategies/' + id + '/follow',
    method: 'post',
    headers: getAccessTokenHeader(),
    data: {
      follow
    }
  });
}
async function getAllSignals() {
  return rest({
    url: '/api/signals/purchased',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}
async function getCandles(id) {
  return rest({
    url: '/api/strategies/' + id + '/graph',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}

async function getStrategySignals(id) {
  return rest({
    url: '/api/signals/strategy/' + id,
    method: 'get',
    headers: getAccessTokenHeader()
  });
}
async function getAllFollowingStrategies() {
  return rest({
    url: '/api/followingstrategies',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}

function getMarkets() {
  return rest({
    url: '/api/markets',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}
function getIndicators() {
  return rest({
    url: '/api/indicators',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}

function getStrategies() {
  return rest({
    url: '/api/strategies',
    method: 'get',
    headers: getAccessTokenHeader()
  });
}

async function getStrategy(id) {
  return rest({
    url: '/api/strategies/' + id,
    method: 'get',
    headers: getAccessTokenHeader()
  });
}
