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
'ngAudio',
function ($scope, $timeout, ngAudio) {
  // init
  $scope.spins = 0;
  $scope.caffeine = 0;
  $scope.dollars = 100;

  $scope.slots = [1,2,3];
  $scope.disabled = false;
  $scope.alerts = [];
  $scope.prizes = [];
  $scope.currentPrize = null;

  $scope.pullSound = ngAudio.load('sounds/pull-lever.wav');
  $scope.winSound = ngAudio.load('sounds/win.mp3');
  $scope.loseSound = ngAudio.load('sounds/lose.mp3');
  $scope.brokeSound = ngAudio.load('sounds/broke.mp3');

  // TODO: factory
  $scope.prizeMap = {
    1: { // tea
      'name': 'tea',
      'caffeine': 45, // mg per 8 oz
      'image': 'images/tea-cup.png',
      1: 'images/tea-leaves.png',
      2: 'images/tea-strainer.png',
      3: 'images/tea-pot.png'
    },
    2: { // coffee
      'name': 'coffee',
      'caffeine': 85, // mg per 8 oz
      'image': 'images/coffee-cup.png',
      1: 'images/coffee-grounds.png',
      2: 'images/coffee-filters.png',
      3: 'images/coffee-maker.png'
    },
    3: { // espresso
      'name': 'espresso',
      'caffeine': 125, // mg per 2 oz
      'image': 'images/espresso-cup.png',
      1: 'images/bustelo-brick.png',
      2: 'images/espresso-tamper.png',
      3: 'images/espresso-machine.png'
    },
  };

  $scope.spin = function() {

    // clear alerts
    $scope.alerts = [];

    // clear prize
    $scope.currentPrize = null;

    // do you have money?
    if($scope.dollars > 0) {

      // play sound
      $scope.pullSound.play();

      // increment spins
      $scope.spins++;

      // decrement dollars
      $scope.dollars--;

      // disable button
      $scope.disabled = true;

      // spin
      angular.forEach($scope.slots, function(slot, i) {
        $scope.slots[i] = randomNumber(1, 3);
      });

      // delay for effect
      $timeout(function(){

        // did you win?
        if(allMatch($scope.slots)) {

          // get index
          var n = $scope.slots[0];

          // get prize drink
          $scope.currentPrize = $scope.prizeMap[n];

          // calculate prize money
          var money = n * 3;
          
          // award prize money
          $scope.dollars = $scope.dollars + money;

          // caffeine intake
          $scope.caffeine = $scope.caffeine + $scope.currentPrize.caffeine;

          // push alert
          $scope.alerts.push({ 
            type: 'success', 
            message: 'You won $'+money+' and a cup of '+ $scope.currentPrize.name + '!' 
          });

          // play sound
          $scope.winSound.play();

        } else {

          // push alert
          $scope.alerts.push({ 
            type: 'warning', 
            message: 'Not this time. Try again!' 
          });

          // play sound
          $scope.loseSound.play();
        }
        // enable button
        $scope.disabled = false;

      }, 500);

    } else {
      // push alert
      $scope.alerts.push({ 
        type: 'danger', 
        message: 'You are out of money!' 
      });

      // play sound
      $scope.brokeSound.play();
    }
  };

  // some helpers
  var randomNumber = function(start, finish) {
    return Math.floor((Math.random()*finish)+start);
  };

  var allMatch = function(array){
    return !!array.reduce(function(a, b){ 
      return (a === b) ? a : NaN; 
    });
  };

}]);
