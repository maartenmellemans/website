'use strict';

/* Directives */
var myAppDirectives = angular.module('myApp.directives', []);

myAppDirectives.directive('svgGauss', function () {


    var width = 200,
        height = 10,
        padding = 5;

    var scaleX;
    var xAxis;
    var svg;
    var svgContainer;

    return {
        restrict: 'E',
        scope: {
            localAmount: "=amount",
        },

        link: function (scope, element, attrs) {

            svgContainer = d3.select(element[0]);

                var data = [scope.localAmount];

                svg = svgContainer.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                  .append("g");

                scaleX = d3.scale.linear()
                    .domain([0, 10])
                    .range([0+padding, width-padding]);

                xAxis = d3.svg.axis()
                    .scale(scaleX)
                    .orient("top")
                    .tickSize(10);

                console.log(scope.localAmount);

                svg.selectAll(".defaultBar")
                    .data(data)
                  .enter().append("rect")
                    .attr("class", "defaultBar")
                    .attr("x", padding)
                    .attr("y", 0)
                    .attr("height", 10)
                    .attr("width", function(d) {return scaleX(10)-padding})

                svg.selectAll(".bar")
                    .data(data)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", padding)
                    .attr("y", 0)
                    .attr("height", 10)
                    .attr("width", function(d) {return scaleX(d)-padding})
                    .attr("fill", function(d) {
                      if(d<5) {
                        return "#CC0000"
                      } else if(d<7) {
                        return "#FF6600"
                      } else {
                        return "#00CC00"
                      }
                    })


                
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0,10)")
                    .call(xAxis);
                    

        }
    }
})