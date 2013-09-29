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