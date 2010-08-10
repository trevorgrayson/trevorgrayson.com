window.location.querystring = (function() {
 
    // by Chris O'Brien, prettycode.org
 
    var collection = {};
 
    // Gets the query string, starts with '?'
 
    var querystring = window.location.search;
 
    // Empty if no query string
 
    if (!querystring) {
        return { toString: function() { return ""; } };
    }
 
    // Decode query string and remove '?'
 
    querystring = decodeURI(querystring.substring(1));
 
   // Load the key/values of the return collection
 
    var pairs = querystring.split("&");
 
    for (var i = 0; i < pairs.length; i++) {
 
        // Empty pair (e.g. ?key=val&&key2=val2)
 
        if (!pairs[i]) {
            continue;
        }
 
        // Don't use split("=") in case value has "=" in it
 
        var seperatorPosition = pairs[i].indexOf("=");
 
        if (seperatorPosition == -1) {
            collection[pairs[i]] = "";
        }
        else {
            collection[pairs[i].substring(0, seperatorPosition)] 
                = pairs[i].substr(seperatorPosition + 1);
        }
    }
 
    // toString() returns the key/value pairs concatenated
 
    collection.toString = function() {
        return "?" + querystring;
    };
 
    return collection;
})();