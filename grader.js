#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var sys = require('util');
var rest = require('restler');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";




var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var cheerioUrlResult = function(urlCheck) {
    console.log('I am here: ', urlCheck);
    return cheerio.load(urlCheck);
};


var getUrl = function(url_result, checksfile) {
$ = cheerioUrlResult(url_result);

var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
    }
    return out;
};
  
  

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>' , 'Command Line defined URL')

       .parse(process.argv);

       if(program.url) {
          console.log(' - url' + "argument");
          //getUrl(program.url, program.checks);
          rest.get(program.url).on('complete', function(result) {

          var checkJson = getUrl(result, program.checks);
          var outJson = JSON.stringify(checkJson, null, 4);
          //console.log(cheerioUrlResult);
          
        });


         } else  {

        var checkJson = checkHtmlFile(program.file, program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson); 
              }

  }

else {

        exports.checkHtmlFile = checkHtmlFile;
}
