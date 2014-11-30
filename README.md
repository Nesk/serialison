# SerialiSON

Resolve every link of a [{json:api}](http://jsonapi.org/) document

## Usage

Install SerialiSON and its dependencies:

```shell
npm install --save serialison
```

Require the constructor, instanciate it with your document and call the `resolve()` method:

```js
var SerialiSON = require('serialison');

var document = {
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

var resolver = new SerialiSON(document);

var resolvedDocument = resolver.resolve();
```

The `resolvedDocument` variable will contain the following structure:

```json
{
    "posts": {
        "id": "1",
        "title": "Rails is Omakase",
        "links": {
            "author": {
                "id": "9",
                "type": "people"
            },
            "comments": ["1", "2", "3"]
        },
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
}
```

### Options

You can pass options to the constructor:

```js
new SerialiSON(document, {
    // Options
});
```

The available options with their default values:

```js
{
    /**
     * Sets to `false` to disable errors when the document contains two resources with the same type and ID.
     * @type {Boolean}
     */
    throwErrorsForDuplicateIDs: true,

    /**
     * Defines the maximum of nested resources the `resolve()` method will process. Raising this value may increase the
     * resolving time, as memory usage.
     * @type {Number}
     */
    maxNestingDepth: 4,

    /**
     * Lists the top level properties except the primary resource. Allows the constructor to find the name of your
     * primary resource. Normally you shouldn't have to use this option but, if your document isn't {json:api} compliant
     * and contains other top level properties, you can add them to this array.
     * @type {Array}
     */
    topLevelProperties: ['meta', 'links', 'linked']
}
```

## Testing

To run the tests, use the following command:

```shell
npm test
```
