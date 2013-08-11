/**
 * Pure JS implementation of SecureStorage API
 * as proposed by http://www.nczonline.net/blog/2010/04/13/towards-more-secure-client-side-data-storage/
 */
(function (global) {

	global.Cypher = global.Cypher || {};
	global.Cypher.AES_128 = global.Cypher.AES_128 || {
		encrypt: function (item, secureKey)
		{
			return item;
		},
		decrypt: function (item, secureKey)
		{
			return item;
		}
	};


	if (!global.openSecureStorage)
	{
		global.openSecureStorage = function(storeName, cypher, secureKey, callBack)
		{
			// Open the Store
			var store = readStore(storeName, cypher, secureKey);

			if (!store)
				store = {};

			// Allow access to read/write
			callBack(new SecureStore(store));

			// Close the store
			writeStore(storeName, cypher, secureKey, store);
		};
	}



	function SecureStore(store)
	{
		this.getItem = function(key)
		{
			return store[key];
		};

		this.setItem = function(key, item)
		{
			store[key] = item; 
		};
	}



	/* PRIVATE */

	var SECURE_STORE_PREFIX = 'securedStore_';

	function readStore(storeName, cypher, secureKey)
	{
		var raw = localStorage[SECURE_STORE_PREFIX+storeName];

		if (raw)
			return JSON.parse( cypher.decrypt(raw, secureKey) );
		else
			return {};
	} 


	function writeStore(storeName, cypher, secureKey, store)
	{
		localStorage[SECURE_STORE_PREFIX+storeName] = cypher.encrypt(JSON.stringify(store), secureKey);
	}

}.call({}, this));




