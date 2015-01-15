import {Mapper} from './mapper';
import {Resolver} from './resolver';
import {each, transform, isObject} from './utils';

/**
 * Provides an entry point to configure and run JSON resolving
 */
class SerialiSON {

    constructor(mainDocument, options = {})
    {
        this.options = Object.assign({
            topLevelProperties: ['meta', 'links', 'linked'],
            stripTopLinkingProperties: true,
            mainDocumentTransformers: []
        }, options);

        this.mapper = new Mapper(options);
        this.resolver = new Resolver(this.mapper, options);

        // Save the main document and add it to the internal map
        if (!isObject(mainDocument)) {
            throw new Error("The main document must be a valid object");
        }

        this.mainDocument = mainDocument;
        this.addDocument(mainDocument);
    }

    /**
     * Returns the primary resource key of a document
     */

    getPrimaryResourceKey(document)
    {
        return document.data
            ? 'data'
            : Object.keys(document).filter(key => !~this.options.topLevelProperties.indexOf(key))[0];
    }

    /**
     * Retrieves all the resources of a document and adds them to the internal map
     */
    addDocument(document)
    {
        if (!isObject(document)) {
            return this;
        }

        var primaryResourceKey = this.getPrimaryResourceKey(document),
            primaryResource = document[primaryResourceKey];

        // Map the main resource(s)
        this.mapper.addResources(primaryResourceKey, ...(primaryResource || {}));

        // Map the linked resources
        for (let {key: resourceType, value: resources} of each(document.linked || [])) {
            this.mapper.addResources(resourceType, ...resources);
        }

        // Map the URL templates
        for (let {key: resourcePath, value: urlTemplate} of each(document.links || [])) {
            this.mapper.addUrlTemplate(resourcePath, urlTemplate);
        }

        return this;
    }

    /**
     * Returns the main document once all the links are resolved
     */
    resolve()
    {
        var mainDocument = JSON.parse(JSON.stringify(this.mainDocument)), // Create a copy of the document
            primaryResourceKey = this.getPrimaryResourceKey(mainDocument),
            primaryResource = mainDocument[primaryResourceKey];

        if (primaryResource) {
            mainDocument[primaryResourceKey] = this.resolver.resolve(primaryResourceKey, primaryResource);
        }

        mainDocument = transform(
            mainDocument,
            [this.defaultTransformer()].concat(this.options.mainDocumentTransformers)
        );

        return mainDocument;
    }

    /**
     * Returns the default transformer used to strip the top linking properties of the main document
     */
    defaultTransformer()
    {
        var self = this;

        return function(mainDocument) {
            if (self.options.stripTopLinkingProperties) {
                delete mainDocument.links;
                delete mainDocument.linked;
            }

            return mainDocument;
        };
    }

};

// Export the SerialiSON class for Node/Browserify
if (isObject(module)) {
    module.exports = SerialiSON;
}
