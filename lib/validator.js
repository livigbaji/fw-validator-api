module.exports = class {
    static gte(field, conditionValue) {
        return field >= conditionValue;
    }

    static gt(field, conditionValue) {
        return field > conditionValue;
    }

    static eq(field, conditionValue) {
        return field === conditionValue;
    }

    static contains(field, conditionValue) {
        return !!(field.includes && field.includes(conditionValue));
    }  
    
    static neq(field, conditionValue) {
        return field !== conditionValue;
    }

    static validate({ condition, field, conditionValue }) {
        const method = this[condition];
        
        if(!method) {
            throw new Error(`Condition '${condition}' is not allowed`);
        }

        return method(field, conditionValue);
    }

    static extractFieldValue(data, field) {
        return (Array.isArray(data) || typeof data === 'string') ? data : data[field];
    }
};