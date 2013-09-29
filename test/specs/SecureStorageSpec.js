
describe('The Secure Storage API', function() {
	
	var key = '';	
	
	beforeEach(function(){
		password = 'somepassword';
		key = sjcl.misc.pbkdf2(password, []);
		key64 = sjcl.codec.base64.fromBits(key);
	});


	afterEach(function(){
		localStorage.removeItem('securedStore_test');
		localStorage.removeItem('securedStore_test_locked');
	});	

	
	it('can create a Secure Store', function() {
		openSecureStorage('test', AES_256, key64, function(store){
			expect(store).toBeDefined();

			var value = store.getItem('aValue');
			expect(value).toBeNull();			
		});

		var localStore = localStorage.getItem('secureStore_test');
		expect(localStore).toBeDefined();
	});	

	
	it('can open an existing Secure Store', function() {
		openSecureStorage('test', AES_256, key64, function(store){
			store.setItem('aValue', 'someValue');
		});

		openSecureStorage('test', AES_256, key64, function(store){
			expect(store).toBeDefined();

			var value = store.getItem('aValue');
			expect(value).toBeDefined();
			expect(value).toEqual('someValue');
		});		
	});	


	it('can remove a Secure Store', function() {
		openSecureStorage('test', AES_256, key64, function(store){
			store.setItem('aValue', 'someValue');
		});

		removeSecureStorage('test');

		var localStore = localStorage.getItem('secureStore_test');
		expect(localStore).toBeNull();
	});


	it('requires the same cypher to be used for encrypting and decripting', function() {
		openSecureStorage('test', AES_256, key64, function(store){
			store.setItem('aValue', 'someValue');
		});

		expect(function(){
			openSecureStorage('test', AES_128, key64, function(store){
				var value = store.getItem('aValue');
			});	
		}).toThrow();		
	});


	it('supports a simplified usage format using a simple plaintext password, rather than a full Base64 encode key', function() {
		openSecureStorage('test', password, function(store){
			expect(store).toBeDefined();

			var value = store.getItem('aValue');
			expect(value).toBeNull();			
		});

		var localStore = localStorage.getItem('secureStore_test');
		expect(localStore).toBeDefined();
	});


	it('automatically deletes expired stores', function() {
		//expect('Not Implemented').toBeNull();
	});		
})
