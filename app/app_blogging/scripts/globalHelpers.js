/*global define*/

'use strict';

var config = require('./appConfig');

var helpers = function() {

    return {

        startLogger: function(){
            $(document).on({
                ajaxError: this.logApiError,
                ajaxSuccess: this.logApiSuccess
            });
        },

        logApiSuccess: function(e, xhr, ajax){
            console.debug('========== API SUCCESS ==========\n');
            console.log( ajax.type + ' ' + ajax.url );
            try {
                console.log( JSON.parse( xhr.responseText ) );
            } catch (e) {}
            console.debug('=================================');
        },

        logApiError: function(event, jqXHR, textStatus, errorThrown) {
            var excp;
            switch (jqXHR.status) {
            case 400:
                // catching parseJSON errors
                try {
                    excp = $.parseJSON(jqXHR.responseText).error;
                    console.error('========== API ERROR ==========\n');
                    console.error('UnableToComplyException:' + excp.message + ' warning');
                    console.error('===============================');
                } catch(e) { console.error(e); }
                break;
            case 500:
                try {
                    excp = $.parseJSON(jqXHR.responseText).error;
                    console.error('========== API ERROR ==========\n');
                    console.error('PanicException:' + excp.message + ' panic');
                    console.error('===============================');
                } catch(e) { console.error(e); }
                break;
            default:
                console.log('HTTP status=' + jqXHR.status + ',' + textStatus + ',' + errorThrown + ',' + jqXHR.responseText);
            }
        },

        capitalize : function(str){
            str = str === null ? '' : String(str);
            var first = str.charAt(0);
            var rest = str.slice(1);
            return first.toUpperCase() + rest.toLowerCase();
        },

        formatDate: function(date){
            var z = date.getTimezoneOffset();
            var zSign = ( z < 0 ) ? '+' : '-';
            var zHours = ( Math.floor( Math.abs(z)/60 ) < 10 ? '0' : '' ) + Math.floor( Math.abs(z)/60 );
            var zMinute = (( Math.abs(z)%60 < 10 ) ? '0' : '' ) + ( Math.abs(z)%60 );
            return date.toJSON().split('.')[0] + ':UTC' + zSign + zHours + ':' + zMinute;
        },

        toTwoDigit: function(num){
            return ( Math.floor(num) < 10 ? '0' : '' ) + Math.floor(num);
        },

        toTimeString: function(h,m){
            h = parseInt(h, 10);
            m = parseInt(m, 10);
            var hour,
                appendix;

            if ( h === 0 ) {
                hour = 12;
                appendix = 'AM';
            }
            else if ( h > 12 ) {
                hour = h - 12;
                appendix = 'PM';
            }
            else {
                hour = h;
                appendix = 'AM';
            }

            return hour + ':' + this.toTwoDigit(m) + ' ' + appendix;
        },

        millisecondsFromDate: function(date, msec) {
            date.setTime(date.getTime() + msec);
            return date;
        },

        millisecondsFromNow: function(msec) {
            return this.millisecondsFromDate( new Date(), msec );
        },

        toViewModel: function(hash) {
            var key;
            var newHash = {};
            for ( key in hash ) {
                var type = typeof hash[key];
                switch (type) {
                case 'string':
                    if ( hash[key] === 'true' ) {
                        newHash[key] = true;
                    }
                    else if ( hash[key] === 'false' ) {
                        newHash[key] = false;
                    }
                    else {
                        newHash[key] = hash[key];
                    }
                    break;
                case 'number':
                    newHash[key] = hash[key].toString();
                    break;
                default:
                    newHash[key] = hash[key];
                }

            }
            return newHash;
        },

        toPrettyTime: function(timeString) {
            try {
                var d = timeString.slice( 0, timeString.length -4 );
                return this.dateToPrettyTime(new Date(d));
            } catch (e) {
                return "";
            }
        },

        dateToPrettyTime: function(date) {
            return strftimeTZ( '%b %d %Y, %I:%M %P', date, 0 );
        },

        distanceBetween: function(lat1, lon1, lat2, lon2, miles) {

            // validate arguments
            for (var i = arguments.length - 2; i >= 0; i--) {
                if( typeof arguments[i] !== 'number' ){
                    return 0;
                }
                else if ( ( i === 0 || i === 2 ) && ( arguments[i] <= -90 || arguments[i] >= 90 ) ) {
                    return 0;
                }
                else if ( ( i === 1 || i === 3 ) && ( arguments[i] <= -180 || arguments[i] >= 180 ) ) {
                    return 0;
                }
            }

            var toRad = function(num) {
                return num * Math.PI / 180;
            };

            var R = 6371; // km
            var dLat = toRad(lat2-lat1);
            var dLon = toRad(lon2-lon1);
            lat1 = toRad(lat1);
            lat2 = toRad(lat2);

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            if (miles){
                return R * c * 0.621371;
            }
            return R * c;
        },

        parseQueryString: function(qs) {
            if (!qs) return;
            var result = {};
            var params = qs.split('&');

            _(params).each(function (param) {
                var pair = param.split('=');
                if (pair[1] === 'true' ) {
                    pair[1] = true;
                }
                else if (pair[1] === 'false') {
                    pair[1] = false;
                }
                result[pair[0]] = pair[1];
            });

            return result;
        },

        getErrorMessage: function(jqXHR, msg) {
            if (jqXHR && jqXHR.statusText === 'timeout') {
                return config.timeoutErrorMessage;
            } else if (jqXHR.responseText) {
                var excp = $.parseJSON(jqXHR.responseText).error;
                switch (excp.type) {
                    case 'unabletocomplyexception':
                        return excp.message;
                    break;
                    case 'panicexception':
                        return msg;
                    break;
                    default:
                }
            } else {
                return msg;
            }
        }

    };
};

module.exports = helpers;
