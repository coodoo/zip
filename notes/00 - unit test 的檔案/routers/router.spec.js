describe("App.Routers.Router", function () {

  // Default option: Trigger and replace history.
  var opts = { trigger: true, replace: true };

  // Routing tests are a bit complicated in that the actual hash
  // fragment can change unless fully mocked out. We *do not* mock
  // the URL mutations meaning that a hash fragment will appear in
  // our test run (making the test driver appear to be a single
  // page app).
  //
  // There are alternative approaches to this, such as Backbone.js'
  // own unit tests which fully fake out the URL browser location
  // with a mocked object to instead contain URL information and
  // behave mostly like a real location.
  before(function () {

    // Dependencies and fake patches.
    // 有趣的是不用 sinon.test(function () {...} 而是人工自建 sandbox
    this.sandbox = sinon.sandbox.create();

    // Mock the entire `Notes` object.
    this.sandbox.mock(App.Views.Notes);

    // Stub `Note` prototype and configure `render`.
    // 重要：注意這段操作 sandbox 的手法
    // 1、他是針對整個 note view 的 prototype 物件下手
    // 2、先 stub() 後才針對個別 method 覆寫
    this.sandbox.stub(App.Views.Note.prototype);  // 這樣是將 view 身上的所有 method 都吃掉變成內部不作動了
    App.Views.Note.prototype.render.returns({ $el: null });
  });

  // 
  beforeEach(function () {
    
    // Fake function: Get a model simulation if id is "1".
    var get1 = function (i) {
      return i === "1" ? { id: "1" } : null;
    };

    // Create router with stubs and manual fakes.
    // router 原本就有為 test 情境預留接口，因此可透過 opts{} 傳入假的 view 供它使用
    // 不然原本 router 建立時是直接跟 App.Views.* 取值
    this.router = new App.Routers.Router(
      
      // 這兩個假 view 傳入後，整個 router 就能動起來
      // 後續也會很好測
      {
          // 第 1 個 view
          notesView: {
            render: this.sandbox.stub(),

            // 這等於是塞一個 model，其值為 {id:"1"}，進到 collection 內
            collection: { get: get1 }
          },
      
          // 第 2 個 view
          // 是直接傳入一個空的 stub func
          noteNavView: this.sandbox.stub()
      }
          
    );

    // Start history to enable routes to fire.
    Backbone.history.start();

    // Spy on all route events.
    // 有趣，是統一聽 router 的 "route" 事件，交給 spy 處理
    // 而非針對每支 route handler 處理
    this.routerSpy = sinon.spy();
    this.router.on("route", this.routerSpy);
  });

  // 注意：每個 test case 跑完會重置 router
  afterEach(function () {
    // Navigate to home page and stop history.
    this.router.navigate("", opts);
    Backbone.history.stop();
  });

  after(function () {
    this.sandbox.restore();
  });


  /*
      
      - backbone 的 route 是用一個 {} 來宣告，如下

        routes: {
          "": "notes",

          // "note/d0134337-f2db-d4b8-e56e-abfd95d508a9/view" 類似這樣的字串
          // 通常由 NotesItem view 發出，目地是跳到單一 note 頁面
          "note/:id/:action": "note",
        },

      - 這跟之前的 event handler 一樣，是直接存取 notes() 與 note() 兩 func
      - 因此 router instance 建立後就無法再覆寫了
      - 所以要事先覆寫  

   */ 
  describe("routing", function () {

    before(function () {
      // Stub out notes and note to check routing.
      //
      // Happens **before** the router instantiation.
      // If we stub *after* instantiation, then `notes` and `note`
      // can no longer be stubbed in the usual manner.
      // 
      // 為何這裏用 stub 而非 spy 就好？
      // 因為 routing rule 被觸發後，會真的執行 notes() func
      // 我不希望它內部功能真的被執行，因此用 stub() 擋掉最單純
      // 畢竟這裏要測的只是 routing rule 是否能正確被觸發
      // 而不是觸發後的連鎖反應是否正確
      // 
      // 注意下面是建了兩個 空的 stub，也就是該兩支 func 變成沒功能了
      sinon.stub(App.Routers.Router.prototype, "notes");
      sinon.stub(App.Routers.Router.prototype, "note");
    });

    beforeEach(function () {
      // Reset before every run.
      App.Routers.Router.prototype.notes.reset();
      App.Routers.Router.prototype.note.reset();
    });

    after(function () {
      App.Routers.Router.prototype.notes.restore();
      App.Routers.Router.prototype.note.restore();
    });

    // 開始測試
    it("can route to notes", function () {
      
      // Start out at other route and navigate home.
      // 先跳去別的路徑，才能回來
      this.router.navigate("note/1/edit", opts);
      
      // 這裏才是真正要測的劇情
      this.router.navigate("", opts);

      // 果然只是測 notes() 是否有被呼叫一次，並且傳入 null 參數
      // 這就是前面建立空白 router 的好處
      expect(App.Routers.Router.prototype.notes)
        .to.have.been.calledOnce.and
        // Updated for Backbone.js v1.1.2. Was:
        // .to.have.been.calledWithExactly();
        .to.have.been.calledWithExactly(null);
    });

    // ok
    it("can route to note", function () {
      
      this.router.navigate("note/1/edit", opts);
      expect(App.Routers.Router.prototype.note)
        .to.have.been.calledOnce.and
        // Updated for Backbone.js v1.1.2. Was:
        // .to.have.been.calledWithExactly("1", "edit");
        .to.have.been.calledWithExactly("1", "edit", null);
    });

  });
  
  // 下面開始測早先建立的 RouterSpy
  // 這個 spy 是掛在監聽 router "route" event
  // 因此只要有 routing change 就會觸發
  describe("notes", function () {

    it("can navigate to notes page", function () {
      // Start out at other route and navigate home.
      this.router.navigate("note/1/edit", opts);

      // jx: 練習自已寫一個驗証
      // 重點在第二行的 calledWith('note')
      expect(this.routerSpy)
        .to.have.been.calledOnce.and
        .to.have.been.calledWith('note', ["1", "edit", null]);

      this.router.navigate("", opts);

      // Spy has now been called **twice**.
      expect(this.routerSpy)
        .to.have.been.calledTwice.and
        // 注意這行，當觸發 "" route rule 時，原本該是 notes() func 上場接客
        // 因此這裏能驗証此點是否成立
        .to.have.been.calledWith("notes");
    });

  });

  describe("note", function () {

    // ok
    it("can navigate to note page", sinon.test(function () {

      this.router.navigate("note/1/edit", opts);

      expect(this.routerSpy)
        .to.have.been.calledOnce.and
        // Updated for Backbone.js v1.1.2. Was:
        // .to.have.been.calledWith("note", ["1", "edit"]);
        // 第三個參數 null 是 backbone.1.1.2 後的 regex 處理完新增的
        .to.have.been.calledWith("note", ["1", "edit", null]);
    }));

    // ok
    it("can navigate to same note", sinon.test(function () {
      
      // Short router: Skip test if empty router.
      if (!this.router.noteView) { return; }

      // 為了要測同一個 note 是否能連續訪問兩次
      // 因此先跑一次
      this.router.navigate("note/1/edit", opts);
      expect(this.routerSpy)
        .to.have.been.calledOnce.and
        // Updated for Backbone.js v1.1.2. Was:
        // .to.have.been.calledWith("note", ["1", "edit"]);
        .to.have.been.calledWith("note", ["1", "edit", null]);

      // Manually patch in model property (b/c stubbed).
      this.router.noteView.model = { id: "1" };

      // 接著再跑第二次，就要看是否會正常運行
      // Navigating to same with different action works.
      this.router.navigate("note/1/view", opts);
      expect(this.routerSpy)
        .to.have.been.calledTwice.and
        // Updated for Backbone.js v1.1.2. Was:
        // .to.have.been.calledWith("note", ["1", "view"]);
        .to.have.been.calledWith("note", ["1", "view", null]);

      // 下面這個也很重要，測試跳轉到另一頁時，是否有正確將前頁移除  
      // Even with error, should still `remove` existing.
      this.router.navigate("note/2/view", opts);

      // 早先整個 this.sandbox.stub(App.Views.Note.prototype) 已將所有 func 都 stub 過了
      expect(this.router.noteView.remove) 
        .to.have.been.calledOnce;
    }));

    it("navigates to list on no model", sinon.test(function () {
      
      // Short router: Skip test if empty router.
      if (!this.router.noteView) { return; }

      this.router.navigate("note/2/edit", opts);

      // Note that the route events are out of order because
      // the re-navigation to "notes" happens **first**.
      expect(this.routerSpy)
        .to.have.been.calledTwice.and
        // Updated for Backbone.js v1.1.2. Was:
        // .to.have.been.calledWith("note", ["2", "edit"]).and
        .to.have.been.calledWith("note", ["2", "edit", null]).and
        .to.have.been.calledWith("notes");
    }));

  });

});
