# SerialiSON

Resolve every link of a [{json:api}](http://jsonapi.org/) document

## Installation

Node.js:

```shell
npm install --save serialison
```

Browsers:

```shell
bower install --save serialison
```

## Usage

Require the constructor, instanciate it with your document and call the `resolve()` method:

```js
// The SerialiSON variable is already declared in a browser environment
var SerialiSON = require('serialison');

var myDocument = {
    "posts": {
        "id": "1",
        "title": "Rails is Omakase",
        "links": {
            "author": {
                "id": "9",
                "type": "people"
            },
            "comments": ["1", "2", "3"]
        }
    },
    "linked": {
        "people": [{
            "id": "9",
            "name": "@d2h"
        }],
        "comments": [{
            "id": "1",
            "body": "Mmmmmakase"
        }, {
            "id": "2",
            "body": "I prefer unagi"
        }, {
            "id": "3",
            "body": "What's Omakase?"
        }]
    }
};

var resolver = new SerialiSON(myDocument);

var resolvedDocument = resolver.resolve();
```

The `resolvedDocument` variable will contain the following structure:

```json
{
    "posts": {
        "id": "1",
        "title": "Rails is Omakase",
        "author": {
            "id": "9",
            "name": "@d2h"
        },
        "comments": [{
            "id": "1",
            "body": "Mmmmmakase"
        }, {
            "id": "2",
            "body": "I prefer unagi"
        }, {
            "id": "3",
            "body": "What's Omakase?"
        }]
    }
}

```

### Options

You can pass options to the constructor:

```js
new SerialiSON(myDocument, {
    // Options
});
```

The available options with their default values (syntax based on [JSDoc](http://usejsdoc.org/index.html)):

```js
{
    /**
     * Set to `false` to disable errors when the documents contain two resources
     * with the same type and ID, the latest resource will override the other ones.
     * @type {Boolean}
     */
    throwErrorsForDuplicateIDs: true,

    /**
     * Set to `false` to disable errors when the documents contain two URL templates
     * with the same path, the latest URL template will override the other ones.
     * @type {Boolean}
     */
    throwErrorsForDuplicateUrlTemplates: true,

    /**
     * Defines the maximum of nested resources the `resolve()` method will process.
     * Raising this value may increase the resolving time, as memory usage.
     * @type {Number}
     */
    maxNestingDepth: 4,

    /**
     * Lists the top level properties except the primary resource. Allows the
     * constructor to find the name of your primary resource. Normally you shouldn't
     * have to use this option but, if your document isn't {json:api} compliant and
     * contains other top level properties, you can add them to this array.
     * @type {string[]}
     */
    topLevelProperties: ['meta', 'links', 'linked'],

    /**
     * Strips the `links` and `linked` top level properties once the document is
     * resolved.
     * @type {Boolean}
     */
    stripTopLinkingProperties: true,

    /**
     * Strips the `links` property from each resource.
     * @type {Boolean}
     */
    stripLinksProperty: true,


    /**
     * A custom transformer to alter an object
     * @callback transformer
     * @param {Object} object - The object to transform
     * @returns {Object} The transformed object
     */

    /**
     * A collection of transformers to execute once the main document has been
     * resolved. Each transformer will receive the main document as the first
     * parameter.
     * @type {transformer[]}
     */
    mainDocumentTransformers: [],

    /**
     * A collection of transformers to execute for each resource once it has been
     * resolved. Each transformer will receive a resource as the first parameter.
     * @type {transformer[]}
     */
    resourceTransformers: []
}
```

## Testing

To run the tests, use the following command:

```shell
npm test
```
