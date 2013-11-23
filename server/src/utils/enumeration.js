/**
 * Defines a function that can be used to create an enum.
 *
 * @author <a href="mailto:hcfields@gmail.com">Hugo Cristóvão de Campos</a>
 */

module.exports = function (items) {
    var result = {};

    var itemsArray = [];

    for (var p in items) {
        if (items.hasOwnProperty(p)) {
            var value = items[p];
            result[p] = value;
            itemsArray.push(value);
        }
    }

    result.array = itemsArray;

    return result;
};