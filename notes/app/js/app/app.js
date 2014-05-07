// Wrap closure in jQuery "ready" function, to ensure that the DOM
// is fully available for the rest of our application.
$(function () {
  'use strict';

  // Initialize application components.
  // The collection object comes first as views depend on it.
  app.collection = new App.Collections.Notes();

  // 目前看來他將 notesView 與 noteNavView 塞入 global 的 app{} 原因是
  // 這些物件將來會共用
  //
  // Views come next. Lazy dependency on router internally, meaning
  // that by the time we start using view methods, the `app.router`
  // object must exist. In practice, this isn't a big deal, because
  // the router is the ingress point that handles a request and
  // actually binds it to a view, allowing the view methods to be
  // called.
  app.notesView = new App.Views.Notes({
    collection: app.collection
  });

  // 這裏建立 single note 上方的 nav bar view
  app.noteNavView = new App.Views.NoteNav();

  // Router has dependencies on `app.*View` objects, so comes
  // after.
  app.router = new App.Routers.Router();

  // Wait until we have our initial collection from the backing
  // store before firing up the router.
  app.collection.once("reset", function () {
    Backbone.history.start();
  });

  // Now fetch collection data, kicking off everything.
  app.collection.fetch({ reset: true });

});
