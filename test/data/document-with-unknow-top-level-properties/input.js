exports['document-with-unknow-top-level-properties'] = exports['document-with-unknow-top-level-properties'] || {};

exports['document-with-unknow-top-level-properties'].input = {
    "ignore-this": {
        "id": "1",
        "links": {
            "author": "9"
        }
    },
    "posts": {
        "id": "1",
        "title": "Rails is Omakase",
        "links": {
            "author": "9"
        }
    },
    "linked": {
        "author": [{
            "id": "9"
        }]
    }
};
