/**
 * Returns a generator used to iterate over object or array properties
 */
export function* each(collection)
{
    if (Array.isArray(collection)) {
        for (let index = 0 ; index < collection.length ; index++) {
            yield {key: index, value: collection[index]};
        }
    } else if (isObject(collection)) {
        for (let key of Object.keys(collection)) {
            yield {key, value: collection[key]};
        }
    } else {
        throw new Error("First parameter should be an Object or an Array");
    }
};

/**
 * Transforms an object
 */
export function transform(object, transformers)
{
    for (let {value: transform} of each(transformers)) {
        if (typeof transform == 'function') {
            object = transform(object);
        }
    }

    return object;
}

/**
 * Returns true if the value is defined
 */
export function isDefined(value) {
    return typeof value !== 'undefined';
};

/**
 * Returns true if the value is an object
 */
export function isObject(value) {
    return value !== null && typeof value.valueOf() === 'object';
};

/**
 * Returns true if the value is a string
 */
export function isString(value) {
    return value !== null && typeof value.valueOf() === 'string';
};
