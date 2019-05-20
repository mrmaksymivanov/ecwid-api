var expect = require("chai").expect;
var { storeId, secret } = require("../config");
var ecwid = require("../ecwid")(storeId, secret);

const TEST_TIMEOUT = 15000;

// go tests
describe("Classes Functions Test", function() {
    it(`should get product types ("classes" as in API)`, async function () {
        let classes = await ecwid.getClasses()
        expect(typeof classes).to.be.equal("object");
        expect(classes.length).to.be.above(0);
        expect(classes[0].attributes).to.be.not.undefined;
        // we have upc and brand and optionally custom attributes
        expect(classes[0].attributes.length).to.be.above(1);
    }).timeout(TEST_TIMEOUT);
});