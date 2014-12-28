var assert = require('chai').assert,
    data = require('./data'),
    SerialiSON = require('../' + require('../package.json').main);

describe("SerialiSON", function() {

    describe("with default options and a standard compound document", function() {

        it("should return a resolved document", function() {
            var input = data.input('compound-document'),
                output = data.output('compound-document');

            var resolver = new SerialiSON(input);

            assert.deepEqual(resolver.resolve(), output);
        });

    });

    describe("with a document containing duplicated resources", function() {

        describe("with default options", function() {

            it("should throw an error", function() {
                var input = data.input('document-with-duplicated-resources');

                var errorOccurred = false;

                try {
                    new SerialiSON(input);
                } catch(error) {
                    errorOccurred = true;
                }

                assert.isTrue(errorOccurred);
            });

        });

        describe("with `throwErrorsForDuplicateIDs` option set to `false`", function() {

            it("shouldn't throw any error", function() {
                var input = data.input('document-with-duplicated-resources');

                var errorOccurred = false;

                try {
                    new SerialiSON(input, {
                        throwErrorsForDuplicateIDs: false
                    });
                } catch(error) {
                    errorOccurred = true;
                }

                assert.isFalse(errorOccurred);
            })

        });

    });

    describe("with `maxNestingDepth` option set to `1` and document a with a nesting depth of `2`", function() {

        it("should return a document with a nesting depth of `1`", function() {
            var input = data.input('document-with-depth-of-2'),
                output = data.output('document-with-depth-of-2');

            var resolver = new SerialiSON(input, {
                maxNestingDepth: 1
            });

            assert.deepEqual(resolver.resolve(), output);
        });

    });

    describe([
        "with `topLevelProperties` set to `['meta', 'links', 'linked', 'ignore-this']` and a document containing a",
        "`ignore-this` top level property"
    ].join(' '), function() {

        it("should detect the `posts` property as the main resource", function() {
            var input = data.input('document-with-unknow-top-level-properties'),
                output = data.output('document-with-unknow-top-level-properties');

            var resolver = new SerialiSON(input, {
                topLevelProperties: ['meta', 'links', 'linked', 'ignore-this']
            });

            assert.deepEqual(resolver.resolve(), output);
        });

    });

});