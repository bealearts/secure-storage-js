/**
 * Pure JS implementation of SecureStorage API
 * as proposed by http://www.nczonline.net/blog/2010/04/13/towards-more-secure-client-side-data-storage/
 */
(function (global) {

	global.Cypher = global.Cypher || {};
	
	global.Cypher.AES_128 = global.Cypher.AES_128 || {
		convertKey: function(key)
		{
			return cryptico.string2bytes(key).slice(0, 16);
		},
		encrypt: function (plainText, secureKey)
		{
			return cryptico.encryptAESCBC(plainText, secureKey);
		},
		decrypt: function (encryptedText, secureKey)
		{
			return cryptico.decryptAESCBC(encryptedText, secureKey);
		}
	};

	global.Cypher.AES_192 = global.Cypher.AES_192 || {
		convertKey: function(key)
		{
			return cryptico.string2bytes(key).slice(0, 24);
		},
		encrypt: function (plainText, secureKey)
		{
			return cryptico.encryptAESCBC(plainText, secureKey);
		},
		decrypt: function (encryptedText, secureKey)
		{
			return cryptico.decryptAESCBC(encryptedText, secureKey);
		}
	};

	global.Cypher.AES_256 = global.Cypher.AES_256 || {
		convertKey: function(key)
		{
			return cryptico.string2bytes(key).slice(0, 32);
		},
		encrypt: function (plainText, secureKey)
		{
			return cryptico.encryptAESCBC(plainText, secureKey);
		},
		decrypt: function (encryptedText, secureKey)
		{
			return cryptico.decryptAESCBC(encryptedText, secureKey);
		}
	};


	if (!global.openSecureStorage)
	{
		global.openSecureStorage = function(storeName, cypher, key, callBack)
		{
			// Simulate Async. If waiting on a lock than will really be async!
			setTimeout(lock(storeName, function() {
				openStore(storeName, cypher, key, callBack)
			}, 0), 1);
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

	var SECURE_STORE_LOCK_POSTFIX = '_locked';


	function openStore(storeName, cypher, key, callBack)
	{		
		var secureKey = cypher.convertKey(key);

		// Open the Store
		var store = readStore(storeName, cypher, secureKey);

		if (!store)
			store = {};

		// Allow access to read/write items
		callBack(new SecureStore(store));

		// Close the store
		writeStore(storeName, cypher, secureKey, store);
	}


	function readStore(storeName, cypher, secureKey)
	{
		var raw = localStorage.getItem(SECURE_STORE_PREFIX+storeName);

		if (raw)
			try
			{
				return JSON.parse( cypher.decrypt(raw, secureKey) );
			}	
			catch (error)
			{
				throw new Error('Could not decrypt store "' + storeName + '"');
			}
		else
			return {};
	} 


	function writeStore(storeName, cypher, secureKey, store)
	{
		localStorage.setItem(SECURE_STORE_PREFIX+storeName, cypher.encrypt(JSON.stringify(store), secureKey));
	}


	/**
	 * Lock to Syncronise access to localStorage
	 */
	function lock(storeName, callBack, tries)
	{
		var lockName = SECURE_STORE_PREFIX+storeName+SECURE_STORE_LOCK_POSTFIX;

		if (localStorage.getItem(lockName))
		{
			if (tries > 100)
			{
				localStorage.removeItem(lockName);
				throw new Error('Unable to establish a lock on "' + storeName + '"');
			}

			// wait on the lock
			setTimeout(function() {
				lock(storeName, callBack, ++tries);	
			}, 100);
		}
		else
		{
			localStorage.setItem(lockName, 'true');
			callBack();
			localStorage.removeItem(lockName);	
		}
	}


}.call({}, this));




