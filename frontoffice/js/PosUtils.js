var Pos = Pos || {};

Pos.Utils = {
    GetLength: function (obj)
    {
        var key, count = 0;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                count++;
            }
        }
        return count;
    },

    IndexOfObjectInArrayCheckedById: function (array, obj)
    {
        if (array.length > 0) {
            var i = array.length;

            while (i--) {
                if (
                    typeof (obj.Id) !== "undefined" &&
                    typeof (array[i].Id) !== "undefined" &&
                    array[i].Id === obj.Id
                    )
                {
                    return i;
                }
            }
        }

        return -1;
    },

    IndexOfIdInArray: function (array, id)
    {
        if (array.length > 0) {
            var i = array.length;

            while (i--) {
                if (
                    typeof (id) !== "undefined" &&
                    typeof (array[i].Id) !== "undefined" &&
                    array[i].Id === id
                    )
                {
                    return i;
                }
            }
        }

        return -1;
    },

    IsAnonymousCustomer: function(cid)
    {
        return cid === -1000000 || // FR-DZ
               cid === -1000001 || // FR
               cid === -1000002;   // EN
    },

    DecodeJwt : function(token)
    {
        try {
            var decoded = "niet";

            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            
            decoded = JSON.parse(window.atob(base64));

            return decoded;
        }
        catch(e){
            console.error("An error happened while decoding the token", e);
        }
    }
};