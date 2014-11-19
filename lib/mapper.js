import {each, isDefined} from './utils';

export class Mapper {

    constructor(options = {})
    {
        this.options = Object.assign({
            throwErrorsForDuplicateIDs: true
        }, options);

        this.resources = {};
    }

    /**
     * Returns the real type of the resources by checking the "type" property in each resource
     */
    getType(resourceType, ...resources)
    {
        var typesSet = new Set;

        for (let {value: resource} of each(resources)) {
            if (resource.type) {
                typesSet.add(resource.type);
            }
        }

        if (typesSet.size == 1) {
            resourceType = Array.from(typesSet.values())[0];
        } else if (typesSet.size > 1) {
            let types = JSON.stringify(Array.from(typesSet.values()));
            throw new Error(`Multiple types found in the provided resources: ${types}`);
        }

        return resourceType;
    }

    /**
     * Adds multiple resources with the same type to the map
     */
    add(resourceKey, ...resources)
    {
        // If the resource key is undefined, abort the execution.
        if (!resourceKey) {
            return;
        }

        // Get the real type of the resources
        var resourceType = this.getType(resourceKey, ...resources);

        // Add the resource type if it doesn't exist in the map
        var mappedType = this.resources[resourceType] = this.resources[resourceType] || {};

        // Iterate over each resource and add it to the map
        for (let {value: resource} of each(resources)) {

            // Ignore the resource if undefined or if it hasn't any ID
            if (!isDefined(resource) || !isDefined(resource.id)) {
                continue;
            }

            // Add the resource if the ID doesn't already exist
            if (!isDefined(mappedType[resource.id.toString()])) {
                mappedType[resource.id.toString()] = resource;
            } else if (this.options.throwErrorsForDuplicateIDs) {
                throw new Error("A resource with the same type and ID already exists");
            }

        }
    }

    /**
     * Retrieves a resource from its type and its ID
     */
    get(resourceType, id)
    {
        var mappedType = this.resources[resourceType] || {};

        return mappedType[id.toString()] || null;
    }

};
