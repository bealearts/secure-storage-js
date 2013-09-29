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
		var previous = store[key];

		store[key] = JSON.stringify(item);

		if (!previous)
			items++; 
	};


	this.removeItem = function(key)
	{
		delete store[key];
		items--;
	}	


	Object.defineProperty(this, 'length', {
		get: function () { return items }
	});
	

	this.clear = function()
	{
		store = {};
		items = 0;
	}


	this.key = function(index) 
	{
		var count = 0;
		for (var key in store)
		{
			if (count == index)
				return key;

			count++;
		}

		return null;
	}


	this.setExpiration = function(value)
	{
		expires = value;
	}



	/* PRIVATE */

	var items = 0;

	var expires = null;

	// Count items
	for (var key in store)
	{
		if (store.hasOwnProperty(key))
			items++;
	}

	Object.freeze(this);
}