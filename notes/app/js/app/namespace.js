/*global App:true, app:true */
// Set up global application namespace using object literals.
//
// For more on JavaScript namespacing, see:
// * http://rmurphey.com/blog/2009/10/15/
//          using-objects-to-organize-your-code/
// * http://addyosmani.com/blog/essential-js-namespacing/
// * http://addyosmani.github.com/backbone-fundamentals/#namespacing

// Class names.
//
// Lazily creates:
//
//    App: {
//      Config: {},
//      Models: {},
//      Collections: {},
//      Routers: {},
//      Views: {},
//      Templates: {}
//    }
//
// 這裏是將 bb 的 model, collection, view 等 class definition 都存入此 namespace 中，方便之後建立實體
// 並且通常我都用 DI 注入，不會用 global namespace 來存
var App = App   || {};
App.Config      || (App.Config = {});
App.Models      || (App.Models = {});
App.Collections || (App.Collections = {});
App.Routers     || (App.Routers = {});
App.Views       || (App.Views = {});
App.Templates   || (App.Templates = {});

// Application instance.
var app = app || {};
