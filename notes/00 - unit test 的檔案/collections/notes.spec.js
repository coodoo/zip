describe("App.Collections.Notes", function () {

  before(function () {

    // 建一個新的 notes collection 準備測試
    // Create a reference for all internal suites/specs.
    this.notes = new App.Collections.Notes();

    // Use internal method to clear out existing data.
    this.notes.localStorage._clear();
  });

  after(function () {
    // Remove the reference.
    this.notes = null;
  });

  // 測試 新增資料
  describe("新增資料", function () {

    it("會有預設值", function () {
      expect(this.notes).to.be.ok;  // 此物件存在
      expect(this.notes).to.have.length(0);

      // 如何快速看到是這組 scenario 中哪支 expect 錯了？
      // 錯誤訊息如下
      // at Context.<anonymous> 
      // (http://localhost:9876/base/notes/test/js/spec/collections/notes.spec.js?1398394798000
      // :24:36)
      // 最後的第 24 行第 36 字元 就是重點
      // 將來可抓出 24 行內容
      // 36 字元則是 eqaul(1) 的開頭處，因此可精準看出哪支 method 出錯
      expect(this.notes.length).to.equal(0);
    });

    // -- Omitted in Book. --
    it("should be empty on fetch", function (done) {
      // Stash reference to save context.
      var notes = this.notes;

      // Before fetch.
      expect(notes).to.be.ok;
      expect(notes).to.have.length(0);

      // After fetch.
      // 原作者很喜歡透過偵聽 collection 身上的 reset event 來觸發後續事件
      // 我則實驗了一下直接寫在 collection.fetch() 的 success callback 內
      // notes.once("reset", function () {
      //   expect(notes).to.have.length(0);
      //   done();
      // });
      // notes.fetch({ reset: true });

      //jx
      function suc(collection, response, options){
          expect(notes).to.have.length(0);
          done();
      }

      notes.fetch({ reset: true, success: suc });

    });

  });

  // 測試 修改資料
  describe("modification", function () {

    beforeEach(function () {

      // 建立一筆新資料，然後測試它
      // Load a pre-existing note.
      this.notes.create({
        title: "Test note #1",
        text: "A pre-existing note from beforeEach."
      });
    });

    afterEach(function () {
      // Wipe internal data and reset collection.
      this.notes.localStorage._clear();
      this.notes.reset();
    });

    // jx
    it("has correct preset data", function(){
      // 取出第一筆資料
      var note = this.notes.at(0);
      expect(note.get('title')).to.be.equal('Test note #1');
      expect(note.get('text')).to.have.string('beforeEach');
    })

    //
    it("has a single note", function (done) {
      
      var notes = this.notes, note;

      // After fetch.
      notes.once("reset", function () {
        
        // 就是 beforeEach() 內建立的那筆假資料
        expect(notes).to.have.length(1);

        // Check model attributes.
        note = notes.at(0);
        expect(note).to.be.ok;
        expect(note.get("title")).to.contain("#1");
        expect(note.get("text")).to.contain("pre-existing");

        done();
      });

      notes.fetch({ reset: true });
    });

    //
    it("can delete a note", function (done) {
      var notes = this.notes, note;

      // After shift.
      notes.once("remove", function () {
        expect(notes).to.have.length(0);
        done();
      });

      // Remove and return first model.
      note = notes.shift();
      expect(note).to.be.ok;
    });

    // -- Omitted in Book. --
    it("can create a second note", function (done) {
      var notes = this.notes,
        note = notes.create({
          title: "Test note #2",
          text: "A new note, created in the test."
        });

      // After fetch.
      notes.once("reset", function () {
        expect(notes).to.have.length(2);

        // Check model attributes.
        note = notes.at(1);
        expect(note).to.be.ok;
        expect(note.get("title")).to.contain("#2");
        expect(note.get("text")).to.contain("new note");

        done();
      });

      notes.fetch({ reset: true });
    });

  });


});
