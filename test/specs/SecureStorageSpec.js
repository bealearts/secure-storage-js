
require('../bower_components/cryptico/cryptico.js');
require('../src/secure-storage.js');

describe('The Secure Storage API', function() {
	
	var key = '';	
	
	beforeEach(function(){
		key = sha256.hex('somepassword');	
	});	
	
	it('can create a Secure Store', function() {
		openSecureStorage('test', AES_256, key, function(store){
					
		});
	});	
	
	it('can open an existing Secure Store', function() {
		openSecureStorage('test')			
	});	

	it('can remove a Secure Store', function() {
	
	});	
})