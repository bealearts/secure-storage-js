"use strict"; 

/**
 * Pure JS implementation of SecureStorage API
 * as proposed by http://www.nczonline.net/blog/2010/04/13/towards-more-secure-client-side-data-storage/
 */
(function (global) {

	/* Cyphers */
	global.AES_128 = 'AES_128';

	global.AES_192 = 'AES_192';

	global.AES_256 = 'AES_256';


	if (!global.openSecureStorage)
	{
		global.openSecureStorage = function(storeName, cypher, key, callBack)
		{
			// Simulate Async. If waiting on a lock than will really be async!
			setTimeout(lock(storeName, function() {
				openStore(storeName, cypher, key, callBack)
			}, 0), 1);
		};



		global.removeSecureStorage = function(storeName)
		{

			lock(storeName, function() {
			
				removeStore(storeName);
			});	
		}
	}


	function SecureStore(store)
	{
		this.getItem = function(key)
		{
			var raw = store[key];
			
			if (raw)	
				return JSON.parse(raw);
			else
				return null;
		};

		this.setItem = function(key, item)
		{
			store[key] = JSON.stringify(item); 
		};
	
		this.removeItem = function(key)
		{
			delete store[item];
		}	

		
		/* PRIVATE */
	
		var items = 0;
	}



	/* PRIVATE */

	var SECURE_STORE_PREFIX = 'securedStore_';

	var SECURE_STORE_LOCK_POSTFIX = '_locked';


	function openStore(storeName, cypher, key, callBack)
	{		
		var secureKey = sjcl.codec.base64.toBits(key);

		// Open the Store
		var store = readStore(storeName, cypher, secureKey);

		if (!store)
			store = {};

		// Allow access to read/write items
		try
		{
			callBack(new SecureStore(store));
		}
		catch (error)
		{
			console.log(error)
		}
		finally
		{
			// Close the store
			writeStore(storeName, cypher, secureKey, store);
		}		
	}


	function removeStore(storeName)
	{
		localStorage.removeItem(SECURE_STORE_PREFIX+storeName);	
	}


	function readStore(storeName, cypher, secureKey)
	{
		var raw = localStorage.getItem(SECURE_STORE_PREFIX+storeName);

		var cypherParts = cypher.split('_');
		var params = {};
		params.cipher = cypherParts[0].toLowerCase();
		params.ks = +cypherParts[1];

		if (raw)
		{
			try
			{
				return JSON.parse( sjcl.decrypt(secureKey, raw, params) );
			}	
			catch (error)
			{
				throw new Error('Could not decrypt store "' + storeName + '"');
			}
		}
		else
			return {};
	} 


	function writeStore(storeName, cypher, secureKey, store)
	{
		var cypherParts = cypher.split('_');
		var params = {};
		params.cipher = cypherParts[0].toLowerCase();
		params.ks = +cypherParts[1];

		localStorage.setItem(SECURE_STORE_PREFIX+storeName, sjcl.encrypt(secureKey, JSON.stringify(store), params));
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


}(this));




