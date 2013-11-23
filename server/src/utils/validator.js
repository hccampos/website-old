var _ = require('lodash');
var iz = require('iz');
var validators = iz.validators;
var ValidatorConstructor = require('validator').Validator;
var validator = new ValidatorConstructor();

var validate = function (value, method) {
    try {
        var v = validator.check(value);
        v[method].apply(v, Array.prototype.slice.call(arguments, 2));
    } catch (e) {
        return false;
    }

    return true;
};

var isEmpty = function (value) {
    return value === null || value === undefined || value === '';
};

/**
 * Makes sure the value belongs to the specified enumeration.
 *
 * @param {*} value
 * @param {*} enumeration
 */
validators.enumValue = function (value, enumeration) {
    if (!enumeration) {
        throw new Error('No enumeration was provided.');
    }
    if (!_.isArray(enumeration)) { enumeration = enumeration.array; }
    if (!_.isArray(enumeration)) {
        throw new Error('No enumeration was provided.');
    }

    return _.contains(enumeration, value);
};

/**
 * Makes sure the value belongs to the specified enumeration.
 *
 * @param {*} value
 * @param {*} enumeration
 */
validators.intEnumValue = function (value, enumeration) {
    if (!_.isArray(enumeration)) { enumeration = enumeration.array; }
    if (!_.isArray(enumeration)) {
        throw new Error('No enumeration was provided.');
    }

    return _.contains(enumeration, parseInt(value, 10));
};

validators.integer = function (value) {
    return validators.int(value);
};

validators.bool = function (value) {
    return validators.boolean(value);
};

validators.float = function (value) {
    return validators.decimal(value);
};

validators.uuid = function (value) {
    if (isEmpty(value)) { return true; }
    return validate(value, 'isUUIDv4');
};

validators.url = function (value) {
    if (isEmpty(value)) { return true; }
    return validate(value, 'isUrl');
};

validators.email = function (value) {
    if (isEmpty(value)) { return true; }
    return validate(value, 'isEmail');
};

validators.decimalString = function (value) {
    if (isEmpty(value)) { return true; }
    return validate(value, 'isDecimal');
};

validators.max = function (value, max) {
    if (isEmpty(value)) { return true; }
    return validate(value, 'max', max);
};

validators.min = function (value, min) {
    if (isEmpty(value)) { return true; }
    return validate(value, 'min', min);
};

module.exports = {
    validate: function (data) {
        return {
            accordingTo: function (rules) {
                var areRules = iz.are(rules);
                var errors = {};
                var valid = true;

                _.each(areRules._fields, function (attributeData, attribute) {
                    var attributes = attribute.split('.');
                    var currentValue = data[attributes[0]];

                    // account for chained attributes
                    for (var i = 1; i < attributes.length; ++i) {
                        currentValue = currentValue[attributes[i]];
                    }

                    attributeData.setValue(currentValue);

                    var attributeErrors = attributeData.errors;
                    if (attributeErrors && attributeErrors.length > 0) {
                        errors[attribute] = attributeErrors;
                        valid = false;
                    }
                });

                return { valid: valid, errors: errors };
            }
        };
    },
    check: iz,
    types: [
        'int',
        'integer',
        'alphaNumeric',
        'boolean',
        'bool',
        'date',
        'decimal',
        'decimalString',
        'float',
        'uuid',
        'number'
    ]
};