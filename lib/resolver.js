import {each, isString} from './utils';

export class Resolver {

    constructor(mapperInstance, options = {})
    {
        this.options = Object.assign({
            maxNestingDepth: 4
        }, options);

        this.mapper = mapperInstance;

        this.currentNestingDepth = 0;
    }

    /**
     * Returns the resource(s) once all the links are resolved
     */
    resolve(resources)
    {
        if (this.currentNestingDepth < this.options.maxNestingDepth) {
            // If we have an collection of resources, call recursively the resolve() method for each resource.
            if (Array.isArray(resources)) {
                for (let {key: resourceKey, value: resource} of each(resources)) {
                    resources[resourceKey] = this.resolve(resource);
                }
            }

            // Link the relationships of the current resource
            else if (resources) {
                this.currentNestingDepth++;

                for (let {key: relationshipKey, value: relationship} of each(resources.links || {})) {
                    let relatedResources = this.link(relationshipKey, relationship);

                    if (relatedResources != null) {
                        resources[relationshipKey] = relatedResources;
                    }
                }

                this.currentNestingDepth--;
            }
        }

        return resources;
    }

    /**
     * Returns the related resource(s) once they have been resolved
     */
    link(relationshipType, relationships)
    {
        // If the relationship contains an array of IDs, call recursively the link method() for each ID.
        if (Array.isArray(relationships)) {
            return this.linkMultipleIds(relationshipType, relationships);
        }

        // If the relationship is not a string, assume it's a resource object.
        else if (!isString(relationships)) {
            // Get the real type of the resource
            relationshipType = relationships.type || relationshipType;

            // Only one ID
            if (relationships.id) {
                return this.link(relationshipType, relationships.id.toString());
            }

            // Multiples IDs
            else if (relationships.ids) {
                return this.linkMultipleIds(relationshipType, relationships);
            }

            return null;
        }

        // If the relationships is a string, we can retrieve the resource.
        else {
            return this.resolve(this.mapper.get(relationshipType, relationships));
        }
    }

    /**
     * Returns the related collection of resources
     */
    linkMultipleIds(relationshipType, relationships)
    {
        var resources = [];

        for (let {value: relationshipID} of each(relationships)) {
            let resource = this.link(relationshipType, relationshipID.toString());

            if (resource) {
                resources.push(resource);
            }
        }

        return resources.length ? resources : null;
    }

};
