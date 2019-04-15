// THIS IS A SIMPLE TEST OF A FUNCTION
// IT WORKS ONLY WHEN YOU HAVE #1 ORDER IN YOUR ECWID STORE

var expect = require("chai").expect;
var { storeId, secret } = require("../config");
var ecwid = require("../ecwid")(storeId, secret);

const TEST_TIMEOUT = 15000;

// go tests
describe("getOrderDetails Function Test", function() {
    it(`should get #1 order details`, async function () {
        let orderDetails = await ecwid.getOrderDetails(1);
        expect(typeof orderDetails).to.be.equal("object");
    }).timeout(TEST_TIMEOUT);
});