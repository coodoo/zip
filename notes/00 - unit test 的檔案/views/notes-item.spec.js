describe("App.Views.NotesItem", function() {

    /*
        // 原本我寫的版本
        var s = sinon.stub(App.Views.NoteItem.prototype, "viewNote");
        s.returns("I'm fake");

        var view = new App.Views.NoteItem();
        view.render().$el

        view.$('.note-view').click();
        expect(view.viewNote)
        .to.be.calledOnce.and
        .to.have.returned("I'm fake")  

     */

    // Don't need to specify fixtures, as rendering creates an
    // unattached element that the app manually appends, and we
    // directly check here.
    before(function() {

        this.navigate = sinon.stub();

        this.view = new App.Views.NotesItem({
            model: new App.Models.Note({
                id: "0",
                title: "title"
            })
        }, {
            // 一開始 router 就給假的
            router: {
                navigate: this.navigate
            }
        });
    });

    afterEach(function() {
        this.navigate.reset();
    });

    after(function() {
        this.view.remove();
    });

    // ok
    describe("remove", function() {
        it("is removed on model destroy", sinon.test(function() {
            // Empty stub for view removal to prevent side effects.
            this.stub(this.view, "remove");
            this.view.model.trigger("destroy");
            expect(this.view.remove).to.be.calledOnce;
        }));
    });

    // ok
    describe("render", function() {
        // One way to verify is with a stub.
        it("renders on model change w/ stub", sinon.test(function() {
            this.stub(this.view);
            this.view.model.trigger("change");
            expect(this.view.render).to.have.been.calledOnce;
        }));

        // Here is another way to do the same check with a mock.
        it("renders on model change w/ mock", sinon.test(function() {
            var exp = this.mock(this.view).expects("render").once();
            this.view.model.trigger("change");
            exp.verify();
        }));
    });

    // -- Omitted in Book. --
    // ok
    describe("DOM", function() {
        it("renders data to HTML", function() {
            var $item = this.view.render().$el;

            // Should set `id` on DOM element and title.
            expect($item.attr("id")).to.equal(this.view.model.id);
            expect($item.find(".note-title").text()).to.equal("title");
        });
    });

    // 下面就是在空測當 ui 有動作時，會否觸發正確的 event handler
    // 或者是接續跑到 router.navigate
    describe("actions", function() {
        
        it("views on click", function() {
        
            this.view.$(".note-view").click();

            expect(this.navigate)
                .to.be.calledOnce.and
                .to.be.calledWith("note/0/view");
        });

        it("edits on click", function() {
            this.view.$(".note-edit").click();

            expect(this.navigate)
                .to.be.calledOnce.and
                .to.be.calledWith("note/0/edit");
        });

        it("deletes on click", sinon.test(function() {
            // Empty stub for model destroy to prevent side effects.
            this.stub(this.view.model, "destroy");
            this.view.$(".note-delete").click();

            expect(this.view.model.destroy).to.be.calledOnce;
        }));
    });

});
