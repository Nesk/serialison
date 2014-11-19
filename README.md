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
