// Karma configuration
// Generated on Mon Oct 14 2013 23:34:13 GMT+0800 (CST)

module.exports = function(config) {
    
    var webdriverConfig = {
        hostname: 'localhost',
        port: 4444
    }

    config.set({

        customLaunchers: {
          'boo': {
            base: 'WebDriver',
            config: webdriverConfig,
            browserName: 'safari',
            name: 'Karma'
          }
        },
        browsers: ['boo'],




        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['mocha'],

        // 已確認所有需要的 js 都由此載入即可，不需在 html 裏寫 <script>
        // list of files / patterns to load in the browser
        files: [

            // Tests.
            "notes/test/js/spec/uitest.js",
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
        // browsers: ['PhantomJS'],
        // browsers: ['ChromeCanary'],  // 原本用這個


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
