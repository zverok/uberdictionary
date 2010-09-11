YQL = {
    query: function(url, params, callback){
        var query = 'select * from html where url="' + url + '" and xpath="*"' + (params.charset ? ' and charset="'+ params.charset + '"' : '');
        var yql = 'http://query.yahooapis.com/v1/public/yql?callback=?&format=xml&q='+escape(query);
        var success = function(cb){
            return function(data){
                if (cb) {
                    cb.call(data.results[0].
                            replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                    );
                }
                
            }
        }(callback);
        $.getJSON(yql, callback);
    }
}
