let storage = {
    localStoreSupport: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    },
    set: function(name,value,days=365) {
        if( this.localStoreSupport() ) {
            localStorage.setItem(name, value);
        }
        else {
            let date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            let expires = "; expires="+date.toGMTString();
            document.cookie = name+"="+value+expires+"; path=/";
        }
    },
    get: function(name) {
        if( this.localStoreSupport() ) {
            var ret = localStorage.getItem(name);
            //console.log(typeof ret);
            switch (ret) {
              case 'true': 
                  return true;
              case 'false':
                  return false;
              default:
                  return ret;
            }
        }
        else {
            // cookie fallback
            /*
             * after adding a cookie like
             * >> document.cookie = "bar=test; expires=Thu, 14 Jun 2018 13:05:38 GMT; path=/"
             * the value of document.cookie may look like
             * >> "foo=value; bar=test"
             */
            var nameEQ = name + "=";  // what we are looking for
            var ca = document.cookie.split(';');  // split into separate cookies
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];  // the current cookie
                while (c.charAt(0)==' ') c = c.substring(1,c.length);  // remove leading spaces
                if (c.indexOf(nameEQ) == 0) {  // if it is the searched cookie
                    var retCookie = c.substring(nameEQ.length,c.length);
                    // making "true" and "false" a boolean again.
                    switch (retCookie) {
                      case 'true':
                          return true;
                      case 'false':
                          return false;
                      default:
                          return retCookie;
                    }
                }
            }
            return null; // no cookie found
        }
    },
    del: function(name) {
        if( this.localStoreSupport() ) {
            localStorage.removeItem(name);
        }
        else {
            this.set(name,"",-1);
        }
    }
}
export default storage