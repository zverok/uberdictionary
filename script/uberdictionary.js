Uberdictionary = {
    dictionaries: [Lingvo, Multitran, Wikipedia, GoogleTranslate, UrbanDictionary],
    
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
            if(target.size() == 0) return
            target.empty().html('<img src="media/loading.gif" />')
            YQL.query(url, {charset: dic.charset}, function(data){
                if(data.results.length > 0){
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
                }else{
                    target.html("[Перевод не найден]")
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

ULayout = {
    columns: [ ['Lingvo'], ['Multitran'], ['Wikipedia', 'GoogleTranslate'] ],
    
    makeLayout: function(table){
        var width = 100/ULayout.columns.length;
        table.empty().append('<tr></tr>');
        var row = table.find('tr');
        $.each(ULayout.columns, function(){
            var cell = $('<td width="' + width + '%"></td>');
            row.append(cell);
            $.each(this, function(){
                cell.
                    append('<h1>' + this + '</h1>').
                    append('<div id="' + this + '"></div>');
                
            })
        });
    }
}

$(document).ready(function(){
    ULayout.columns = UberSettings.layout
    ULayout.makeLayout($('table'));

    var m = document.location.search.match(/word=([^&]+)/);
    $('[name=word]').val(m ? m[1] : '');
    Uberdictionary.translate();
    $('form').submit(function(){
        Uberdictionary.translate();
        return false;
    });
    
    showdown = new Showdown.converter();
    
    $('#aboutDialog').dialog({autoOpen: false, modal: true, title: "О скрипте"})
    $('a#about').click(function(){
        $.get('./README.md', function(data){
            $('#aboutDialog').html(showdown.makeHtml(data))
            $('#aboutDialog').dialog('open')
        })
        return false;
    });
    
});
