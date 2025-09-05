
describe('localstorage-util', () => {
    beforeEach(() => {
        jest.resetModules();
        window.localStorage.clear();
    });

    test('GetLocalStorageItem returns null for missing key', () => {
        const util = jest.requireActual('@/lib/localstorage-util');
        const got = util.GetLocalStorageItem('nonexistent');
        expect(got).toBeNull();
    });

    test('SetLocalStorageItem and GetLocalStorageItem store and retrieve JSON objects', () => {
        const util = jest.requireActual('@/lib/localstorage-util');
        const obj = { a: 1, b: 'two' };
        util.SetLocalStorageItem('objKey', obj);
        const read = util.GetLocalStorageItem('objKey');
        expect(read).toEqual(obj);
    });

    test('SetLocalStorageItem and GetLocalStorageItem handle plain strings', () => {
        const util = jest.requireActual('@/lib/localstorage-util');
        util.SetLocalStorageItem('strKey', 'plain-string');
        const read = util.GetLocalStorageItem('strKey');
        expect(read).toBe('plain-string');
    });

    test('RemoveLocalStorageItem removes an entry', () => {
        const util = jest.requireActual('@/lib/localstorage-util');
        util.SetLocalStorageItem('toRemove', { x: true });
        expect(util.GetLocalStorageItem('toRemove')).not.toBeNull();
        util.RemoveLocalStorageItem('toRemove');
        expect(util.GetLocalStorageItem('toRemove')).toBeNull();
    });
});
