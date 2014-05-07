var chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    webdriverjs = require('webdriverjs');
 
// local 版
// var options = {
//     desiredCapabilities: {
//         browserName: 'chrome'
//     }
// };

// 用遠端 saucelab 版
var options = {
    
    // 這是 selenium 要的參數
    desiredCapabilities: {
        browserName: 'chrome',
        version: '27',
        platform: 'XP',
        tags: ['examples'],
        name: 'This is an example test'
    },

    // 下面才是 saucelab 的設定
    host: 'ondemand.saucelabs.com',
    port: 80,
    user: "forlist66",
    key: "064caf0e-c866-42a4-945c-58b1c1542c46",
    logLevel: 'silent'
};


describe.only('my webdriverjs tests', function(){
 
    this.timeout(99999999);
    
    var client = {};
 
    before(function(){

        // 原本 local 版
        client = webdriverjs.remote( options );
        client.init();
    });
    
    //
    it('先測一下 github',function(done) {
        client
            .url('https://github.com/')
            .getElementSize('.header-logo-wordmark', function(err, result) {
                expect(err).to.be.null;
                assert.strictEqual(result.height , 32);
                assert.strictEqual(result.width, 89);
            })
            .getTitle(function(err, title) {
                expect(err).to.be.null;
                assert.strictEqual(title,'GitHub · Build software better, together.');
            })
            .getElementCssProperty('css selector','a[href="/plans"]', 'color', function(err, result){
                expect(err).to.be.null;
                assert.strictEqual(result, 'rgba(65,131,196,1)');
            })
            .call(done);
    });
 
    after(function(done) {
        client.end(done);
    });
});