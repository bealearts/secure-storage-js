
describe('The Secure Store', function() {

	var store;

	beforeEach(function(){
		var stubStore = {};
		stubStore['exists'] = JSON.stringify({prop: 'value'});

		store = new SecureStore(stubStore);
	});


	it('allows getting a stored object by key', function() {
		var exists = store.getItem('exists');
		expect(exists).not.toBeNull();

		var prop = exists.prop;
		expect(prop).toBe('value');
	});


	it('allows setting to a stored object by key', function() {
		store.setItem('new', 5);
		expect(store.getItem('new')).toBe(5);

		store.setItem('exists', {prop: 'new'});
		var exists = store.getItem('exists');
		var prop = exists.prop;
		expect(prop).toBe('new');		
	});


	it('allows removing a stored object by key', function() {
		store.removeItem('exists');

		var exists = store.getItem('exists');
		expect(exists).toBeNull();
	});


	it('allows access to the number of stored objects', function() {
		expect(store.length).toBe(1);
		console.log(store.length);

		store.setItem('new', 5);
		expect(store.length).toBe(2);

		store.removeItem('exists');
		store.removeItem('new');
		expect(store.length).toBe(0);
	});


	it('allows the clearing of all items in the store', function() {
		store.setItem('new', 5);
		expect(store.length).toBe(2);

		store.clear();
		expect(store.length).toBe(0);
		expect(store.getItem('new')).toBeNull();
	});


	it('provides numerical access to the keys in the store', function() {
		store.setItem('new', 5);

		expect(store.key(0)).toBe('exists');
		expect(store.key(1)).toBe('new');
		expect(store.key(2)).toBeNull();
	});


	it('allows setting an expiry date for the store', function() {
		var expires = new Date();
    	expires.setFullYear(expires.getFullYear() + 1);

		store.setExpiration(expires);
	});


	it('allows clearing the expiry date for the store', function() {
		store.setExpiration(null);
	});

});