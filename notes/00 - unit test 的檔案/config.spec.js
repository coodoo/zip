// 原本的手法是為測試另建一個 localStorage 叫 note-test，免的覆蓋掉真正的資料
// Test overrides (before any app components).
App.Config = _.extend(App.Config, {
	storeName: "notes-test" // localStorage for tests.
});