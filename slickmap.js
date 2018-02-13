(function(window){
/*
 * 簡易型 slickmap 資料結構 
 */
var slickmap = {};
/*
 *  input: text 
 *      eg. 
 *         """
 *         root
 *         * level1 content # http://level1_url
 *         ** level2 content # http://level2_url
 *         * second level1 content # http://second_level1_url
 *         ** second level2 content # http://second_level2_url
 *         """
 *  output: dict
 *      
 *          {
 *              "content": "root",
 *              "url": "",
 *              "childrens": [
 *                  {
 *                      "content": "level1 content",
 *                      "url": "http://level1_url",
 *                      "childrens": [
 *                          {
 *                              "content": "level2_content",
 *                              "url": "http://level1_url",
 *                              "childrens": []
 *                          }
 *                      ]
 *                  },
 *                  {
 *                      "content": "second level1 content",
 *                      "url": "http://secnod_level1_url",
 *                      "childrens": [
 *                          {
 *                              "content": "secont level2_content",
 *                              "url": "http://second_level1_url",
 *                              "childrens": []
 *                          }
 *                      ]
 *                  }
 *              ]
 *          }
 *      
 */
slickmap.parse = function (text, level=1){
    console.log("---<" + text + ">---"+level);
    var pattern = RegExp('\\n\\*{' + level + '}(?=[^*])');
    var data = text.split(pattern);
    
    var info_data = data[0].split('#');
    var info = {}
    info['content'] = info_data[0];
    info['url'] = info_data[1] || "#";

    var childrens = [];
    for(var i=1;i<data.length;i++){
        childrens.push(slickmap.parse(data[i], level+1));
    }
    info['childrens'] = childrens;
    return info;
}
slickmap.render = function (source){
    var level1_col =source['childrens'].length;
    var html = '<ul class="slickmap col' + level1_col +'">';
    html += slickmap.render_tree(source)
    html += '</ul>';
    return html;
}

slickmap.render_tree = function(source, st=true){
    var html = "";
    if(st){
        html += '<li class="root"><a href="'+ source['url'] +'">' + source['content'] + '</a></li>';
        st=false;
    }else{
        if(source['childrens'].length){
            html += '<li class="hasMore"><a href="'+ source['url'] +'">' + source['content'] + '</a>';
            html += "<ul>";
        }else{
            html += '<li><a href="'+ source['url'] +'">' + source['content'] + '</a>';
        }
    }
    for(var i=0;i<source['childrens'].length;i++){
        html += slickmap.render_tree(source['childrens'][i], st);
    }
    
    if(!st){
        if(source['childrens'].length){
            html += "</ul>";
        }
        html += "</li>";
    }

    return html;
}

window.slickmap = slickmap;
})(window);
