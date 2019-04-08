var expect = require("chai").expect;
var { storeId, secret } = require("../config");
var ecwid = require("../ecwid")(storeId, secret);

// go tests
describe("Test getProducts offset and limit (in options)", function() {
    it(`should get all products in a cycle and stop`, async function () {
        let offset = 0, limit = 100;
        let products = null, productList = [];
        while(!products || products.count === limit) {
            products = await ecwid.getProducts({ offset, limit });
            expect(products).to.be.not.null;
            expect(products.items).to.be.not.null;
            productList.push(...products.items);
            offset += limit;
        }
        expect(productList.length).to.be.above(0);
    });
});