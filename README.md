secure-storage-js [![Build Status](https://travis-ci.org/bealearts/secure-storage-js.png?branch=master)](https://travis-ci.org/bealearts/secure-storage-js)
=================
Pure JS implementation of SecureStorage API as proposed by http://www.nczonline.net/blog/2010/04/13/towards-more-secure-client-side-data-storage/

Example Usage
-------------

    openSecureStorage('myStore', AES_256, secureKey, function(store) {
		
		var counter = store.getItem('counter');

		if (counter)
			counter++;
		else
			counter = 1;

		store.setItem('counter', counter);
	});
