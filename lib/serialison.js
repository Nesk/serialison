import {Mapper} from './mapper';
import {Resolver} from './resolver';
import {each} from './utils';

/**
 * Provides an entry point to configure and run JSON resolving
 */
class SerialiSON {

    constructor(mainDocument, options = {})
    {
        this.options = Object.assign({
            topLevelProperties: ['meta', 'links', 'linked']
        }, options);

        this.mapper = new Mapper(options);
        this.resolver = new Resolver(this.mapper, options);

        // Save the main document and add it to the internal map
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
        var primaryResourceKey = this.getPrimaryResourceKey(document),
            primaryResource = document[primaryResourceKey];

        // Map the main resource(s)
        this.mapper.add(primaryResourceKey, ...(primaryResource || {}));

        // Map the linked resources
        for (let {key: resourceType, value: resources} of each(document.linked || [])) {
            this.mapper.add(resourceType, ...resources);
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

        mainDocument[primaryResourceKey] = this.resolver.resolve(primaryResource);

        return mainDocument;
    }

};

// Export the SerialiSON class for Node/Browserify
if (typeof module == 'object') {
    module.exports = SerialiSON;
}
