describe("App.Views.NoteNav", function () {

  before(function () {
    
    // 它不是真用 note app 中的 view template 去測試
    // 而是生成下面這段模擬的 DOM 結構
    // 然後在 beforeEach() 時將它塞入 html 上的 <div id="fixtures" style="display: none; visibility: hidden;"></div>
    // Fixture.
    this.$fixture = $(
      "<ul id='note-nav'>" +
        "<li class='note-view'></li>" +
        "<li class='note-edit'></li>" +
        "<li class='note-delete'></li>" +
      "</ul>"
    );
  });

  beforeEach(function () {
    
    // Removing also detaches fixture. Reattach here.
    this.$fixture.appendTo($("#fixtures"));

    // The nav. view just wraps existing DOM elements,
    // and doesn't separately render.
    // 這裏很巧妙，它根本不讓 backbone.view 去 render()
    // 而是將自已預建的假 DOM 塞進去
    // 後面的 test 也是針對這個假的 DOM 做測試 ← 這樣感覺測的很心酸？因為 view 有問題的話根本看不出？
    this.view = new App.Views.NoteNav({
      el: this.$fixture
    });

  });

  afterEach(function () {
    this.view.remove();
  });

  after(function () {
    $("#fixtures").empty();
  });

  // 第一個 scenario
  describe("events", function () {
    
    // test case 1
    it("fires events on 'view' click", function () {

      // 建三個 spy 物件
      // 注意這裏的重大差異為它不是包住一個既有的 method，例如 var navSpy = sinon.spy('navHandler')
      // 而是直接建一個空的 spy function，並在稍後用做 handler
      // 因此所有事件都不會真的觸發原始行為
      var navSpy = sinon.spy(), 
        updateSpy = sinon.spy(),
        otherSpy = sinon.spy();

      this.view.on({
        
        "nav:view": navSpy, //  主畫面切換為 閱讀 模式
        
        "nav:update:view": updateSpy,// 閱讀
        "nav:edit nav:update:edit": otherSpy, // 編輯
        "nav:delete nav:update:delete": otherSpy  // 刪除
      });

      // 人工觸發一個 view button 的 click()事件，效果等同於 trigger('click')
      this.$fixture.find(".note-view").click();

      // 閱讀鈕被按下後，預期應該有幾支 function 被觸發
      // 它們早先已被包在 spy 裏監看中
      // 下面就是驗証是否真的有呼叫
      expect(navSpy).to.have.been.calledOnce; // 這支如果有成功被呼叫，頁面就會切換到 閱讀模式
      expect(updateSpy).to.have.been.calledOnce;  // 如果成功呼叫，工具列上的 view 鈕會呈現按下狀態
      expect(otherSpy).to.not.have.been.called;
    });

  });

  describe("menu bar display", function () {
    
    // 
    it("has no active navs by default", function () {

      // 有趣，也可以這樣測工具列是否有任何鈕被按下
      // Check no list items are active.
      expect(this.view.$("li.active")).to.have.length(0);

      // Another way - manually check each list nav.
      expect($(".note-view")
        .attr("class")).to.not.include("active");
      expect($(".note-edit")
        .attr("class")).to.not.include("active");
      expect($(".note-delete")
        .attr("class")).to.not.include("active");
    });

    // Test the actual menu clicks.
    it("updates nav on 'edit' click", function () {
      // 人工按下 edit button
      $(".note-edit").click();
      // 然後驗証該鈕身上是否有 .active 樣式，代表有成功被按下
      expect($(".note-edit").attr("class")).to.include("active");

      // console.log( '跑我的喔: ', this.view.$("li.acitve") );
      
      // jx: 但接著也應該驗証其它鈕有跳起來
      // 方法是檢查工具列中是否只有一個鈕是 .active 狀態
      expect(this.view.$("li.active")).to.have.length(1);
    });

    // Test event triggers (possibly from other views).
    it("updates nav on 'edit' event", function () {
      this.view.trigger("nav:update:edit");
      expect($(".note-edit").attr("class")).to.include("active");

      // jx
      expect(this.view.$("li.active")).to.have.length(1);
    });

  });
});
