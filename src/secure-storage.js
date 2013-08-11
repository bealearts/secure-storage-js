/**
 * Pure JS implementation of SecureStorage API
 * as proposed by http://www.nczonline.net/blog/2010/04/13/towards-more-secure-client-side-data-storage/
 */
(function (global) {

	global.Cypher = global.Cypher || {};
	global.Cypher.AES_128 = global.Cypher.AES_128 || {
		encypt: function (item, secretKey)
		{
			return item;
		},
		decrypt: function (item, secretKey)
		{
			return item;
		}
	};


	if (!global.openSecureStorage)
	{
		global.openSecureStorage = function(storeName, cypher, secureKey, callBack)
		{
			callBack(new SecureStorage(storeName, cypher, secureKey));
		};
	}



	function SecureStore(storeName, cypher, secureKey)
	{
		this.getItem = function(key)
		{
			var store = readStore(storeName, cypher, secureKey);

			return store[key];
		};

		this.setItem = function(key, item)
		{
			var store = readStore(storeName, cypher, secureKey);

			if (!store)
				store = {};

				store[key] = item;

			writeStore(storeName, cypher, secureKey, store); 
		};
	}



	/* PRIVATE */

	var SECURE_STORE_PREFIX = 'securedStore_';

	function readStore(storeName, cypher, securityKey)
	{
		var raw - localStorage[SECURE_STORE_PREFIX+storeName];

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




