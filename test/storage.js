var crypto = require("crypto");
var expect = require("chai").expect;
var { storeId, secret } = require("../config");
var ecwid = require("../ecwid")(storeId, secret);

const TEST_TIMEOUT = 15000;

// generate random string for the new key
var key = crypto.randomBytes(20).toString("hex");
const storageData = {
    whoAmI: "a pretty test",
    whatIWant: "to show the storage funcs are alright"
};
const updatedStorageData = {
    whoAmI: "the new data motherfucker!"
}

// go tests
describe("Storage Functions Test", function() {
    it(`should create data in storage by random key "${key}"`, async function () {
        let addResult = await ecwid.addStorage(key, storageData);
        expect(typeof addResult).to.be.equal("object");
        expect(typeof (addResult.updateCount)).to.be.equal("number");
        expect(addResult.updateCount).to.be.equal(1);
    }).timeout(TEST_TIMEOUT);
    it(`should get data by that key ("${key}")`, async function() {
        let getResult = await ecwid.getStorage(key);
        expect(typeof getResult).to.be.equal("object");
        expect(getResult.key).to.be.equal(key);
        expect(typeof (getResult.value)).to.be.equal("string");
        let jsonResult = JSON.parse(getResult.value);
        expect(typeof (jsonResult.whoAmI)).to.be.equal("string");
        expect(typeof (jsonResult.whatIWant)).to.be.equal("string");
        expect(jsonResult.whoAmI).to.be.equal(storageData.whoAmI);
        expect(jsonResult.whatIWant).to.be.equal(storageData.whatIWant);
    }).timeout(TEST_TIMEOUT);
    it(`should update data at that key ("${key}")`, async function() {
        let editResult = await ecwid.editStorage(key, updatedStorageData);
        expect(typeof editResult).to.be.equal("object");
        expect(typeof (editResult.updateCount)).to.be.equal("number");
        expect(editResult.updateCount).to.be.equal(1);
    }).timeout(TEST_TIMEOUT);
    it(`should get new just updated data by that key ("${key}")`, async function() {
        let getResult = await ecwid.getStorage(key);
        expect(typeof getResult).to.be.equal("object");
        expect(getResult.key).to.be.equal(key);
        expect(typeof (getResult.value)).to.be.equal("string");
        let jsonResult = JSON.parse(getResult.value);
        expect(typeof (jsonResult.whoAmI)).to.be.equal("string");
        expect(jsonResult.whoAmI).to.be.equal(updatedStorageData.whoAmI);
    }).timeout(TEST_TIMEOUT);
    it("should delete created storage data", async function() {
        let deleteResult = await ecwid.deleteStorage(key);
        expect(typeof deleteResult).to.be.equal("object");
        expect(typeof (deleteResult.deleteCount)).to.be.equal("number");
        expect(deleteResult.deleteCount).to.be.at.equal(1);
    }).timeout(TEST_TIMEOUT);
    it(`should try to get data with deleted key ("${key}")`, function() {
        return ecwid.getStorage(key).then(() => {
            expect.fail(null, null, "function should have failed, but it did not");
        })
        .catch(error => {
            expect(typeof error).to.be.equal("object");
            expect(error.name).to.be.equal("StatusCodeError");
            expect(error.statusCode).to.be.equal(404);
        });
    }).timeout(TEST_TIMEOUT);
    it("just test getAllStorage", async function() {
        let allData = await ecwid.getAllStorage();
        expect(typeof allData).to.be.equal("object");
    }).timeout(TEST_TIMEOUT);
});