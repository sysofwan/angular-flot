angular.module('sysofwan.angular-flot', []).directive('flot', function($rootScope) {
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      dataset: '=',
      options: '=',
      callback: '=',
      plotclick: '=',
      plothover: '='
    },
    link: function(scope, element, attributes) {
      var height, init, onDatasetChanged, onOptionsChanged, plot, plotArea, width;

      plot = null;
      width = attributes.width || '100%';
      height = attributes.height || '100%';
      if (!scope.dataset) {
        scope.dataset = [];
      }

      if (!scope.options) {
        scope.options = {
          legend: {
            show: false
          }
        };
      }

      plotArea = $(element.children()[0]);
      plotArea.css({
        width: width,
        height: height
      });

      var addGridEventListener = function(eventName, eventEnableKey, callback) {
        if (!scope.options.grid) {
          scope.options.grid = {};
        }
        scope.options.grid[eventEnableKey] = true;
        plotArea.on(eventName, function(event, pos, item) {
          $rootScope.$apply(function() {
            callback(event, pos, item);
          });
        });
      };

      init = function() {
        var plotObj;
        plotObj = $.plot(plotArea, scope.dataset, scope.options);
        if (scope.callback) {
          scope.callback(plotObj);
        }
        return plotObj;
      };

      onDatasetChanged = function(newDataset, oldDataset) {
        if (newDataset === oldDataset) return;
        if (plot) {
          plot.setData(newDataset);
          plot.setupGrid();
          plot.draw();
        } else {
          plot = init();
        }
      };

      onOptionsChanged = function() {
        plot = init();
      };

      var onClickChange = function(listener) {
        if (listener) {
          addGridEventListener('plotclick', 'clickable', scope.plotclick);
        }
      };

      var onHoverChange = function(listener) {
        if (listener) {
          addGridEventListener('plothover', 'hoverable', scope.plothover);
        }
      };

      scope.$watch('options', onOptionsChanged, true);
      scope.$watch('dataset', onDatasetChanged, true);
      scope.$watch('plotclick', onClickChange);
      scope.$watch('plothover', onHoverChange);
    }
  };
});