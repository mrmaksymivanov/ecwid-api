### NodeJS wrapper for [ecwid.com](https://www.ecwid.com/) API

Module fully relies on [ecwid.com REST API](https://developers.ecwid.com/api-documentation) v3

**Simple usage**


YOUR_STORE_ID and YOUR_PRIVATE_OR_PUBLIC_ACCESS_TOKEN values are reuired to work with 
[ecwid.com REST API](https://developers.ecwid.com/api-documentation)

```javascript
const ecwid = require('ecwid-api')(YOUR_STORE_ID, YOUR_PRIVATE_OR_PUBLIC_ACCESS_TOKEN);
```

Every method returns a Promise with result of the request

**Get store profile**
```javascript
ecwid.getStoreProfile()
  .then(data => console.log('Store profile data: ', data))
  .catch(err => console.log('Error: ', err));
```

**Add product**
```javascript
const productData = {
    name: 'New product',
    price: 100,
    enabled: true,
    ...
}
ecwid.addProduct(productData)
  .then(result => console.log('Product id: ', result.id))
  .catch(err => console.log('Error: ', err));
```

**Upload product image**

Product image upload function accepts a Buffer 
```javascript
const imagePath = 'path/to/my/product/image.jpg'
fs.readFile(imagePath, (err, file) => {
  if(!err) {
   ecwid.uploadProductImage(productId, file)
       .then(result => ...)
       .catch(err => ...) 
  }
})
```

**The whole list of available methods**

* getStoreProfile
* searchProducts(options)
* getProducts
* getProduct(productId)
* addProduct(product)
* deleteProduct(productId)
* updateProduct(productId, product)
* uploadProductImage(productId, buffer)
* deleteProductImage(productId)
* getCategories(options)
* addCategory(category)
* deleteCategory(categoryId)
* updateCategory(categoryId, data)
* searchOrders(options)
* getOrderDetails(orderNumber)
* updateOrder(orderNumber, data)
* deleteOrder(orderNumber)
* searchCustomers(options)
* getCustomer(customerId)
* createCustomer(data)
* updateCustomer(customerId, data)
* deleteCustomer(customerId)
* getAllStorage()
* getStorage(key)
* addStorage(key, data)
* editStorage(key, data)
* deleteStorage(key)

**Testing**

For running tests copy config.js.example to config.js (gitignored) and fill it with your store id and secret key.

Then run `npm test`