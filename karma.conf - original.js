// Karma configuration
// Generated on Mon Oct 14 2013 23:34:13 GMT+0800 (CST)

module.exports = function(config) {

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',



        // frameworks to use
        frameworks: ['mocha'],

        // 已確認所有需要的 js 都由此載入即可，不需在 html 裏寫 <script>
        // list of files / patterns to load in the browser
        files: [
            // 'lib/*.js',
            // 'src/*.js',
            // 'test/**/*.js'
            // Test Libraries
            // From karma-mocha: "notes/test/js/lib/mocha.js",
            "notes/test/js/lib/chai.js",
            "notes/test/js/lib/sinon-chai.js",
            "notes/test/js/lib/sinon.js",
            "notes/test/js/lib/fixtures.js",


            // Core Libraries
            "notes/app/js/lib/underscore.js",
            "notes/app/js/lib/jquery.js",
            "notes/app/js/lib/json2.js",
            "notes/app/js/lib/backbone.js",
            "notes/app/js/lib/backbone.localStorage.js",
            "notes/app/js/lib/bootstrap/js/bootstrap.js",
            "notes/app/js/lib/showdown/showdown.js",

            // 載入所有 html fixtures
            // 原先用 https://github.com/badunk/js-fixtures 沒成功
            // 後來決定用 https://github.com/kevindente/jsFixtures 比較單純 ← 但沒真的試完，先放著
            // {pattern: 'notes/test/js/spec/fixtures/**/*.html', watched: true, served: true, included: false},
            // {pattern: 'notes/test/js/spec/fixtures/**/jquery.js', watched: true, served: true, included: false},

            // Application Libraries
            "notes/app/js/app/namespace.js",
            "notes/app/js/app/config.js",
            
            // jx 加的 - 一定要寫在 config.js 之後才會生效
            "notes/test/js/spec/config.spec.js",
            
            "dev/karma-setup.js", // Setup and App.Config patch.
            "notes/app/js/app/models/note.js",
            "notes/app/js/app/collections/notes.js",
            "notes/app/js/app/templates/templates.js",
            "notes/app/js/app/views/note-nav.js",
            "notes/app/js/app/views/note-view.js",
            "notes/app/js/app/views/note.js",
            "notes/app/js/app/views/notes-item.js",
            "notes/app/js/app/views/notes-filter.js",
            "notes/app/js/app/views/notes.js",
            "notes/app/js/app/routers/router.js",

            // Tests.
            "notes/test/js/spec/**/*.js",
            // "chapters/*/test/js/spec/**/*.js"
        ],


        // list of files to exclude
        exclude: [

        ],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['ChromeCanary'],
        // browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // Coverage
        // 想看到 coverage 報表，要做兩件事
        // 1. npm install karma-coverage
        // 2. reporters: ['progress', 'coverage'] ← 加上 coverage
        preprocessors: {
            'notes/**/*.js': 'coverage'
        },

        // reporters
        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        // 如果要看 coverage 報表，要加第二個參數
        // reporters: ['dots', 'progress', 'coverage', 'junit'],
        reporters: [ 'mocha' ],

        //
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }


    });

};
