(function() {
    'use strict';

    // Note View
    // ---------
    // A single note.
    // 
    // 這才是單一 note 的進入點，它下含兩個 sub-views
    // 一個是上方的 navbar，另個是 note 內容主體
    // Contains:
    // * App.Views.NoteNav: Helper view for navigation events.
    // * App.Views.NoteView: Child view for rendering Markdown.
    //
    App.Views.Note = Backbone.View.extend({

        id: "note-panes",

        template: _.template(App.Templates["template-note"]),

        // 
        events: {
            "blur   #note-form-edit": "saveNote",
            "submit #note-form-edit": function() {
                return false;
            }
        },

        //
        initialize: function(attrs, opts) {
            
            // Default to empty options.
            opts || (opts = {});

            // Add member variables.
            //
            // Router can be set directly (e.g., tests), or use global.
            // The `app.router` object *does* exist at this point.
            // 
            // 注意這裏傳入了單一 note 最上方的 nav view
            // 它是由 router::note()建立的
            // 並且那裏會傳入 nav view
            this.nav = opts.nav; // 這支 view 就是 re-use 的
            this.router = opts.router || app.router;

            // Verification.
            // -- Line Omitted in Book. --
            if (!this.router) {
                throw new Error("No router");
            }

            // Add our custom listeners.
            this._addListeners();

            // Render HTML, update to action, and show note.
            this.$el.html(this.template(this.model.toJSON()));
            this.update(opts.action || "view");
            this.render();

            // 建立屬下最重要的 sub-view，也就是 note 內容的 view
            // Add in viewer child view (which auto-renders).
            this.noteView = new App.Views.NoteView({
                el: this.$("#note-pane-view-content"),
                model: this.model
            });

        },

        // Helper listener initialization method.
        _addListeners: function() {

            // Model controls view rendering and existence.
            // 
            // 偵聽 model 的事件
            this.listenTo(this.model, {
                "destroy": function() {
                    this.remove();
                },
                "change": function() {
                    this.render().model.save();
                }
            });

            // Navbar controls/responds to panes.
            // 
            // 偵聽 sub-views 廣播出來的事件
            this.listenTo(this.nav, {
                "nav:view": function() {
                    this.viewNote();
                },
                "nav:edit": function() {
                    this.editNote();
                },
                "nav:delete": function() {
                    this.deleteNote();
                }
            });

            // Respond to update events from router.
            // 這段是 NoteItem view 裏的 edit 鈕被按下 → 進到 router#note() → 由於 noteView 已存在，因此那裏觸發一個事件
            // 目地是為了強迫 NoteView(也就是這個檔案)進行重繪
            this.on({
                "update:view": function() {
                    this.render().viewNote();
                },

                // NotesView 裏編輯一筆資料時，真的有跑這裏
                "update:edit": function() {
                    this.render().editNote();
                }
            });


        },

        // Rendering the note is simply showing the active pane.
        // All HTML should already be rendered during initialize.
        render: function() {
            $(".region").not(".region-note").hide();
            $(".region-note").show();
            return this;
        },

        remove: function() {
            // Remove child, then self.
            this.noteView.remove();
            Backbone.View.prototype.remove.call(this);
        },

        // Update internal "action" state (view or edit).
        update: function(action) {

            action = action || this.action || "view";

            var paneEl = "#note-pane-" + action,
                loc = "note/" + this.model.id + "/" + action;

            // Ensure menu bar is updated.
            this.nav.trigger("nav:update:" + action);

            // Show active pane.
            this.$(".pane").not(paneEl).hide();
            this.$(paneEl).show();

            // Store new action and navigate.
            if (this.action !== action) {
                this.action = action;
                this.router.navigate(loc, {
                    replace: true
                });
            }
        },

        // Activate "view" or "edit" note panes.
        viewNote: function() {
            this.update("view");
        },

        //
        editNote: function() {
            this.update("edit");
        },

        // Delete model (causes view removal) and navigate to
        // "all notes" list page.
        deleteNote: function() {
            
            // 在測試時，window.confirm() 這 function 已被 stub() 成永遠返還 false 了  
            if (confirm("Delete note?")) {
            
                this.model.destroy();
            
                // 刪除時就是導向回 "" 也就會觸發 router 回 notes view
                this.router.navigate("", {
                    trigger: true,
                    replace: true
                });
            }
        },

        // Save note (triggering model change).
        saveNote: function() {

            // 這裏會觸發 model 存檔
            this.model.set({
                title: this.$("#input-title").val().trim(),
                text: this.$("#input-text").val().trim()
            });
        }

    });
}());
