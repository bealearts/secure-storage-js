
describe('The Secure Storage API', function() {
	
	var key = '';	
	
	beforeEach(function(){
		key = sha256.hex('somepassword');	
	});

	afterEach(function(){
		localStorage.removeItem('securedStore_test');
		localStorage.removeItem('securedStore_test_locked');
	});	
	
	it('can create a Secure Store', function() {
		openSecureStorage('test', AES_256, key, function(store){
			expect(store).toBeDefined();

			var value = store.getItem('aValue');
			expect(value).toBeNull();			
		});

		var localStore = localStorage.getItem('secureStore_test');
		expect(localStore).toBeDefined();
	});	
	
	it('can open an existing Secure Store', function() {
		openSecureStorage('test', AES_256, key, function(store){
			store.setItem('aValue', 'someValue');
		});

		openSecureStorage('test', AES_256, key, function(store){
			expect(store).toBeDefined();

			var value = store.getItem('aValue');
			expect(value).toBeDefined();
			expect(value).toEqual('someValue');
		});		
	});	

	it('can remove a Secure Store', function() {
		openSecureStorage('test', AES_256, key, function(store){
			store.setItem('aValue', 'someValue');
		});

		removeSecureStorage('test');

		var localStore = localStorage.getItem('secureStore_test');
		expect(localStore).toBeNull();
	});	
})
