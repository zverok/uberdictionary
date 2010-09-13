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
    isEmpty: function(el){return false;} // !el.find('form#translation').parent().children('table').size() == 0}
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

UrbanDictionary = {
    title: 'UrbanDictionary',
    urlPattern: 'http://www.urbandictionary.com/define.php?term=%s',
    extractContent: function(el){
        return el.html(); //.find('#content #entries').html();
    },
    isEmpty: function(el){return el.find('#content #entries').size() == 0}
}
