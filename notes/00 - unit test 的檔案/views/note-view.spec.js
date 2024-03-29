describe("App.Views.NoteView", function () {

  before(function () {
    // Create test fixture.
    this.$fixture = $("<div id='note-view-fixture'></div>");
  });

  beforeEach(function () {
    
    // 將自建的 $fixture 塞到 DOM 的 #fixtures elm 身上
    // Empty out and rebind the fixture for each run.
    this.$fixture.empty().appendTo($("#fixtures"));

    // New default model and view for each test.
    //
    // Creation actually calls `render()`, so in tests we have an
    // *already rendered* view.
    // 重要：將自建的 $fixture 指派為該 view 的 root el
    this.view = new App.Views.NoteView({
      el: this.$fixture,
      model: new App.Models.Note()  // 注意這裏建了一個新 model 塞進 view
    });
  });

  afterEach(function () {
    // Destroying the model also destroys the view.
    this.view.model.destroy();
  });

  after(function () {
    // Remove all sub-fixtures after test suite finishes.
    $("#fixtures").empty();
  });

  // 開始測試
  it("can render an empty note", function () {

    //  將 DOM 內的兩個 elem 選出來，準備測它們的值
    var $title = $("#pane-title"),
      $text = $("#pane-text");

    // Default to empty title in `h2` tag.
    expect($title.text()).to.equal("");
    expect($title.prop("tagName")).to.match(/h2/i);
    expect($title.prop("tagName").toLowerCase()).to.contain('h2')
    // console.log( '名稱: ', $text.html() );

    // Have simple default message.
    expect($text.text()).to.equal("Edit your note!");
    expect($text.html()).to.equal("<p><em>Edit your note!</em></p>");
  });

  it("can render more complicated markdown", function (done) {
    // Model updates will cause a re-render. Set our tests on that
    // event. Because we set in tests, we will come **after** the
    // event listener in the view.
    //
    // An alternate approach would be to set a mock on the view's
    // `render()` method. This would be more robust as relying on
    // internal listener order is fairly brittle and risky in the
    // face of implementation changes.
    //
    // Yet another approach is to have the view emit a "render"-
    // related event that we can listen on once rendering is done
    // and ensure that the DOM is updated before testing.
    // 
    // 注意這裏是偵聽 model 的 change 事件，而且用 once() 只掛一次
    // 由於原本 note-view.js 內部就會偵 model:change 事件並且 render()
    // 因此下面偵聽 change 只是為了知道何時能開始跑 test
    // 但風險就是不能保証此時 view.render() 已執行完畢，
    // 也因此可能畫面的 elem 值還沒更新，測試就會失敗
    // 所以他上面說更穩定的方法是直接從 render() 下手
    this.view.model.once("change", function () {

      var $title = $("#pane-title"),
        $text = $("#pane-text");

      // Our new (changed) title.
      expect($title.text()).to.equal("My Title");

      // Rendered Markdown with headings, list.
      //
      // **Note**: The start `<h2>` tag also has a generated `id`
      // field, so for simplicity we only assert on
      // `"My Heading</h2>"`.
      expect($text.html())
        .to.contain("My Heading</h2>").and
        .to.contain("<ul>").and
        .to.contain("<li>List item 2</li>");

      done();
    });

    // 前面掛完偵聽，這裏才能改資料
    // 下面就是設定比較複雜的內容讓它去轉成 markdown
    // Make our note a little more complex.
    this.view.model.set({
      title: "My Title",
      text: "## My Heading\n" +
            "* List item 1\n" +
            "* List item 2"
    });

  });
});
