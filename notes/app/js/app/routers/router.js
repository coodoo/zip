(function () {
  'use strict';

  // Router
  // ------
  // The router translates routes in to views.
  App.Routers.Router = Backbone.Router.extend({

    // **Note**: Could wrap this up in functions to allow easier
    // stubbing of the underlying methods. But, there are some
    // definite Backbone.js efficiencies from using simple string
    // method names instead (like name inference, etc).
    routes: {
      "": "notes",

      // "note/d0134337-f2db-d4b8-e56e-abfd95d508a9/view" 類似這樣的字串
      // 通常由 NotesItem view 發出，目地是跳到單一 note 頁面
      "note/:id/:action": "note",
    },

    /**
     * 
     */
    initialize: function (opts) {
      opts || (opts = {});

      // 會不斷 re-use 的 view，
      // 因此先從 app{} 取出並存放於此
      // 至於檢查 opts{} 這段是為了寫 test 時方便傳入假的 view
      this.notesView = opts.notesView || app.notesView;
      this.noteNavView = opts.noteNavView || app.noteNavView;

      // Validation.
      if (!this.notesView) { throw new Error("No notesView"); }
      if (!this.noteNavView) { throw new Error("No noteNavView"); }

      // Stash current note view for re-rendering.
      this.noteView = null;
    },

    // Show notes list.
    notes: function () {
      this.notesView.render();
    },

    // Common single note edit/view.
    // 要顯示單一 note 畫面
    note: function (noteId, action) {
      
      // Check if we are already at currently active view.
      if (this.noteView) {
 
        if (this.noteView.model.id === noteId) {
          
          // Reuse existing note view if same note.
          // 重要：只有當 view 已存在時，會跑到這段
          return this.noteView.trigger("update:" + action);

        } else {
          // Else, remove the last stored view.
          this.noteView.remove();
        }
      }

      // Try to find note in existing collection.
      var model = this.notesView.collection.get(noteId);
      if (!model) {
        // Go to home page on missing model.
        return this.navigate("", { trigger: true });
      }

      // 重點：noteView 本身是每次都重新建立
      // 但它上方的 nav view 則是重覆用舊的
      // Create note and add to DOM.
      this.noteView = new App.Views.Note(

        // attrs
        { model: model },   
        
        // options
        {
          action: action,
          nav: this.noteNavView
        }

      );

      // 將單一 noteView 塞入 DOM 顯示出來
      $("#note").html(this.noteView.render().$el);
    }

  });
}());
