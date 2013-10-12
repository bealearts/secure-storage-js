/**
 * Pure JS implementation of SecureStorage API
 * as proposed by http://www.nczonline.net/blog/2010/04/13/towards-more-secure-client-side-data-storage/
 */

/* Cyphers */
global.AES_128 = 'AES_128';

global.AES_192 = 'AES_192';

global.AES_256 = 'AES_256';


if (!global.openSecureStorage)
{
	global.openSecureStorage = function(storeName, cypher, key, callBack)
	{
		var secureKey;
		if (arguments.length === 4)
		{
			secureKey = sjcl.codec.base64.toBits(key);
		}
		else if (arguments.length === 3)
		{
			secureKey = cypher;
			callBack = key;
			cypher = global.AES_256;
		}
		else
		{
			throw new Error('Expects either 4 or 3 argumetns. Got ' + arguments.length);
		}

		// Simulate Async. If waiting on a lock than will really be async!
		setTimeout(lock(storeName, function() {
			openStore(storeName, cypher, secureKey, callBack);
		}, 0), 1);
	};



	global.removeSecureStorage = function(storeName)
	{

		lock(storeName, function() {		
			removeStore(storeName);
		});	
	};


	// Setup expired checker
	global.addEventListener('load', setTimeout(checkExpired, 10000), false);
}



/* PRIVATE */

var SECURE_STORE_PREFIX = 'securedStore_';

var SECURE_STORE_LOCK_POSTFIX = '_locked';

var SECURE_STORE_EXPIRES_MAP_POSTFIX = 'expires_map';


function openStore(storeName, cypher, key, callBack)
{		

	if (storeName === SECURE_STORE_EXPIRES_MAP_POSTFIX)
	{
		throw new Error('Store name "' + SECURE_STORE_EXPIRES_MAP_POSTFIX + '" is reserved');
	}

	var expires = readExpires(storeName);

	// if expired, remove the store
	var now = new Date();
	if (expires && expires < now)
	{
		removeStore(storeName);
	}

	// Open the Store
	var store = readStore(storeName, cypher, key);

	if (!store)
	{
		store = {};
	}

	// Allow access to read/write items
	try
	{
		callBack(new SecureStore(store, function(value) {
			expires = value;
		} ));
	}
	catch (error)
	{
		console.log(error);
	}
	finally
	{
		// Close the store
		writeStore(storeName, cypher, key, store);
		updateExpires(storeName, expires);
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
	{
		return {};
	}
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


function readExpires(storeName)
{
	var expiresMap;
	try
	{
		expiresMap = JSON.parse(localStorage.getItem(SECURE_STORE_PREFIX + SECURE_STORE_EXPIRES_MAP_POSTFIX));
	}
	catch(error)
	{	
		expiresMap = null;
	}

	if (expiresMap)
	{
		if (expiresMap.hasOwnProperty(storeName))
		{
			return new Date(expiresMap[storeName]);
		}
	}

	return null;
}


function updateExpires(storeName, expires)
{
	var expiresMap;
	try
	{
		expiresMap = JSON.parse(localStorage.getItem(SECURE_STORE_PREFIX + SECURE_STORE_EXPIRES_MAP_POSTFIX));
	}
	catch(error)
	{	
		expiresMap = null;
	}

	if (expires)
	{
		if (!expiresMap)
		{
			expiresMap = {};
		}

		expiresMap[storeName] = expires.getTime();

		localStorage.setItem(SECURE_STORE_PREFIX + SECURE_STORE_EXPIRES_MAP_POSTFIX, JSON.stringify(expiresMap));
	}
	else
	{
		if (expiresMap)
		{
			delete expiresMap[storeName];

			localStorage.setItem(SECURE_STORE_PREFIX + SECURE_STORE_EXPIRES_MAP_POSTFIX, JSON.stringify(expiresMap));
		}	
	}
}


function checkExpired()
{
	var expiresMap;
	try
	{
		expiresMap = JSON.parse(localStorage.getItem(SECURE_STORE_PREFIX + SECURE_STORE_EXPIRES_MAP_POSTFIX));
	}
	catch(error)
	{	
		expiresMap = null;
	}

	if (expiresMap)
	{
		var now = new Date();
		for (var storeName in expiresMap)
		{
			if (expiresMap.hasOwnProperty(storeName))
			{
				if (expiresMap[storeName] && expiresMap[storeName] < now)
				{
					delete expiresMap[storeName];	
				}	
			}
		}

		localStorage.setItem(SECURE_STORE_PREFIX + SECURE_STORE_EXPIRES_MAP_POSTFIX, JSON.stringify(expiresMap));
	}
}

