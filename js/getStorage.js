function getStorage(storage, prefix) {
    return new Proxy({}, {
        set: (obj, prop, value) => {
            // obj[prop] = value;
            storage.setItem(`${prefix}.${prop}`, value);
        },
        get: (obj, prop) => {
            // return obj[prop];
            return storage.getItem(`${prefix}.${prop}`);
        },
    });
}