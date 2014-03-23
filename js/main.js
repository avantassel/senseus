function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ( $iframe.length ) {
        $iframe.attr('src',url);   
        return false;
    }
    return true;
}

$(document).ready(function() {

	$('.bottom .btn').on('click', function() {
		$('.bottom .btn').removeClass('active');
		$(this).addClass('active');

		var newData = $(this).text();
		$('#first').html(newData + ' <span class="glyphicon glyphicon-remove-sign"></span>');
	});

	$('.big span').on('click', function() {
		$('.big span').removeClass('active');
		$(this).addClass('active');
	});

});

var sensusApp = angular.module('senseus', ['ngRoute']);

sensusApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'templates/home.html',
				controller  : 'homeController'
			});
	});

sensusApp.controller('homeController', function($scope) {	
	// http://developers.cartodb.com/documentation/cartodb-js.html
  var views = {
  	'age': {url:'http://senseus.cartodb.com/api/v2/viz/3f4fc986-b243-11e3-a13e-0e10bcd91c2b/viz.json'}
  	,'income': {url:'http://senseus.cartodb.com/api/v2/viz/2e84858a-b241-11e3-be2e-0e73339ffa50/viz.json'}
  	,'population': {url:'http://senseus.cartodb.com/api/v2/viz/a5f3a766-b243-11e3-9c07-0e10bcd91c2b/viz.json'}
  	,'edu': {url:'http://senseus.cartodb.com/api/v2/viz/c495a460-b23b-11e3-8f25-0e230854a1cb/viz.json'}
  }	;
  
  var map = null, viz = null;

  function initView(view){

  	console.log('initView',view);
  	cartodb.createVis('map', views[view].url, {
            zoom: 9,
            legends: true
        })
        .done(function(vis, layers) {
          // layer 0 is the base layer, layer 1 is cartodb layer
          // setInteraction is disabled by default
          layers[1].setInteraction(true);
          // layers[1].on('featureOver', function(e, pos, latlng, data) {
          //   cartodb.log.log(e, pos, latlng, data);
          // });

          // you can get the native map to work with it
          // depending if you use google maps or leaflet
          map = vis.getNativeMap();
          viz = vis;

          // now, perform any operations you need
          // map.setZoom(3)
          // map.setCenter(new google.maps.Latlng(...))
        })
        .error(function(err) {
          console.log(err);
        });
  }

  $scope.changeView = function(view){
  
  	console.log('changeView');

  	var layers = viz.getLayers();
  	console.log('Layers',layers);

          // create layer and add to the map, then add some intera
          cartodb.createLayer(map, views[view].url)
          .addTo(map)
          .on('done', function(layer) {
            // var sublayer = layer.getSubLayer(0);
            // sublayer.on('featureOver', function(e, pos, latlng, data) {
            //   cartodb.log.log(e, pos, latlng, data);
            // });

            // sublayer.on('error', function(err) {
            //   cartodb.log.log('error: ' + err);
            // });

          })
          .on('error', function() {
            cartodb.log.log("some error occurred");
          });
	}

  initView('income');
    
});