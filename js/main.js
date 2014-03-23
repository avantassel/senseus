
$(document).ready(function() {

	$('.bottom .btn').on('click', function() {
		$('.bottom .btn').removeClass('active');
		$(this).addClass('active');

		var newData = $(this).text();
		$('#first').html(newData + ' <span class="glyphicon glyphicon-remove-sign"></span>');
		return false;
	});

	$('.big span').on('click', function() {
		$('.big span').removeClass('active');
		$(this).addClass('active');
		return false;
	});

});

var sensusApp = angular.module('senseus', ['ngRoute','ngTable']);

sensusApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'templates/home.html',
				controller  : 'homeController'
			});
	});

sensusApp.factory('MapService', function($http) {
  
  return {

    search: function (table,callback){
      var params = {format:'GeoJSON','q':'select * from '+table+' limit 10'};
      $http.get('http://senseus.cartodb.com/api/v2/sql/',{params: params}).then(function(response){
          //return results
          callback(response.data);
        }, function(response){
          //throw error
          console.log('Error',response);
        });
    }
};
});

sensusApp.controller('homeController', function($scope, MapService, ngTableParams) {	
	// http://developers.cartodb.com/documentation/cartodb-js.html
  var views = {
  	'age': {url:'http://senseus.cartodb.com/api/v2/viz/3f4fc986-b243-11e3-a13e-0e10bcd91c2b/viz.json', table: 'census'}
  	,'income': {url:'http://senseus.cartodb.com/api/v2/viz/2e84858a-b241-11e3-be2e-0e73339ffa50/viz.json', table: 'census'}
  	,'population': {url:'http://senseus.cartodb.com/api/v2/viz/a5f3a766-b243-11e3-9c07-0e10bcd91c2b/viz.json', table: 'census'}
  	,'edu': {url:'http://senseus.cartodb.com/api/v2/viz/c495a460-b23b-11e3-8f25-0e230854a1cb/viz.json', table: 'census'}
  }	;
  
  $scope.map = null, $scope.vis = null, $scope.results = null;

  function initView(view){

  	console.log('initView',view);
  	cartodb.createVis('map', views[view].url, {
            zoom: 9,
            legends: true,
            zoomControl: true
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
          $scope.map = vis.getNativeMap();
          $scope.vis = vis;

          // now, perform any operations you need
          // map.setZoom(3)
          // map.setCenter(new google.maps.Latlng(...))
        })
        .error(function(err) {
          console.log(err);
        });
        MapService.search(views[view].table,function(data){
          	loadTable(data.features);
          });
  }

  function loadTable(data){
		
		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10           // count per page
	    }, {
	        total: data.length, // length of data
	    });
		$scope.results = data;
  }

  $scope.changeView = function(view){
  
  	      // create layer and add to the map, then add some intera
          cartodb.createLayer($scope.map, views[view].url)
          .addTo($scope.map)
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

          MapService.search(views[view].table,function(data){
          	console.log(data.features);
          	loadTable(data.features);
          });
	}
	$scope.toggleView = function(){
		if($('.map').is(':hidden')){
			$('.list').hide();
			$('.map').show();
			$('#view .title').html('List View');
		} else {
			$('.map').hide();
			$('.list').show();
			$('#view .title').html('Map View');
		}

	}

  initView('income');
    
});