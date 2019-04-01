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
  categories: 'categories'
};

function ecwid(storeId, accessToken) {
  if (!storeId) throw new Error('StoreID is required');
  if (!accessToken) throw new Error('Access token is required');
  STORE_ID = storeId;
  ACCESS_TOKEN = accessToken;

  return {
    getStoreProfile: getStoreProfile,

    searchProducts: searchProducts,
    getProducts: getProducts,
    getProduct: getProduct,
    addProduct: addProduct,
    deleteProduct: deleteProduct,
    updateProduct: updateProduct,
    uploadProductImage: uploadProductImage,
    deleteProductImage: deleteProductImage,

    addCategory: addCategory,
    deleteCategory: deleteCategory,
    updateCategory: updateCategory,

    searchOrders: searchOrders,
    getOrderDetails: getOrderDetails,
    updateOrder: updateOrder,
    deleteOrder: deleteOrder,

    searchCustomers: searchCustomers,
    getCustomer: getCustomer,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer
  };
}

function getStoreProfile() {
  return exec(PATH.profile, METHOD.GET);
}

function searchProducts(options) {
  return exec(PATH.products, METHOD.GET, options);
}

function getProducts() {
  return exec(PATH.products, METHOD.GET);
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

function deleteProductImage(productId) {
  return exec(PATH.products + '/' + productId + '/image', METHOD.DELETE);
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

function buildURL(path) {
  return (
    BASE_URL +
    STORE_ID +
    '/' +
    path +
    '?' +
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
