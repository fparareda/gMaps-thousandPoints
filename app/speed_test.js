/**
 * @fileoverview This demo is used for MarkerClusterer. It will show 100 markers
 * using MarkerClusterer and count the time to show the difference between using
 * MarkerClusterer and without MarkerClusterer.
 * @author Luke Mahe (v2 author: Xiaoxi Wu)
 */

function $(element) {
  return document.getElementById(element);
}

var speedTest = {};

speedTest.pics = null;
speedTest.map = null;
speedTest.markerClusterer = null;
speedTest.markers = [];
speedTest.infoWindow = null;

speedTest.init = function() {
  var latlng = new google.maps.LatLng(39.91, 116.38);
  var options = {
    'zoom': 2,
    'center': latlng,
    'mapTypeId': google.maps.MapTypeId.ROADMAP
  };

  speedTest.map = new google.maps.Map($('map'), options);
  speedTest.pics = data.photos;

  var numMarkers = document.getElementById('nummarkers');
  google.maps.event.addDomListener(numMarkers, 'change', speedTest.change);

  speedTest.infoWindow = new google.maps.InfoWindow();

  speedTest.showMarkers();
};

speedTest.showMarkers = function() {
  speedTest.markers = [];

  var type = 1;

  if (speedTest.markerClusterer) {
    speedTest.markerClusterer.clearMarkers();
  }

  var panel = $('markerlist');
  panel.innerHTML = '';

  var numMarkers = $('nummarkers').value;
  loadRandomPoints(numMarkers);
  loadPointsFromJson(numMarkers);
  window.setTimeout(speedTest.time, 0);
};

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function loadRandomPoints(numMarkers){
    for (var i = 0; i < numMarkers; i++) {
        var latitude = getRandomInRange(-90, 90, 3);
        var longitude = getRandomInRange(-180, 180, 3);
        var latLng = new google.maps.LatLng(latitude, longitude);
        var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png';
        var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(24, 32));
        var marker = new google.maps.Marker({'position': latLng, 'icon': markerImage});
        speedTest.markers.push(marker);
    }
}

function loadPointsFromJson(numMarkers){
    for (var i = 0; i < numMarkers; i++) {
      if(speedTest.pics[i]){
        /*var titleText = speedTest.pics[i].photo_title;
        if (titleText === '') {
            titleText = 'No title';
        }

        var item = document.createElement('DIV');
        var title = document.createElement('A');
        title.href = '#';
        title.className = 'title';
        title.innerHTML = titleText;

        item.appendChild(title);
        panel.appendChild(item);*/

        var latLng = new google.maps.LatLng(speedTest.pics[i].latitude, speedTest.pics[i].longitude);

        var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=' +
            'FFFFFF,008CFF,000000&ext=.png';
        var markerImage = new google.maps.MarkerImage(imageUrl,
            new google.maps.Size(24, 32));

        var marker = new google.maps.Marker({
          'position': latLng
            //,'icon': markerImage
        });

        var fn = speedTest.markerClickFunction(speedTest.pics[i], latLng);
        google.maps.event.addListener(marker, 'click', fn);
        // google.maps.event.addDomListener(title, 'click', fn);
        speedTest.markers.push(marker);
      } else { titleText = 'No title' }
    }
}

speedTest.markerClickFunction = function(pic, latlng) {
  return function(e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    var title = pic.photo_title;
    var url = pic.photo_url;
    var fileurl = pic.photo_file_url;

    var infoHtml = '<div class="info"><h3>' + title +
      '</h3><div class="info-body">' +
      '<a href="' + url + '" target="_blank"><img src="' +
      fileurl + '" class="info-img"/></a></div>' +
      '<a href="http://www.panoramio.com/" target="_blank">' +
      '<img src="http://maps.google.com/intl/en_ALL/mapfiles/' +
      'iw_panoramio.png"/></a><br/>' +
      '<a href="' + pic.owner_url + '" target="_blank">' + pic.owner_name +
      '</a></div></div>';

    speedTest.infoWindow.setContent(infoHtml);
    speedTest.infoWindow.setPosition(latlng);
    speedTest.infoWindow.open(speedTest.map);
  };
};

speedTest.clear = function() {
  $('timetaken').innerHTML = 'cleaning...';
  for (var i = 0, marker; marker = speedTest.markers[i]; i++) {
    marker.setMap(null);
  }
};

speedTest.change = function() {
  speedTest.clear();
  speedTest.showMarkers();
};

speedTest.time = function() {
  $('timetaken').innerHTML = 'timing...';
  var start = new Date();
  for (var i = 0, marker; marker = speedTest.markers[i]; i++) {
    marker.setMap(speedTest.map);
  }

  var end = new Date();
  $('timetaken').innerHTML = end - start;
};
