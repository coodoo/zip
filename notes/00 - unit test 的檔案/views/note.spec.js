// The following is needed for Mocha < 1.9.0 when using PhantomJS:
//
//  /*global confirm, mocha */
//  mocha.globals(["confirm"]);
//

describe("App.Views.Note", function () {

  before(function () {
    // Regions for different views.
    $("#fixtures").append($(
      "<div class='region-note' style='display: none;'></div>" +
      "<div class='region-notes' style='display: none;'></div>"
    ));

    // App.Views.Note fixture.
    this.$fixture = $(
      "<div id='note-fixture'>" +
        "<div id='#note-pane-view-content'></div>" +
      "</div>"
    );

    // Any model changes will trigger a `model.save()`, which
    // won't work in the tests, so we have to fake the method.
    //
    // Stub the model prototype *once* for all our tests.
    sinon.stub(App.Models.Note.prototype, "save");
  });

  /**
   * 
   */
  beforeEach(function () {
    this.routerSpy = sinon.spy();
    this.$fixture.appendTo($("#fixtures"));

    // Creation calls `render()`, so in tests we have an
    // *already rendered* view.
    // 
    // 注意這裏建立了真實的 Note View 喔
    // 而且這個 view 還傳入了四個做假的物件，只是為了方便測試
    this.view = new App.Views.Note({
      el: this.$fixture,
      model: new App.Models.Note()
    }, {
      // 注意這裏動了 router 手腳
      // 
      // Pass an empty view and manually mock router.
      // We are essentially "faux" mocking the components.
      nav: new Backbone.View(), // 這個 nav view 根本是空值
      router: {
        navigate: this.routerSpy  // 這個才是測試手法的重點，它發功的地方是在下面各種 test case 裏
      }
    });
  });

  afterEach(function () {
    this.$fixture.empty();
    if (this.view) { this.view.model.destroy(); }
  });

  after(function () {
    $("#fixtures").empty();
    App.Models.Note.prototype.save.restore();
  });


  //========================================================================
  //
  // 真正測試開始

  // 第一支測試
  describe("view modes and actions", function () {
    
    // `NoteView` first goes to `#note/:id/view`
    it("navigates / displays 'view' by default", function () {

      // 最基本先測一下 routerSpy 有無被呼叫，並且傳入正確的參數
      expect(this.routerSpy).to.be.calledWithMatch(/view$/);

      // Check CSS visibility directly. Not necessarily a best
      // practice as it uses internal knowledge of the DOM, but
      // gets us a quick check on what should be the visible
      // view pane.
      expect($("#note-pane-view")
        .css("display")).to.not.equal("none");
      expect($("#note-pane-edit")
        .css("display")).to.equal("none");
    });

    // Edit event triggers navigation to `#note/:id/edit`
    it("navigates / displays 'edit' on event", function () {
      
      // 重要：當初 router 與 noteView 間的架構設計良好，採用 event 機制
      // 因此測試時即可輕鬆人工觸發一個事件就跑後續行為
      // 這個事件發出後，會讓 NoteView 重繪，確保新的 model 資料顯示出來
      this.view.trigger("update:edit");
      
      // 原理是：按照原設計，一定會先跑完 router#edit() 才廣播
      // 因此必然會在 rouerSpy 內留下痕跡
      expect(this.routerSpy).to.be.calledWithMatch(/edit$/);

      expect($("#note-pane-edit")
        .css("display")).to.not.equal("none");
      expect($("#note-pane-view")
        .css("display")).to.equal("none");
    });

    it("confirms note on delete", sinon.test(function () {
      
      //  stub() 範例，固定返還 false 值，也就是不要真的刪除 note，不然一下就沒資料了
      this.stub(window, "confirm").returns(false);

      // 原本執行 deleteNote() 後，它內部會跑 if (confirm("Delete note?")) {
      // 因此一定會觸發 confirm() 這個指令
      // 但前面已將 confirm() 給 stub 過了，因此這個操作必然留下痕跡
      // stub() window.confirm 時，等於同時監看這個物件，將來也可像 sinon.spy() 一樣操作驗証指令
      this.view.deleteNote();

      // 前面跑完後，就可以驗証 calledOnce 之類的值
      // 以確認 confirm() 是否真的有被跑
      expect(window.confirm)
        .to.have.been.calledOnce.and
        .to.have.been.calledWith("Delete note?");
    }));
  });

  // 用 spy 監看 remove() 指令是否有被執行
  describe("model interaction", function () {
    afterEach(function () {
      // Wipe out to prevent any further use.
      this.view = null;
    });

    // It is a good habit to check that views are actually
    // disposed of when expected. Here, we bind view removal to
    // the destruction of a model.
    it("is removed on destroyed model", sinon.test(function () {
      this.spy(this.view, "remove");
      this.spy(this.view.noteView, "remove");

      this.view.model.trigger("destroy");

      expect(this.view.remove).to.be.calledOnce;
      expect(this.view.noteView.remove).to.be.calledOnce;
    }));
  });

  describe("note rendering", function () {

    it("can render a note", function () {
      // Don't explicitly call `render()` because
      // `initialize()` already called it.
      expect($(".region-note")
        .css("display")).to.not.equal("none");
      expect($(".region-notes")
        .css("display")).to.equal("none");
    });

    // Borrows a `NoteView` spec verbatim to make sure that the
    // overall view code renders correctly.
    // -- Omitted in Book. --
    it("can render a default note view", function () {
      var $title = $("#pane-title"),
        $text = $("#pane-text");

      // Default to empty title in `h2` tag.
      expect($title.text()).to.equal("");
      expect($title.prop("tagName")).to.match(/h2/i);

      // Have simple default message.
      expect($text.text()).to.equal("Edit your note!");
      expect($text.html())
        .to.equal("<p><em>Edit your note!</em></p>");
    });

    it("calls render on model events", sinon.test(function () {
      // Spy on `render` and check call/return value.
      this.spy(this.view, "render");

      this.view.model.trigger("change");

      // 這裏有趣，一方面驗証 spy 過的 render()是否真的被執行
      // 另方面也驗証它返還的值是否正確
      expect(this.view.render)
        .to.be.calledOnce.and
        .to.have.returned(this.view);
    }));

    it("calls render on changed data", sinon.test(function () {
      this.spy(this.view, "render");

      // Replace form value and blur to force changes.
      $("#input-text").val("# A Heading!");
      $("#note-form-edit").blur();

      // `Note` view should have rendered.
      expect(this.view.render)
        .to.be.calledOnce.and
        .to.have.returned(this.view);

      // Check the `NoteView` view rendered the new markdown.
      expect($("#pane-text").html())
        .to.match(/<h1 id=".*?">A Heading!<\/h1>/);
    }));
  });
});
