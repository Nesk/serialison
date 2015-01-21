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

                assert.throw(function() {
                    new SerialiSON(input);
                }, "A resource with the same type and ID already exists");
            });

        });

        describe("with `throwErrorsForDuplicateIDs` option set to `false`", function() {

            it("shouldn't throw any errors", function() {
                var input = data.input('document-with-duplicated-resources');

                assert.doesNotThrow(function() {
                    new SerialiSON(input, {
                        throwErrorsForDuplicateIDs: false
                    });
                });
            })

        });

    });

    describe("with documents containing duplicated URL templates", function() {

        describe("with default options", function() {

            it("should throw an error", function() {
                var input = data.input('documents-with-duplicated-url-templates');

                assert.throw(function() {
                    var resolver = new SerialiSON(input[0]);
                    resolver.addDocument(input[1]);
                }, /^Multiple URL templates with the same path found: .+/);
            });

        });

        describe("with `throwErrorsForDuplicateIDs` option set to `false`", function() {

            it("shouldn't throw any errors", function() {
                var input = data.input('documents-with-duplicated-url-templates');

                assert.doesNotThrow(function() {
                    var resolver = new SerialiSON(input[0], {
                        throwErrorsForDuplicateUrlTemplates: false
                    });
                    resolver.addDocument(input[1]);
                });
            })

        });

    });

    describe("with `maxNestingDepth` option set to `1` and a document with a nesting depth of `2`", function() {

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

    describe("with additional documents of any types except objects", function() {

        it("shouldn't throw any errors", function() {
            var resolver = (new SerialiSON({}))
                .addDocument(null)
                .addDocument('string')
                .addDocument(new String('string'));

            assert.deepEqual(resolver.resolve(), {});
        });

    });

    describe("with striping options set to `false`", function() {

        it("should return a document without any stripped properties compared to the original one", function() {
            var input = data.input('document-without-striping'),
                output = data.output('document-without-striping');

            var resolver = new SerialiSON(input, {
                stripTopLinkingProperties: false,
                stripLinksProperty: false
            });

            assert.deepEqual(resolver.resolve(), output);
        });

    });

    describe("with custom transformers", function() {

        it("should apply any modifications done by the default and custom transformers", function() {
            var input = data.input('document-with-transformers'),
                output = data.output('document-with-transformers');

            var resolver = new SerialiSON(input, {
                mainDocumentTransformers: [function(mainDocument) {
                    mainDocument.title = "Posts about rails";
                    return mainDocument;
                }],

                resourceTransformers: [function(resource) {
                    delete resource.id;
                    return resource;
                }]
            });

            assert.deepEqual(resolver.resolve(), output);
        });

    });

});
