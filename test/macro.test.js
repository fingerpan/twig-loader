var should = require("should");

var fs = require("fs");
var path = require("path");

var runLoader = require("./fakeModuleSystem");
var twigLoader = require("../");
var fixtures = path.join(__dirname, "fixtures");

describe("macro", function() {
  it("normal render macro", function(done) {
    var template = path.join(fixtures, "macro", "template.html.twig");
    runLoader(twigLoader, path.join(fixtures, "macro"), template, fs.readFileSync(template, "utf-8"), function(err, result) {
      if(err) throw err;

      result.should.have.type("string");

      // include yourMacroName macroName
      result.should.match(/"macroName":"yourMacroName"/);

      done();
    });
  });
});
