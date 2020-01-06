import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Provider as BusProvider, useBus, useListener } from 'react-bus';
import * as d3 from 'd3';
import * as _ from 'lodash';

class BarcodePlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objs: {
        mainDiv: null,
        chartDiv: null,
        g: null,
        xAxis: null,
        tooltip: null,
        brush: null
      },
      // passed or default chart settings
      settings: {
        axes: null,
        bottomLabel: null,
        brush: null,
        // brushing: false,
        chartDiv: null,
        // chartSize: { height: '200', width: '960' },
        // barcodeData: this.props.barcodeData || null,
        // enableBrush: this.props.settings.enableBrush || false,
        g: null,
        // height: this.props.settings.height || '',
        // highStat: this.props.settings.highStat || '',
        height: null,
        id: 'chart-barcode',
        // highLabel: this.props.settings.highLabel || '',
        // lowLabel: this.props.settings.lowLabel || '',
        // lineID: this.props.settings.lineID || '',
        // logFC: this.props.settings.logFC || '',
        mainDiv: null,
        // margin: { top: 65, right: 60, bottom: 75, left: 60 },
        margin: { top: 45, right: 25, bottom: 40, left: 20 },
        // statLabel: this.props.settings.statLabel || '',
        // statistic: this.props.settings.statistic || '',
        svg: null,
        title: '',
        tooltip: null
      },
      containerWidth: 0,
      // containerHeight: this.props.horizontalSplitPaneSize || 0,
      xAxis: null,
      xScale: null
    };
    this.barcodeChartRef = React.createRef();
    // this.prepareAndRender = this.prepareAndRender.bind(this);
  }

  componentDidMount() {
    let width = this.getWidth();
    this.setState({ containerWidth: width }, () => {
      this.prepareAndRender();
    });

    let resizedFn;
    window.addEventListener('resize', () => {
      clearTimeout(resizedFn);
      resizedFn = setTimeout(() => {
        this.redrawChart();
      }, 200);
    });
  }

  redrawChart() {
    let width = this.getWidth();
    d3.select('.BarcodeChartWrapper svg').remove();
    this.prepareAndRender(width);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      // this.props.barcodeSettings.brushing !==
      //   prevProps.barcodeSettings.brushing ||
      // this.props.barcodeSettings.brushedData !==
      //   prevProps.barcodeSettings.brushedData ||
      this.props.horizontalSplitPaneSize !== prevProps.horizontalSplitPaneSize
    ) {
      //let heightChangedFn;
      // clearTimeout(heightChangedFn);
      // heightChangedFn = setTimeout(() => {
      //   this.redrawChart();
      d3.select('.BarcodeChartWrapper svg').remove();
      this.prepareAndRender();
      // }, 1000);
    }
  }

  getWidth() {
    if (this.barcodeChartRef.current !== null) {
      return this.barcodeChartRef.current.parentElement.offsetWidth;
    } else return 1200;
  }

  prepareAndRender(newWidth) {
    const { settings, containerWidth } = this.state;
    const { barcodeSettings, horizontalSplitPaneSize } = this.props;
    const self = this;
    let calculatedWidth = newWidth !== undefined ? newWidth : containerWidth;
    // prepare settings
    let width = calculatedWidth - settings.margin.left - settings.margin.right;
    let height =
      horizontalSplitPaneSize - settings.margin.top - settings.margin.bottom;

    //Scale the range of the data
    let domain = d3
      .scaleLinear()
      .range([5, width - 5])
      .domain([
        0,
        d3.extent(barcodeSettings.barcodeData, function(d) {
          return d.statistic;
        })[1]
      ]);

    let xScale = d3
      .scaleLinear()
      .range([5, width - 5])
      .domain([0, barcodeSettings.highStat]);

    let xAxis = d3.axisBottom(xScale);

    // prepare chart
    let chartDiv = d3.select('#' + settings.id);
    let svg = chartDiv
      .append('svg')
      .attr('id', 'svg-' + settings.id)
      .attr('class', 'barcode-chart-area bcChart')
      .attr('width', width)
      .attr('height', horizontalSplitPaneSize - 10)
      .attr('viewBox', '0 0 ' + calculatedWidth + ' ' + horizontalSplitPaneSize)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('cursor', 'crosshair');
    debugger;
    let settingsHeight = chartDiv._groups[0][0].clientHeight;
    let g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + settings.margin.left + ',' + settings.margin.top + ')'
      )
      .attr('id', 'tickAxis');

    let bottomLabel = g
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ' ,' + (height + 30) + ')')
      .style('text-anchor', 'middle')
      .text(barcodeSettings.statLabel);

    let lowLabel = g
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -5)
      .attr('x', 0 - height / 1 + 10)
      .text(barcodeSettings.lowLabel);

    let highLabel = g
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', width + 20)
      .attr('x', 0 - height / 1 + 10)
      .text(barcodeSettings.highLabel);

    let axes = g.append('g').attr('class', 'x barcode-axis');

    axes
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .attr('transform', 'translate(0,' + height + ')');
    let tooltip = g.append('text');
    tooltip.attr('class', 'barcode-tooltip');
    // render barcode plot
    let lines = g
      .selectAll('line.barcode-line')
      .data(barcodeSettings.barcodeData)
      .enter()
      .append('line')
      .attr('class', 'barcode-line')
      .attr('id', function(d) {
        return 'barcode-line-' + d.lineID;
      })
      .attr('className', function(d) {
        return 'barcode-line-' + d.lineID;
      })
      .attr('x1', function(d, i) {
        return xScale(d.statistic);
      })
      .attr('x2', function(d) {
        return xScale(d.statistic);
      })
      .attr('y1', -20)
      .attr('y2', height)
      .style('stroke', function(d) {
        return '#2c3b78';
      })
      .style('stroke-width', 2)
      .style('opacity', function(d) {
        return 0.5;
      })

      // setup change events
      .on('mouseover', function(d) {
        if (barcodeSettings.brushing === false) {
          let toolTipPosition = parseInt(d3.select(this).attr('x1'));
          d3.select(this)
            .transition()
            .duration(100)
            .attr('y1', -40)
            .style('stroke-width', 3)
            .style('opacity', 1);

          if (xScale(d.statistic) > width / 2) {
            tooltip.attr('text-anchor', 'end');
          } else {
            tooltip.attr('text-anchor', 'start');
          }

          tooltip
            .transition()
            .duration(100)
            .style('opacity', 1)
            .text(function() {
              return d.lineID;
            })
            .style('fill', function() {
              return '#2c3b78';
            })
            .attr('y', -22)
            .attr('x', function() {
              if (xScale(d.statistic) > width / 2) {
                return toolTipPosition - 5;
              } else {
                return toolTipPosition + 5;
              }
            });
        }
      })

      .on('mouseout', function(d) {
        if (barcodeSettings.brushing === false) {
          d3.select(this)
            .transition()
            .delay(100)
            .attr('y1', -20)
            .style('stroke-width', 2)
            .style('opacity', function(d) {
              return 0.5;
            });
          tooltip
            .transition()
            .delay(100)
            .style('opacity', 0);
        }
      })

      .on('click', function(d) {
        if (barcodeSettings.brushing == false) {
          self.props.onHandleTickData(d);
        }
      });

    // add this logic once you figure our how to default select box via props...
    // if (barcodeSettings.brushedData.length > 0) {
    //   const brushedLineIds = barcodeSettings.brushedData.map(l => `barcode-line-${l.lineID}`);
    //   const allTicks = d3.selectAll('line.barcode-line');
    // const allTickGroups = d3.selectAll('line.barcode-line')._groups[0];
    // const allTicksArr = Array.from(allTicks);
    // const allTickIds = allTicksArr.map(t => t.id);
    // const alreadyBrushedTicks = _.intersectionWith(brushedLineIds, allTickIds, _.isEqual);

    // const isAlreadyBrushed = function(brushedTicks, x) {
    //   const xMin = brushedTicks[0][0],
    //   xMax = brushedTicks[1][0];
    //   const brushTest = xMin <= x && x <= xMax;
    //   return brushTest;
    // };
    //  allTicks
    // .filter(function() {
    //   const x = d3.select(this).attr('x1');
    //   return isAlreadyBrushed(brushedTicks, x);
    // })
    // .attr('y1', -40)
    // .style('stroke-width', 3)
    // .style('opacity', 1.0);
    //}

    let objsBrush = {};
    if (barcodeSettings.enableBrush) {
      const highlightBrushedTicks = function() {
        self.props.onHandleBarcodeChanges({
          brushing: true
        });
        const ticks = d3.selectAll('line.barcode-line');
        if (d3.event.selection !== undefined && d3.event.selection !== null) {
          self.unhighLight();

          const brushedTicks = d3.brushSelection(this);

          const isBrushed = function(brushedTicks, x) {
            const xMin = brushedTicks[0][0],
              xMax = brushedTicks[1][0];

            const brushTest: boolean = xMin <= x && x <= xMax;
            return brushTest;
          };

          const brushed = ticks
            .filter(function() {
              const x = d3.select(this).attr('x1');
              return isBrushed(brushedTicks, x);
            })
            .attr('y1', -40)
            .style('stroke-width', 3)
            .style('opacity', 1.0);
          const brushedDataVar = brushed.data();
          // const brushedDataVar = self.props.brushedData;
          self.props.onHandleBarcodeChanges({
            brushedData: brushedDataVar
          });
          self.props.onHandleTickBrush({
            brushedData: brushedDataVar
          });
          if (brushedDataVar.length > 0) {
            let line = self.getMaxObject(brushedDataVar);
            let maxTick = line;
            let id =
              'barcode-line-' +
              line.lineID.replace(/\;/g, '') +
              '_' +
              line.id_mult;
            // self.updateToolTip(line, id, self);
            d3.select('#' + id)
              .transition()
              .duration(300)
              .style('stroke', 'orange')
              .attr('y1', -55);
          }
        }
      };
      objsBrush = d3
        .brush()
        .extent([[0, -50], [calculatedWidth, horizontalSplitPaneSize]])
        .on('brush', highlightBrushedTicks)
        .on('end', function() {
          self.endBrush();
        });
      d3.selectAll('.x.barcode-axis').call(objsBrush);
    }

    let t = svg.on('click', function() {
      self.props.onHandleBarcodeChanges({
        brushing: false
      });
      self.unhighLight();
      self.props.onHandleTickBrush();
    });

    // this.setState = {
    //   objs: {
    //     mainDiv: null,
    //     chartDiv: chartDiv,
    //     g: g,
    //     xAxis: xAxis,
    //     tooltip: tooltip,
    //     brush: objsBrush
    //   },
    //   settings: {
    //     axes: null,
    //     bottomLabel: null,
    //     brush: objsBrush,
    //     chartDiv: chartDiv,
    //     g: g,
    //     height: height,
    //     id: 'chart-barcode',
    //     mainDiv: null,
    //     margin: { top: 45, right: 25, bottom: 40, left: 20 },
    //     svg: svg,
    //     title: '',
    //     tooltip: tooltip
    //   },
    //   containerWidth: calculatedWidth,
    //   xAxis: xAxis,
    //   xScale: xScale
    // };
  }

  unhighLight() {
    d3.selectAll('line.barcode-line')
      .attr('y1', -20)
      .style('stroke-width', 2)
      .style('opacity', function(d) {
        return 0.5;
      });
  }

  getMaxObject(array) {
    if (array) {
      let max = Math.max.apply(
        Math,
        array.map(function(o) {
          return o.statistic;
        })
      );
      let obj = array.find(function(o) {
        return o.statistic == max;
      });

      return obj;
    }
  }

  endBrush() {
    const brushedDataVar = this.getMaxObject(
      this.props.barcodeSettings.brushedData
    );
    this.props.onSetProteinForDiffView(brushedDataVar);
    this.props.onHandleTickData(brushedDataVar);
    this.props.onHandleTickBrush({
      brushing: true
    });
  }

  clearBrush() {
    this.state.objs.g.call(this.state.objs.brush.move, null);
  }

  // updateTick(tick) {
  // 	let id = this.getId(tick.sample, tick.id_mult);
  // 	let maxTickId = this.getId(this.maxTick.lineID, this.maxTick.id_mult)

  // 	d3.select("#" + maxTickId)
  // 		.transition()
  // 		.duration(300)
  // 		.style("stroke", "#2c3b78")
  // 		.attr("y1", -40)

  // 	self.updateToolTip(tick, id, self);

  // 	d3.select("#" + id)
  // 		.transition()
  // 		.duration(300)
  // 		.style("stroke", "orange")
  // 		.attr("y1", -55);

  // 	this.maxTick = {};
  // 	this.maxTick = {
  // 		lineID: tick.sample,
  // 		id_mult: tick.id_mult,
  // 		statistic: tick.statistic
  // 	}
  // }

  // dotHover(tick) {
  // 	let id = this.getId(tick.object.sample, tick.object.id_mult)

  // 	if (id != this.getId(this.maxTick.lineID, this.maxTick.id_mult)) {
  // 		d3.select("#" + id)
  // 			.transition()
  // 			.duration(300)
  // 			.style("stroke", "#2c3b78")
  // 			.attr("y1", function () {
  // 				if (tick.action == "mouseover") {
  // 					return -50
  // 				} else {
  // 					return -40
  // 				}
  // 			});
  // 	}
  // }

  // getId(protien, id_mult) {
  // 	return "barcode-line-" + protien.replace(/\;/g, "") + "_" + id_mult;
  // }

  updateToolTip(tick, id, self) {
    if (self.barcodeChartRef.current !== null) {
      let t = self.barcodeChartRef.current.getElementsByClassName(id);
      let toolTipPosition = parseInt(d3.select('#' + id).attr('x1'));
      let objsVar = self.state.objs;
      if (parseInt(t.getAttribute('x1')) > this.width / 2) {
        objsVar.tooltip.attr('text-anchor', 'end');
      } else {
        objsVar.tooltip.attr('text-anchor', 'start');
      }

      objsVar.tooltip
        .transition()
        .duration(100)
        .style('opacity', 1)
        .text(function() {
          return tick.sample ? tick.sample : tick.lineID;
        })
        .style('fill', function() {
          return '#2c3b78';
        })
        .attr('y', -45)
        .attr('x', function() {
          if (parseInt(t.getAttribute('x1')) > this.width / 2) {
            return toolTipPosition - 5;
          } else {
            return toolTipPosition + 5;
          }
        });
      // self.updateState({
      //   objs: objsVar
      // });
    }
  }

  render() {
    return (
      <div
        id="chart-barcode"
        className="BarcodeChartWrapper"
        ref={this.barcodeChartRef}
        // dangerouslySetInnerHTML={{ __html: this.state.settings.svg }}>
      ></div>
    );
  }
}

export default BarcodePlot;
