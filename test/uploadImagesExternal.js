var crypto = require("crypto");
var expect = require("chai").expect;
var { storeId, secret } = require("../config");
var ecwid = require("../ecwid")(storeId, secret);


const TEST_TIMEOUT = 15000;

var productName = crypto.randomBytes(20).toString('hex');
var productId = null;
var mainImage = "https://dummyimage.com/400x400/000000/fff.jpg&text=image+1";
var galleryImages = [
    "https://dummyimage.com/400x400/000000/fff.jpg&text=g+image+1",
    "https://dummyimage.com/400x400/000000/fff.jpg&text=g+image+2",
    "https://dummyimage.com/400x400/000000/fff.jpg&text=g+image+3"
];

// go tests
describe("Create product - upload external image - upload external gallery images", function() {
    it(`should create a product ${productName}`, async function () {
        let product = await ecwid.addProduct({ name: productName })
        expect(typeof product).to.be.equal("object");
        expect(typeof (product.id)).to.be.equal("number");
        expect(product.id).to.be.at.least(1);
        productId = product.id;
    }).timeout(TEST_TIMEOUT);
    it(`should upload ${mainImage} as main image`, async function () {
        let uploader = await ecwid.uploadProductImageExternal(productId, mainImage);
        expect(typeof uploader).to.be.equal("object");
        expect(typeof (uploader.id)).to.be.equal("number");
        expect(uploader.id).to.be.at.least(1);
    }).timeout(TEST_TIMEOUT);
    it(`should upload 3 more images to product gallery`, async function () {
        for (let i = 0; i < galleryImages.length; i++) {
            let uploader = await ecwid.uploadGalleryImageExternal(productId, galleryImages[i]);
            expect(typeof uploader).to.be.equal("object");
            expect(typeof (uploader.id)).to.be.equal("number");
            expect(uploader.id).to.be.at.least(1);
        }
    }).timeout(TEST_TIMEOUT);
    it("should delete created product", async function() {
        let result = await ecwid.deleteProduct(productId);
        expect(typeof result).to.be.equal("object");
        expect(typeof (result.deleteCount)).to.be.equal("number");
        expect(result.deleteCount).to.be.at.equal(1);
    }).timeout(TEST_TIMEOUT);
});