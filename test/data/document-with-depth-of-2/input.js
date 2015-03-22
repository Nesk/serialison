exports['document-with-depth-of-2'] = exports['document-with-depth-of-2'] || {};

exports['document-with-depth-of-2'].input = {
    "posts": {
        "id": "1",
        "links": {
            "comments": ["1"]
        }
    },
    "linked": {
        "author": [{
            "id": "9"
        }],
        "comments": [{
            "id": "1",
            "links": {
                "author": "9"
            }
        }]
    }
};
