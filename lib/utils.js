/**
 * Returns a generator used to iterate over object or array properties
 */
export function* each(obj)
{
    if (Array.isArray(obj)) {
        for (let index = 0 ; index < obj.length ; index++) {
            yield {key: index, value: obj[index]};
        }
    } else {
        try {
            for (let key of Object.keys(obj)) {
                yield {key, value: obj[key]};
            }
        } catch(e) {
            throw new Error("First parameter should be an Object or an Array");
        }
    }
};

/**
 * Returns true if the value is defined
 */
export function isDefined(value) {
    return typeof value !== 'undefined';
};

/**
 * Returns true if the value is a string
 */
export function isString(value) {
    return typeof value.valueOf() === 'string';
};
