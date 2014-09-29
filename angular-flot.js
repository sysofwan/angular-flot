angular.module('sysofwan.angular-flot', []).directive('flot', function($rootScope) {
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      dataset: '=',
      options: '=',
      callback: '=',
      onclick: '=?',
      onhover: '=?'
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
          rootScope.$apply(callback);
        });
      };

      if (scope.onclick) {
        addGridEventListener('plotclick', 'clickable', scope.onclick);
      }

      if (scope.onhover) {
        addGridEventListener('plothover', 'hoverable', scope.onhover);
      }

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

      scope.$watch('options', onOptionsChanged, true);
      scope.$watch('dataset', onDatasetChanged, true);
    }
  };
});