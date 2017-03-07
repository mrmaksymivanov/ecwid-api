'use strict';

var request = require('request-promise');
var qs = require('qs');

var STORE_ID;
var ACCESS_TOKEN;
var API_VERSION = 'v3';
var BASE_URL = 'https://app.ecwid.com/api/' + API_VERSION + '/';
var PATH = {
  profile: 'profile',
  products: 'products'
};

function ecwid(storeId, accessToken) {
  if(!storeId) throw new Error('StoreID is required');
  if(!accessToken) throw new Error('Access token is required');
  STORE_ID = storeId;
  ACCESS_TOKEN = accessToken;

  return {
    getStoreProfile: getStoreProfile,
    getProducts: getProducts,
    addProduct: addProduct,
    deleteProduct: deleteProduct,
    updateProduct: updateProudct,
    uploadProductImage: uploadProductImage,
    deleteProductImage: deleteProductImage
  }
}

function getStoreProfile() {
  return exec(PATH.profile, 'get')
}

function getProducts() {
  return exec(PATH.products, 'get')
}

function addProduct(product) {
  return exec(PATH.products, 'post', product)
}

function deleteProduct(productId) {
  return exec(PATH.products + '/' + productId, 'delete')
}

function updateProudct(productId, product) {
  return exec(PATH.products + '/' + productId, 'put', product)
}

function uploadProductImage(productId, buffer) {
  return request.post({
    uri: buildURL(PATH.products + '/' + productId + '/image'),
    headers: {'content-type' : 'image/jpeg'},
    body: buffer
  })
}

function deleteProductImage(productId) {
  return exec(PATH.products + '/' + productId + '/image', 'delete')
}

function buildURL(path) {
  return BASE_URL + STORE_ID + '/' + path + '?' + qs.stringify({token: ACCESS_TOKEN});
}

function exec(path, method, data) {
  var options = { uri: buildURL(path) };

  if(data) options.body = JSON.stringify(data);

  return request[method](options).then(function(data) {
    return JSON.parse(data)
  })
}

module.exports = ecwid;