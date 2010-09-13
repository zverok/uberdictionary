Lingvo = {
    title: 'Lingvo',
    urlPattern: 'http://lingvo.abbyyonline.com/ru/en-ru/%s',
    extractContent: function(el){
        return el.find('div#trans .lol-cards').html();
    },
    isEmpty: function(el){return el.find('div#trans .lol-cards').size() == 0}
}

Multitran = {
    title: 'Multitran',
    urlPattern: 'http://multitran.ru/c/m.exe?s=%s',
    charset: 'windows-1251',
    
    extractContent: function(el){
        return el.find('form#translation').parent().children('table').html();
    },
    isEmpty: function(el){return !el.find('form#translation').parent().children('table').size() == 0}
}

Wikipedia = {
    title: 'Wikipedia',
    urlPattern: 'http://en.wikipedia.org/wiki/%s',
    
    extractContent: function(el){
        return "<h1>" + el.find('#content > h1').html() + "</h1><p>" + el.find('#bodyContent > p').html() + "</p>" +
            Wikipedia.extractTranslation(el);
    },
    
    extractTranslation: function(el){
        var t = el.find("li.interwiki-ru a").attr('title');
        if(t)
            return "<p><b>Перевод</b>:" + t + "</p>"
        else
            return '';
    },
    
    isEmpty: function(el){return el.find('#bodyContent > p').size() == 0;}
}

GoogleTranslate = {
    title: 'GoogleTranslate',
    urlPattern: 'http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q=%s&langpair=en%7Cru',
    kind: 'json',
    extractContent: function(json){
        return json.responseData.translatedText;
    }
}

Uberdictionary = {
    dictionaries: [Lingvo, Multitran, Wikipedia, GoogleTranslate],
    
    translate: function(){
        var word = $('[name=word]').val();
        $('[name=word]').focus();
        $('[name=word]').select();
        if(word.length == 0) return;
        $('title').text(word + " ← überdictionary")
        $.each(Uberdictionary.dictionaries, function(){
            var url = this.urlPattern.replace('%s', word);
            var dic = this;
            var target = $('#' + dic.title);
            target.empty().html('<img src="media/loading.gif" />')
            YQL.query(url, {charset: dic.charset}, function(data){
                var res = data.results[0].
                    replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '');
                if(dic.kind == 'json'){
                    var json = '(' + res.match(/(\{[\s\S]+\})/im)[1] + ')';
                    target.html(dic.extractContent(eval(json)));
                }else{
                    target.html(res.match(/<body.*?>([\s\S]+)<\/body>/im)[1]);
                    if(dic.isEmpty(target))
                        target.html("[Перевод не найден]")
                    else
                        target.html(Uberdictionary.cleanup(dic.extractContent(target)));
                }
            });
        });
    },
    
    cleanup: function(html){
        return html.
            replace(/<\/?a.*?>/mg, '').
            replace(/<img.*?>/mg, '');
    }
}

$(document).ready(function(){
    var m = document.location.search.match(/word=([^&]+)/);
    $('[name=word]').val(m ? m[1] : '');
    Uberdictionary.translate();
    $('form').submit(function(){
        Uberdictionary.translate();
        return false;
    });
});
