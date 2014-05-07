describe("App.Models.Note", function() {

    //
    it("有預設值喔", function() {

        // Create empty note model.
        var model = new App.Models.Note();

        expect(model).to.be.ok;
        expect(model.get("title")).to.equal("");
        expect(model.get("text")).to.equal("*Edit your note!*");
        expect(model.get("createdAt")).to.be.a("Date");
    });

    //
    it("能正確處理初始化時傳入的屬性值", function() {

        var model = new App.Models.Note({
            title: "Grocery List",
            text: "* Milk\n* Eggs\n*Coffee",
            createdAt: "Jan 14, 2014",  //jx
            foo: 'bar'  //jx
        });

        expect(model.get("title")).to.equal("Grocery List");
        expect(model.get("text")).to.equal("* Milk\n* Eggs\n*Coffee");
        expect(model.get("createdAt")).to.equal("Jan 14, 2014");
        // expect(model.get('foo')).not.to.be.ok;
    });
});
