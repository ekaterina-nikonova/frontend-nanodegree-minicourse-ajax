
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var city = $('#city').val();
    $greeting.text('So, you want to live in ' + city + '…');
    var street = $('#street').val() + ',';
    var x = window.innerWidth;
    var y = window.innerHeight;
    var ratio = x / y;
    var size = (ratio > 1 ? '640x' + (y / ratio).toFixed() : (x * ratio).toFixed() + 'x640');
    var bgURL = 'https://maps.googleapis.com/maps/api/streetview?size=' + size + '\&location=' + street + city + '\&key=' + 'AIzaSyBtOUfJH4SO413c8B-ONrQV-_di7h53Aic';
    // var bgCSS = 'background-image: url(\"' + bgURL + '\")';
    // $body.attr('style', bgCSS);
    $body.append('\<img class=\"bgimg\" src=\"' + bgURL + '\"\>');

    //Load NYT articles
    var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nytURL += '?' + $.param({
      'api-key': '1ea30f0c8fa64fba84be76e2928989a5',
      'q': city
    });

    $.getJSON(nytURL, function(result){
      console.log(result);
      $nytHeaderElem.text ('New York Times articles about ' + city);
      result.response.docs.forEach(function(doc) {
        var articleHeader = '<h3><a href=\"' + doc.web_url + '\">' + doc.headline.main + '<\/a><\/h3>';
        var articleBody = '<p>' + doc.snippet + '<\/p>';
        var articlePic = '';
        if (doc.multimedia.length > 0) {
          var picIndex = doc.multimedia.length - 1;
          articlePic = '<li class="article"><img class=\"article-img\" src=\"http:\/\/www.nytimes.com\/' + doc.multimedia[picIndex].url + '\">';
        }
        $nytElem.append(articlePic + articleHeader + '\n' + articleBody);
      });
    }).fail(function() {
      $nytHeaderElem.text ('Cannot show New York Times articles about ' + city);
    });

    //Load Wikipedia links
    var wikiURL = 'http:\/\/en.wikipedia.org\/w\/api.php';
    $.ajax({
      url: wikiURL,
      data: {
        action: 'opensearch',
        search: city,
        format: 'json',
        callback: 'wikiCallback'
      },
      datatype: 'jsonp',
      success: function(data) {
        console.log(data);
      }
    });

    return false;
}

$('#form-container').submit(loadData);
