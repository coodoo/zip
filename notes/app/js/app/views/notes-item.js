(function () {
  'use strict';

  // Notes Item View
  // ---------------
  // A single note within a list of notes.
  // 
  // 這支 noteItem 其實只是轉手，例如點了 view 就觸發 router.navigate('view') 讓外層去做事
  App.Views.NotesItem = Backbone.View.extend({

    // Set rendered DOM element `id` property to the model's id.
    id: function () { return this.model.id; },

    tagName: "tr",

    className: "notes-item",

    template: _.template(App.Templates["template-notes-item"]),

    events: {
      "click .note-view":   function () { this.viewNote(); },
      "click .note-edit":   function () { this.editNote(); },
      "click .note-delete": function () { this.deleteNote(); }
    },

    initialize: function (attrs, opts) {
      // Get router from options or app. Also allow to be empty
      // so that tests can `render` without.
      opts || (opts = {});
      this.router = opts.router || app.router;

      this.listenTo(this.model, {
        "change":   function () { this.render(); },
        "destroy":  function () { this.remove(); }
      });
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    viewNote: function () {
      // 他想組合出 "note/d0134337-f2db-d4b8-e56e-abfd95d508a9/view" 這樣的字串
      // 卻是用 array 去 join()
      // 有趣的手法
      var loc = ["note", this.model.id, "view"].join("/");
      this.router.navigate(loc, { trigger: true });
    },

    editNote: function () {
      
      // "note/50d0513a-f382-68e7-146c-ce2c585d7fb9/edit"
      var loc = ["note", this.model.id, "edit"].join("/");
      
      this.router.navigate(loc, { trigger: true });
    },

    deleteNote: function () {
      // Destroying model triggers view cleanup.
      this.model.destroy();
    }

  });
}());
