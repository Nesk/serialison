exports['documents-with-duplicated-url-templates'] = exports['documents-with-duplicated-url-templates'] || {};

exports['documents-with-duplicated-url-templates'].input = [{
    "links": {
        "posts.author": {
            "href": "http://example.com/people/{posts.author}",
            "type": "people"
        }
    }
}, {
    "links": {
        "posts.author": {
            "href": "http://example.com/comments/{posts.comments}",
            "type": "comments"
        }
    }
}];
