var crypto = require("crypto");
var expect = require("chai").expect;
var { storeId, secret } = require("../config");
var ecwid = require("../ecwid")(storeId, secret);

// generate random string to name the new category
var categoryName = crypto.randomBytes(20).toString('hex');
var categoryId = null;
const categoryDescription = "this is a test category";

// go tests
describe("Category Functions Test", function() {
    it(`should create category "${categoryName}"`, async function () {
        let category = await ecwid.addCategory({ name: categoryName })
        expect(typeof category).to.be.equal("object");
        expect(typeof (category.id)).to.be.equal("number");
        expect(category.id).to.be.at.least(1);
        categoryId = category.id;
    });
    it("should update just created category", async function() {
        let result = await ecwid.updateCategory(categoryId, { description: categoryDescription });
        expect(typeof result).to.be.equal("object");
        expect(typeof (result.updateCount)).to.be.equal("number");
        expect(result.updateCount).to.be.at.equal(1);
    });
    it("should find just created category", async function() {
        let offset = 0, limit = 5;
        let categories = null, categoryList = [];
        while (!categories || categories.count == categories.limit) {
            categories = await ecwid.getCategories({ limit, offset });
            expect(typeof categories).to.be.equal("object");
            expect(typeof (categories.items)).to.be.equal("object");
            categoryList.push(...categories.items);
            offset += limit;
        }
        let createdCategory = categoryList.find(it => it.name == categoryName);
        expect(createdCategory.name).to.be.at.equal(categoryName);
    });
    it("should delete created category", async function() {
        let result = await ecwid.deleteCategory(categoryId);
        expect(typeof result).to.be.equal("object");
        expect(typeof (result.deleteCount)).to.be.equal("number");
        expect(result.deleteCount).to.be.at.equal(1);
    });
});