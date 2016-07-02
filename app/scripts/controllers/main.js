'use strict';

/**
 * @ngdoc function
 * @name espressoSlotsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the espressoSlotsApp
 */
angular.module('espressoSlotsApp').controller('MainCtrl', [
'$scope',
'$timeout',
// '$window',
function ($scope, $timeout) {

  // init
  $scope.spins = 0;
  $scope.dollars = 100;

  $scope.slots = [1,2,3];
  //   { number: 1 },
  //   { number: 2 },
  //   { number: 3 },
  // ];
  $scope.disabled = false;
  $scope.alerts = [];
  
  $scope.spin = function() {

    // clear alerts
    $scope.alerts = [];

    if($scope.dollars > 0) {
      // increment spins
      $scope.spins++;

      // decrement dollars
      $scope.dollars--;

      // disable button
      $scope.disabled = true;

      // spin
      angular.forEach($scope.slots, function(slot, i) {
        $scope.slots[i] = randomNumber(1,3);
      });

      $timeout(function(){
        // did you win?
        if(allMatch($scope.slots)) {
          $scope.alerts.push({ 
            type: 'success', 
            message: 'You won $'+($scope.slots[0] * 3)+' and a '+ $scope.slots[0] + ' on spin '+ $scope.spins 
          });
          
          // prize money
          $scope.dollars = $scope.dollars + ($scope.slots[0] * 3);
        } else {
          $scope.alerts.push({ 
            type: 'warning', 
            message: 'Not this time. Try again!' 
          });
        }
        // enable button
        $scope.disabled = false;
      }, 500);
    } else {
      $scope.alerts.push({ 
        type: 'danger', 
        message: 'You are out of money!' 
      });
    }
  };

  var randomNumber = function(start, finish) {
    return Math.floor((Math.random()*finish)+start);
  };

  var allMatch = function(array){
    return !!array.reduce(function(a, b){ 
      return (a === b) ? a : NaN; 
    });
  };

}]);
