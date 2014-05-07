(function () {
  'use strict';

  // Note View Pane
  // --------------
  // Render a single note pane for viewing.
  // 
  // 這支 view 負責的事相對簡單，就是將 markdown 轉成 html 顯示出來
  // 至於 edit 畫面則早先塞在 template 裏可直接從 DOM 取用
  App.Views.NoteView = Backbone.View.extend({

    template: _.template(App.Templates["template-note-view"]),

    converter: new Showdown.converter(),

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);

      // jx: 注意這裏居然自已跑了 render()
      this.render();
    },

    // Convert note data into Markdown.
    render: function () {
      this.$el.html(this.template({
        title: this.model.get("title"),
        text: this.converter.makeHtml(this.model.get("text"))
      }));
      return this;
    }
    
  });
}());
