'use strict';

var request = require('request-promise');
var qs = require('qs');

var STORE_ID;
var ACCESS_TOKEN;
var API_VERSION = 'v3';
var BASE_URL = 'https://app.ecwid.com/api/' + API_VERSION + '/';
var METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};
var PATH = {
  profile: 'profile',
  products: 'products',
  orders: 'orders',
  customers: 'customers',
  categories: 'categories',
  classes: 'classes',
  storage: 'storage',
  orders: 'orders'
};

function ecwid(storeId, accessToken) {
  if (!storeId) throw new Error('StoreID is required');
  if (!accessToken) throw new Error('Access token is required');
  STORE_ID = storeId;
  ACCESS_TOKEN = accessToken;

  return {
    getClasses,
    getStoreProfile,

    getOrderDetails,

    searchProducts,
    getProducts,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    uploadProductImage,
    uploadProductImageExternal,
    deleteProductImage,
    uploadGalleryImage,
    uploadGalleryImageExternal,
    cleanGallery,

    getCategories,
    addCategory,
    deleteCategory,
    updateCategory,

    searchOrders,
    getOrderDetails,
    updateOrder,
    deleteOrder,

    searchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,

    getAllStorage,
    getStorage,
    addStorage,
    editStorage,
    deleteStorage
  };
}

function getClasses() {
  return exec(PATH.classes, METHOD.GET);
}

function getStoreProfile() {
  return exec(PATH.profile, METHOD.GET);
}

function getOrderDetails(orderId) {
  return exec(PATH.orders + '/' + orderId, METHOD.GET);
}

function searchProducts(options) {
  return exec(PATH.products, METHOD.GET, options);
}

function getProducts(options) {
  return exec(PATH.products, METHOD.GET, options);
}

function getProduct(productId) {
  return exec(PATH.products + '/' + productId, METHOD.GET);
}

function addProduct(product) {
  return exec(PATH.products, METHOD.POST, product);
}

function deleteProduct(productId) {
  return exec(PATH.products + '/' + productId, METHOD.DELETE);
}

function updateProduct(productId, product) {
  return exec(PATH.products + '/' + productId, METHOD.PUT, product);
}

function uploadProductImage(productId, buffer) {
  return request.post({
    uri: buildURL(PATH.products + '/' + productId + '/image'),
    headers: { 'content-type': 'image/jpeg' },
    body: buffer
  });
}

function uploadProductImageExternal(productId, externalUrl) {
  return exec(PATH.products + '/' + productId + '/image?externalUrl=' +
          encodeURIComponent(externalUrl), METHOD.POST);
}

function deleteProductImage(productId) {
  return exec(PATH.products + '/' + productId + '/image', METHOD.DELETE);
}

function uploadGalleryImage(productId, buffer) {
  return request.post({
    uri: buildURL(PATH.products + '/' + productId + '/gallery'),
    headers: { 'content-type': 'image/jpeg' },
    body: buffer
  });
}

function uploadGalleryImageExternal(productId, externalUrl) {
  return exec(PATH.products + '/' + productId + '/gallery?externalUrl=' +
        encodeURIComponent(externalUrl), METHOD.POST);
}

function cleanGallery(productId) {
  return exec(PATH.products + '/' + productId + '/gallery', METHOD.DELETE);
}

function searchOrders(options) {
  return exec(PATH.orders, METHOD.GET, options);
}

function getOrderDetails(orderNumber) {
  return exec(PATH.orders + '/' + orderNumber, METHOD.GET);
}

function updateOrder(orderNumber, data) {
  return exec(PATH.orders + '/' + orderNumber, METHOD.PUT, data);
}

function deleteOrder(orderNumber) {
  return exec(PATH.orders + '/' + orderNumber, METHOD.DELETE);
}

function getCategories(options) {
  return exec(PATH.categories, METHOD.GET, options);
}

function addCategory(category) {
  return exec(PATH.categories, METHOD.POST, category);
}

function deleteCategory(categoryId) {
  return exec(PATH.categories + '/' + categoryId, METHOD.DELETE);
}

function updateCategory(categoryId, data) {
  return exec(PATH.categories + '/' + categoryId, METHOD.PUT, data);
}

function searchCustomers(options) {
  return exec(PATH.customers, METHOD.GET, options);
}

function getCustomer(customerId) {
  return exec(PATH.customers + '/' + customerId, METHOD.GET);
}

function createCustomer(data) {
  return exec(PATH.customers, METHOD.POST, data);
}

function updateCustomer(customerId, data) {
  return exec(PATH.customers + '/' + customerId, METHOD.PUT, data);
}

function deleteCustomer(customerId) {
  return exec(PATH.customers + '/' + customerId, METHOD.DELETE);
}

function getAllStorage() {
  return exec(PATH.storage, METHOD.GET);
}

function getStorage(key) {
  return exec(PATH.storage + '/' + key, METHOD.GET);
}

function addStorage(key, data) {
  return exec(PATH.storage + '/' + key, METHOD.POST, data);
}

function editStorage(key, data) {
  return exec(PATH.storage + '/' + key, METHOD.PUT, data);
}

function deleteStorage(key) {
  return exec(PATH.storage + '/' + key, METHOD.DELETE);
}

function buildURL(path) {
  return (
    BASE_URL +
    STORE_ID +
    '/' +
    path +
    (path.includes('?') ? '&' : '?') +
    qs.stringify({ token: ACCESS_TOKEN })
  );
}

function exec(path, method, data) {
  var options = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  };

  switch (method) {
    case METHOD.GET:
    case METHOD.DELETE:
      options.uri = buildURL(path);
      if (data) {
        options.uri += '&' + qs.stringify(data);
      }
      break;
    case METHOD.PUT:
    case METHOD.POST:
      options.uri = buildURL(path);
      if (data) {
        options.body = JSON.stringify(data);
      }
      break;
  }

  return request[method](options).then(function (data) {
    return JSON.parse(data);
  });
}

module.exports = ecwid;