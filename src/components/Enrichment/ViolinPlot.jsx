import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
// import { Provider as BusProvider, useBus, useListener } from 'react-bus';
import * as d3 from 'd3';
// import * as _ from "lodash";
// import { select } from "d3-selection";
import './ViolinPlot.scss';

class ViolinPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      violinContainerHeight: 0,
      violinContainerWidth: 0,
      violinHeight: 0,
      colorFunct: null,
      violinPlots: {},
      dataPlots: {},
      boxPlots: {},
      groupObjs: {},
      objs: {
        mainDiv: null,
        chartDiv: null,
        g: null,
        xAxis: null,
        yAxis: null,
        brush: null,
        tooltip: null
      },
      settings: {
        axisLabels: {
          xAxis: this.props.enrichmentTerm,
          yAxis: "log<tspan baseline-shift='sub' font-size='13px'>2</tspan>(FC)"
        },
        constrainExtremes: false,
        color: d3.scaleOrdinal(d3.schemeCategory10),
        id: 'chart-violin',
        // id: 'violin-graph-1',
        margin: { top: 50, right: 40, bottom: 40, left: 50 },
        pointUniqueId: 'sample',
        pointValue: 'cpm',
        scale: 'linear',
        subtitle: '',
        title: '',
        tooltip: {
          show: true,
          fields: [
            { label: 'log(FC)', value: 'cpm', toFixed: true },
            { label: 'Protien', value: 'sample' }
          ]
        },
        // tooltip: {
        //   show: true,
        //   fields: [{ label: 'label1', value: 'value1', toFixed: true }]
        // },
        // xName: null,
        xName: 'tissue',
        yName: null,
        yTicks: 1
      }
    };
    this.violinContainerRef = React.createRef();
    this.violinSVGRef = React.createRef();
  }

  componentDidMount() {
    this.setHeight();
    let resizedFn;
    window.addEventListener('resize', () => {
      clearTimeout(resizedFn);
      resizedFn = setTimeout(() => {
        this.windowResized();
      }, 200);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      // this.props.violinData !== prevProps.violinData ||
      this.props.verticalSplitPaneWidth !== prevProps.verticalSplitPaneWidth
    ) {
      this.setHeight();
    }
  }

  windowResized = () => {
    this.setHeight();
  };

  setHeight = () => {
    const containerHeight = this.getHeight();
    const height =
      containerHeight -
      this.state.settings.margin.top -
      this.state.settings.margin.bottom;
    this.setState({
      violinContainerHeight: containerHeight,
      violinHeight: height
    });
  };

  getHeight = () => {
    if (this.violinContainerRef.current !== null) {
      return this.violinContainerRef.current.parentElement.offsetHeight;
    } else return 600;
  };

  // handleViolinDotClickTest = () => {
  //   this.props.onViolinDotClick({
  //     dotHighlighted: []
  //   });
  // };

  render() {
    const {
      settings,
      violinHeight
      // violinContainerHeight,
      // violinContainerWidth,
      // violinPlots,
      // dataPlots,
      // boxPlots,
      // objs
    } = this.state;
    const {
      verticalSplitPaneWidth
      // violinData,
      // isViolinPlotLoaded
    } = this.props;

    const violinWidth =
      verticalSplitPaneWidth - settings.margin.left - settings.margin.right;

    // if (!isViolinPlotLoaded) {
    //   return (
    //     <div className="PlotInstructionsDiv">
    //       <h4 className="PlotInstructionsText">
    //         Select barcode line/s to display Violin Plot
    //       </h4>
    //     </div>
    //   );
    // } else {
    return (
      <Fragment>
        <div
          id={settings.id}
          className="violin-chart-wrapper"
          ref={this.violinContainerRef}
        ></div>
        <svg
          ref={this.violinSVGRef}
          id="test-violin-dot"
          className="chart-area vChart"
          height={violinHeight}
          width={violinWidth}
          viewBox={`0 0 ${violinWidth} ${violinHeight}`}
          preserveAspectRatio="xMinYMin meet"
          // {...props}
        >
          {/* X Axis Label */}
          <text
            transform={`translate(${verticalSplitPaneWidth /
              2}, ${violinHeight})`}
            textAnchor="middle"
          >
            {settings.axisLabels.xAxis}
          </text>

          {/* Y Axis Left Label */}
          <text transform="rotate(-90)" y={15} x={0 - violinHeight / 2}>
            log
            <tspan baseline-shift="sub" font-size="13px">
              2
            </tspan>
            (FC)
            {/* {settings.axisLabels.yAxis} */}
          </text>

          {/* <g className="axis">
              <g className="x axis">
                <text
                  className="label"
                  dy="1.5em"
                  y={-7}
                  fontSize={18}
                  fontWeight={700}
                  fontFamily="Lato"
                  transform="translate(50 517)"
                >
                  <tspan x={346.875}>{'GO:0000118'}</tspan>
                </text>
              </g>
              <g
                className="y axis"
                fill="none"
                fontSize={10}
                fontFamily="sans-serif"
                textAnchor="end"
              >
                <path
                  className="domain"
                  stroke="currentColor"
                  d="M50.5 517.5v-467"
                />
                <g className="tick">
                  <path
                    stroke="#fff"
                    opacity={0.6}
                    shapeRendering="crispedges"
                    strokeDasharray="2,1"
                    d="M50 517.5h790"
                  />
                  <text
                    fill="currentColor"
                    x={-3}
                    dy=".32em"
                    transform="translate(50 517.5)"
                  >
                    {'-5'}
                  </text>
                </g>
                <text
                  className="label"
                  dy=".62em"
                  transform="rotate(-90 50 0)"
                  x={-233.5}
                  y={-48}
                  fill="#000"
                  fontSize={18}
                  fontWeight={700}
                  fontFamily="Lato"
                >
                  <tspan>
                    {'log'}
                    <tspan baselineShift="sub" fontSize={14}>
                      {'2'}
                    </tspan>
                    {'(FC)'}
                  </tspan>
                </text>
              </g>
            </g>
            <g className="violin-plot">
              <path
                className="area"
                d="M294.812 455.865l-1.746-.849a4553.803 4553.803 0 00-7.003-3.396l-1.754-.85-1.753-.848-1.754-.85a14002.021 14002.021 0 01-7.006-3.396 3944.76 3944.76 0 01-6.975-3.396 2206.349 2206.349 0 01-6.916-3.396 1477.507 1477.507 0 01-6.83-3.397 1073.05 1073.05 0 01-6.715-3.396 814.14 814.14 0 01-6.569-3.396 633.544 633.544 0 01-6.392-3.397 500.348 500.348 0 01-4.659-2.547 421.52 421.52 0 01-4.527-2.547 356.005 356.005 0 01-4.382-2.548 300.97 300.97 0 01-4.224-2.547 254.39 254.39 0 01-4.051-2.547 214.78 214.78 0 01-3.866-2.547 181.016 181.016 0 01-3.667-2.548 152.227 152.227 0 01-3.457-2.547 127.72 127.72 0 01-3.235-2.547 106.933 106.933 0 01-3.002-2.548 89.395 89.395 0 01-1.867-1.698 79.308 79.308 0 01-1.757-1.698 70.382 70.382 0 01-1.644-1.698 62.521 62.521 0 01-1.53-1.698 55.637 55.637 0 01-1.412-1.698 49.65 49.65 0 01-1.294-1.699 44.483 44.483 0 01-1.175-1.698 40.07 40.07 0 01-1.056-1.698 36.35 36.35 0 01-.934-1.698 33.263 33.263 0 01-.814-1.698 30.763 30.763 0 01-.995-2.548 28.021 28.021 0 01-.726-2.547 26.392 26.392 0 01-.559-3.396 25.84 25.84 0 01-.106-3.397 27.114 27.114 0 01.205-2.547 29.346 29.346 0 01.434-2.547 32.82 32.82 0 01.41-1.698 35.933 35.933 0 01.501-1.699 39.8 39.8 0 01.588-1.698 44.561 44.561 0 01.668-1.698 50.41 50.41 0 01.743-1.698 57.634 57.634 0 01.813-1.698 66.658 66.658 0 01.875-1.698 78.147 78.147 0 011.415-2.548 102.636 102.636 0 011.517-2.547 143.792 143.792 0 011.594-2.547 229.055 229.055 0 011.647-2.548l.556-.849.557-.849.559-.849.558-.849a755.674 755.674 0 001.664-2.547 262.785 262.785 0 001.627-2.547 155.418 155.418 0 001.563-2.548 107.6 107.6 0 001.473-2.547 80.243 80.243 0 00.92-1.698 67.666 67.666 0 00.86-1.698 57.899 57.899 0 00.794-1.699 50.146 50.146 0 00.721-1.698 43.91 43.91 0 00.642-1.698 38.866 38.866 0 00.556-1.698 34.787 34.787 0 00.464-1.698 31.518 31.518 0 00.366-1.698 28.946 28.946 0 00.355-2.548 26.223 26.223 0 00.108-2.547 24.709 24.709 0 00-.263-3.396 24.422 24.422 0 00-.752-3.397 26.1 26.1 0 00-.896-2.547 28.742 28.742 0 00-.758-1.698 31.232 31.232 0 00-.888-1.698 34.368 34.368 0 00-1.017-1.699 38.213 38.213 0 00-1.146-1.698 42.842 42.842 0 00-1.275-1.698 48.342 48.342 0 00-1.402-1.698 54.813 54.813 0 00-1.527-1.698 62.368 62.368 0 00-1.65-1.698 71.14 71.14 0 00-1.77-1.699 81.284 81.284 0 00-1.885-1.698 92.986 92.986 0 00-1.998-1.698 106.471 106.471 0 00-2.107-1.698 122.02 122.02 0 00-2.21-1.698 139.99 139.99 0 00-3.497-2.548 172.546 172.546 0 00-3.7-2.547 213.968 213.968 0 00-3.882-2.547 268.15 268.15 0 00-4.04-2.547 342.171 342.171 0 00-4.176-2.548 450.382 450.382 0 00-4.287-2.547 626.877 626.877 0 00-4.37-2.547 976.822 976.822 0 00-4.429-2.548 2060.5 2060.5 0 00-2.97-1.698l-1.489-.849-1.488-.849-1.487-.849a2566.607 2566.607 0 01-4.448-2.547 1073.747 1073.747 0 01-4.403-2.548 662.375 662.375 0 01-4.332-2.547 465.65 465.65 0 01-4.233-2.547 348.211 348.211 0 01-4.107-2.547 269.109 269.109 0 01-3.955-2.548 211.759 211.759 0 01-3.778-2.547 168.192 168.192 0 01-3.576-2.547 134.106 134.106 0 01-2.26-1.698 115.356 115.356 0 01-2.155-1.699 99.177 99.177 0 01-2.042-1.698 85.19 85.19 0 01-1.924-1.698 73.1 73.1 0 01-1.799-1.698 62.667 62.667 0 01-1.67-1.698 53.699 53.699 0 01-1.536-1.698 46.032 46.032 0 01-1.396-1.699 39.526 39.526 0 01-1.253-1.698 34.06 34.06 0 01-1.106-1.698 29.528 29.528 0 01-.955-1.698 25.833 25.833 0 01-.8-1.698 22.894 22.894 0 01-.644-1.699 20.64 20.64 0 01-.483-1.698 19.013 19.013 0 01-.323-1.698 17.968 17.968 0 01-.176-2.547 17.431 17.431 0 01.344-3.397 18.612 18.612 0 01.422-1.698 20.055 20.055 0 01.589-1.698 22.12 22.12 0 01.755-1.698 24.863 24.863 0 01.921-1.698 28.355 28.355 0 011.086-1.698 32.675 32.675 0 011.25-1.699 37.915 37.915 0 011.411-1.698 44.171 44.171 0 011.572-1.698 51.55 51.55 0 011.73-1.698 60.165 60.165 0 011.884-1.698 70.136 70.136 0 012.036-1.699 81.594 81.594 0 012.186-1.698 94.675 94.675 0 012.332-1.698 109.532 109.532 0 012.473-1.698 126.327 126.327 0 012.612-1.698 145.24 145.24 0 012.745-1.698 166.476 166.476 0 012.876-1.699 190.26 190.26 0 013-1.698 216.857 216.857 0 014.724-2.547 262.7 262.7 0 014.979-2.547 316.834 316.834 0 015.215-2.548 380.929 380.929 0 015.434-2.547 457.253 457.253 0 015.635-2.547 548.987 548.987 0 015.816-2.547 660.747 660.747 0 015.979-2.548 799.499 799.499 0 016.122-2.547 976.267 976.267 0 018.354-3.396 1304.99 1304.99 0 018.531-3.397 1829.397 1829.397 0 018.665-3.396 2812.926 2812.926 0 018.756-3.396 5391.064 5391.064 0 018.806-3.397l2.205-.849 2.206-.849 2.205-.85a12890.36 12890.36 0 008.804-3.395 4647.21 4647.21 0 008.757-3.397 2878.887 2878.887 0 008.676-3.396 2098.988 2098.988 0 008.569-3.397 1655.009 1655.009 0 0010.521-4.245 1308.173 1308.173 0 0010.272-4.245 1078.62 1078.62 0 009.988-4.246 914.236 914.236 0 009.677-4.245 790.206 790.206 0 009.344-4.246 693.156 693.156 0 008.999-4.245 615.188 615.188 0 008.644-4.246 551.285 551.285 0 008.284-4.245 498.057 498.057 0 007.927-4.246l1.542-.849c.512-.283 1.529-.849 1.529-.849H445V455.866z"
                fill="#1f77b4"
                opacity={0.3}
              />
              <path
                className="line"
                fill="none"
                d="M294.812 455.865l-1.746-.849a4553.803 4553.803 0 00-7.003-3.396l-1.754-.85-1.753-.848-1.754-.85a14002.021 14002.021 0 01-7.006-3.396 3944.76 3944.76 0 01-6.975-3.396 2206.349 2206.349 0 01-6.916-3.396 1477.507 1477.507 0 01-6.83-3.397 1073.05 1073.05 0 01-6.715-3.396 814.14 814.14 0 01-6.569-3.396 633.544 633.544 0 01-6.392-3.397 500.348 500.348 0 01-4.659-2.547 421.52 421.52 0 01-4.527-2.547 356.005 356.005 0 01-4.382-2.548 300.97 300.97 0 01-4.224-2.547 254.39 254.39 0 01-4.051-2.547 214.78 214.78 0 01-3.866-2.547 181.016 181.016 0 01-3.667-2.548 152.227 152.227 0 01-3.457-2.547 127.72 127.72 0 01-3.235-2.547 106.933 106.933 0 01-3.002-2.548 89.395 89.395 0 01-1.867-1.698 79.308 79.308 0 01-1.757-1.698 70.382 70.382 0 01-1.644-1.698 62.521 62.521 0 01-1.53-1.698 55.637 55.637 0 01-1.412-1.698 49.65 49.65 0 01-1.294-1.699 44.483 44.483 0 01-1.175-1.698 40.07 40.07 0 01-1.056-1.698 36.35 36.35 0 01-.934-1.698 33.263 33.263 0 01-.814-1.698 30.763 30.763 0 01-.995-2.548 28.021 28.021 0 01-.726-2.547 26.392 26.392 0 01-.559-3.396 25.84 25.84 0 01-.106-3.397 27.114 27.114 0 01.205-2.547 29.346 29.346 0 01.434-2.547 32.82 32.82 0 01.41-1.698 35.933 35.933 0 01.501-1.699 39.8 39.8 0 01.588-1.698 44.561 44.561 0 01.668-1.698 50.41 50.41 0 01.743-1.698 57.634 57.634 0 01.813-1.698 66.658 66.658 0 01.875-1.698 78.147 78.147 0 011.415-2.548 102.636 102.636 0 011.517-2.547 143.792 143.792 0 011.594-2.547 229.055 229.055 0 011.647-2.548l.556-.849.557-.849.559-.849.558-.849a755.674 755.674 0 001.664-2.547 262.785 262.785 0 001.627-2.547 155.418 155.418 0 001.563-2.548 107.6 107.6 0 001.473-2.547 80.243 80.243 0 00.92-1.698 67.666 67.666 0 00.86-1.698 57.899 57.899 0 00.794-1.699 50.146 50.146 0 00.721-1.698 43.91 43.91 0 00.642-1.698 38.866 38.866 0 00.556-1.698 34.787 34.787 0 00.464-1.698 31.518 31.518 0 00.366-1.698 28.946 28.946 0 00.355-2.548 26.223 26.223 0 00.108-2.547 24.709 24.709 0 00-.263-3.396 24.422 24.422 0 00-.752-3.397 26.1 26.1 0 00-.896-2.547 28.742 28.742 0 00-.758-1.698 31.232 31.232 0 00-.888-1.698 34.368 34.368 0 00-1.017-1.699 38.213 38.213 0 00-1.146-1.698 42.842 42.842 0 00-1.275-1.698 48.342 48.342 0 00-1.402-1.698 54.813 54.813 0 00-1.527-1.698 62.368 62.368 0 00-1.65-1.698 71.14 71.14 0 00-1.77-1.699 81.284 81.284 0 00-1.885-1.698 92.986 92.986 0 00-1.998-1.698 106.471 106.471 0 00-2.107-1.698 122.02 122.02 0 00-2.21-1.698 139.99 139.99 0 00-3.497-2.548 172.546 172.546 0 00-3.7-2.547 213.968 213.968 0 00-3.882-2.547 268.15 268.15 0 00-4.04-2.547 342.171 342.171 0 00-4.176-2.548 450.382 450.382 0 00-4.287-2.547 626.877 626.877 0 00-4.37-2.547 976.822 976.822 0 00-4.429-2.548 2060.5 2060.5 0 00-2.97-1.698l-1.489-.849-1.488-.849-1.487-.849a2566.607 2566.607 0 01-4.448-2.547 1073.747 1073.747 0 01-4.403-2.548 662.375 662.375 0 01-4.332-2.547 465.65 465.65 0 01-4.233-2.547 348.211 348.211 0 01-4.107-2.547 269.109 269.109 0 01-3.955-2.548 211.759 211.759 0 01-3.778-2.547 168.192 168.192 0 01-3.576-2.547 134.106 134.106 0 01-2.26-1.698 115.356 115.356 0 01-2.155-1.699 99.177 99.177 0 01-2.042-1.698 85.19 85.19 0 01-1.924-1.698 73.1 73.1 0 01-1.799-1.698 62.667 62.667 0 01-1.67-1.698 53.699 53.699 0 01-1.536-1.698 46.032 46.032 0 01-1.396-1.699 39.526 39.526 0 01-1.253-1.698 34.06 34.06 0 01-1.106-1.698 29.528 29.528 0 01-.955-1.698 25.833 25.833 0 01-.8-1.698 22.894 22.894 0 01-.644-1.699 20.64 20.64 0 01-.483-1.698 19.013 19.013 0 01-.323-1.698 17.968 17.968 0 01-.176-2.547 17.431 17.431 0 01.344-3.397 18.612 18.612 0 01.422-1.698 20.055 20.055 0 01.589-1.698 22.12 22.12 0 01.755-1.698 24.863 24.863 0 01.921-1.698 28.355 28.355 0 011.086-1.698 32.675 32.675 0 011.25-1.699 37.915 37.915 0 011.411-1.698 44.171 44.171 0 011.572-1.698 51.55 51.55 0 011.73-1.698 60.165 60.165 0 011.884-1.698 70.136 70.136 0 012.036-1.699 81.594 81.594 0 012.186-1.698 94.675 94.675 0 012.332-1.698 109.532 109.532 0 012.473-1.698 126.327 126.327 0 012.612-1.698 145.24 145.24 0 012.745-1.698 166.476 166.476 0 012.876-1.699 190.26 190.26 0 013-1.698 216.857 216.857 0 014.724-2.547 262.7 262.7 0 014.979-2.547 316.834 316.834 0 015.215-2.548 380.929 380.929 0 015.434-2.547 457.253 457.253 0 015.635-2.547 548.987 548.987 0 015.816-2.547 660.747 660.747 0 015.979-2.548 799.499 799.499 0 016.122-2.547 976.267 976.267 0 018.354-3.396 1304.99 1304.99 0 018.531-3.397 1829.397 1829.397 0 018.665-3.396 2812.926 2812.926 0 018.756-3.396 5391.064 5391.064 0 018.806-3.397l2.205-.849 2.206-.849 2.205-.85a12890.36 12890.36 0 008.804-3.395 4647.21 4647.21 0 008.757-3.397 2878.887 2878.887 0 008.676-3.396 2098.988 2098.988 0 008.569-3.397 1655.009 1655.009 0 0010.521-4.245 1308.173 1308.173 0 0010.272-4.245 1078.62 1078.62 0 009.988-4.246 914.236 914.236 0 009.677-4.245 790.206 790.206 0 009.344-4.246 693.156 693.156 0 008.999-4.245 615.188 615.188 0 008.644-4.246 551.285 551.285 0 008.284-4.245 498.057 498.057 0 007.927-4.246l1.542-.849c.512-.283 1.529-.849 1.529-.849"
                strokeWidth={2}
                stroke="#1f77b4"
              />
              <g>
                <path
                  className="area"
                  d="M595.188 455.865l1.746-.849a4553.803 4553.803 0 017.003-3.396l1.754-.85 1.753-.848 1.754-.85a14002.021 14002.021 0 007.006-3.396 3944.76 3944.76 0 006.975-3.396 2206.349 2206.349 0 006.916-3.396 1477.507 1477.507 0 006.83-3.397 1073.05 1073.05 0 006.715-3.396 814.14 814.14 0 006.569-3.396 633.544 633.544 0 006.392-3.397 500.348 500.348 0 004.659-2.547 421.52 421.52 0 004.527-2.547 356.005 356.005 0 004.382-2.548 300.97 300.97 0 004.224-2.547 254.39 254.39 0 004.051-2.547 214.78 214.78 0 003.866-2.547 181.016 181.016 0 003.667-2.548 152.227 152.227 0 003.457-2.547 127.72 127.72 0 003.235-2.547 106.933 106.933 0 003.002-2.548 89.395 89.395 0 001.867-1.698 79.308 79.308 0 001.757-1.698 70.382 70.382 0 001.644-1.698 62.521 62.521 0 001.53-1.698 55.637 55.637 0 001.412-1.698 49.65 49.65 0 001.294-1.699 44.483 44.483 0 001.175-1.698 40.07 40.07 0 001.056-1.698 36.35 36.35 0 00.934-1.698 33.263 33.263 0 00.814-1.698 30.763 30.763 0 00.995-2.548 28.021 28.021 0 00.726-2.547 26.392 26.392 0 00.559-3.396 25.84 25.84 0 00.106-3.397 27.114 27.114 0 00-.205-2.547 29.346 29.346 0 00-.434-2.547 32.82 32.82 0 00-.41-1.698 35.933 35.933 0 00-.501-1.699 39.8 39.8 0 00-.588-1.698 44.561 44.561 0 00-.668-1.698 50.41 50.41 0 00-.743-1.698 57.634 57.634 0 00-.813-1.698 66.658 66.658 0 00-.875-1.698 78.147 78.147 0 00-1.415-2.548 102.636 102.636 0 00-1.517-2.547 143.792 143.792 0 00-1.594-2.547 229.055 229.055 0 00-1.647-2.548l-.556-.849-.557-.849-.559-.849-.558-.849a755.674 755.674 0 01-1.664-2.547 262.785 262.785 0 01-1.627-2.547 155.418 155.418 0 01-1.563-2.548 107.6 107.6 0 01-1.473-2.547 80.243 80.243 0 01-.92-1.698 67.666 67.666 0 01-.86-1.698 57.899 57.899 0 01-.794-1.699 50.146 50.146 0 01-.721-1.698 43.91 43.91 0 01-.642-1.698 38.866 38.866 0 01-.556-1.698 34.787 34.787 0 01-.464-1.698 31.518 31.518 0 01-.366-1.698 28.946 28.946 0 01-.355-2.548 26.223 26.223 0 01-.108-2.547 24.709 24.709 0 01.263-3.396 24.422 24.422 0 01.752-3.397 26.1 26.1 0 01.896-2.547 28.742 28.742 0 01.758-1.698 31.232 31.232 0 01.888-1.698 34.368 34.368 0 011.017-1.699 38.213 38.213 0 011.146-1.698 42.842 42.842 0 011.275-1.698 48.342 48.342 0 011.402-1.698 54.813 54.813 0 011.527-1.698 62.368 62.368 0 011.65-1.698 71.14 71.14 0 011.77-1.699 81.284 81.284 0 011.885-1.698 92.986 92.986 0 011.998-1.698 106.471 106.471 0 012.107-1.698 122.02 122.02 0 012.21-1.698 139.99 139.99 0 013.497-2.548 172.546 172.546 0 013.7-2.547 213.968 213.968 0 013.882-2.547 268.15 268.15 0 014.04-2.547 342.171 342.171 0 014.176-2.548 450.382 450.382 0 014.287-2.547 626.877 626.877 0 014.37-2.547 976.822 976.822 0 014.429-2.548 2060.5 2060.5 0 012.97-1.698l1.489-.849 1.488-.849 1.487-.849a2566.607 2566.607 0 004.448-2.547 1073.747 1073.747 0 004.403-2.548 662.375 662.375 0 004.332-2.547 465.65 465.65 0 004.233-2.547 348.211 348.211 0 004.107-2.547 269.109 269.109 0 003.955-2.548 211.759 211.759 0 003.778-2.547 168.192 168.192 0 003.576-2.547 134.106 134.106 0 002.26-1.698 115.356 115.356 0 002.155-1.699 99.177 99.177 0 002.042-1.698 85.19 85.19 0 001.924-1.698 73.1 73.1 0 001.799-1.698 62.667 62.667 0 001.67-1.698 53.699 53.699 0 001.536-1.698 46.032 46.032 0 001.396-1.699 39.526 39.526 0 001.253-1.698 34.06 34.06 0 001.106-1.698 29.528 29.528 0 00.955-1.698 25.833 25.833 0 00.8-1.698 22.894 22.894 0 00.644-1.699 20.64 20.64 0 00.483-1.698 19.013 19.013 0 00.323-1.698 17.968 17.968 0 00.176-2.547 17.431 17.431 0 00-.344-3.397 18.612 18.612 0 00-.422-1.698 20.055 20.055 0 00-.589-1.698 22.12 22.12 0 00-.755-1.698 24.863 24.863 0 00-.921-1.698 28.355 28.355 0 00-1.086-1.698 32.675 32.675 0 00-1.25-1.699 37.915 37.915 0 00-1.411-1.698 44.171 44.171 0 00-1.572-1.698 51.55 51.55 0 00-1.73-1.698 60.165 60.165 0 00-1.884-1.698 70.136 70.136 0 00-2.036-1.699 81.594 81.594 0 00-2.186-1.698 94.675 94.675 0 00-2.332-1.698 109.532 109.532 0 00-2.473-1.698 126.327 126.327 0 00-2.612-1.698 145.24 145.24 0 00-2.745-1.698 166.476 166.476 0 00-2.876-1.699 190.26 190.26 0 00-3-1.698 216.857 216.857 0 00-4.724-2.547 262.7 262.7 0 00-4.979-2.547 316.834 316.834 0 00-5.215-2.548 380.929 380.929 0 00-5.434-2.547 457.253 457.253 0 00-5.635-2.547 548.987 548.987 0 00-5.816-2.547 660.747 660.747 0 00-5.979-2.548 799.499 799.499 0 00-6.122-2.547 976.267 976.267 0 00-8.354-3.396 1304.99 1304.99 0 00-8.531-3.397 1829.397 1829.397 0 00-8.665-3.396 2812.926 2812.926 0 00-8.756-3.396 5391.064 5391.064 0 00-8.806-3.397l-2.205-.849-2.206-.849-2.205-.85a12890.36 12890.36 0 01-8.804-3.395 4647.21 4647.21 0 01-8.757-3.397 2878.887 2878.887 0 01-8.676-3.396 2098.988 2098.988 0 01-8.569-3.397 1655.009 1655.009 0 01-10.521-4.245 1308.173 1308.173 0 01-10.272-4.245 1078.62 1078.62 0 01-9.988-4.246 914.236 914.236 0 01-9.677-4.245 790.206 790.206 0 01-9.344-4.246 693.156 693.156 0 01-8.999-4.245 615.188 615.188 0 01-8.644-4.246 551.285 551.285 0 01-8.284-4.245 498.057 498.057 0 01-7.927-4.246 453.097 453.097 0 01-3.07-1.698H445V455.866z"
                  fill="#1f77b4"
                  opacity={0.3}
                />
                <path
                  className="line"
                  fill="none"
                  d="M595.188 455.865l1.746-.849a4553.803 4553.803 0 017.003-3.396l1.754-.85 1.753-.848 1.754-.85a14002.021 14002.021 0 007.006-3.396 3944.76 3944.76 0 006.975-3.396 2206.349 2206.349 0 006.916-3.396 1477.507 1477.507 0 006.83-3.397 1073.05 1073.05 0 006.715-3.396 814.14 814.14 0 006.569-3.396 633.544 633.544 0 006.392-3.397 500.348 500.348 0 004.659-2.547 421.52 421.52 0 004.527-2.547 356.005 356.005 0 004.382-2.548 300.97 300.97 0 004.224-2.547 254.39 254.39 0 004.051-2.547 214.78 214.78 0 003.866-2.547 181.016 181.016 0 003.667-2.548 152.227 152.227 0 003.457-2.547 127.72 127.72 0 003.235-2.547 106.933 106.933 0 003.002-2.548 89.395 89.395 0 001.867-1.698 79.308 79.308 0 001.757-1.698 70.382 70.382 0 001.644-1.698 62.521 62.521 0 001.53-1.698 55.637 55.637 0 001.412-1.698 49.65 49.65 0 001.294-1.699 44.483 44.483 0 001.175-1.698 40.07 40.07 0 001.056-1.698 36.35 36.35 0 00.934-1.698 33.263 33.263 0 00.814-1.698 30.763 30.763 0 00.995-2.548 28.021 28.021 0 00.726-2.547 26.392 26.392 0 00.559-3.396 25.84 25.84 0 00.106-3.397 27.114 27.114 0 00-.205-2.547 29.346 29.346 0 00-.434-2.547 32.82 32.82 0 00-.41-1.698 35.933 35.933 0 00-.501-1.699 39.8 39.8 0 00-.588-1.698 44.561 44.561 0 00-.668-1.698 50.41 50.41 0 00-.743-1.698 57.634 57.634 0 00-.813-1.698 66.658 66.658 0 00-.875-1.698 78.147 78.147 0 00-1.415-2.548 102.636 102.636 0 00-1.517-2.547 143.792 143.792 0 00-1.594-2.547 229.055 229.055 0 00-1.647-2.548l-.556-.849-.557-.849-.559-.849-.558-.849a755.674 755.674 0 01-1.664-2.547 262.785 262.785 0 01-1.627-2.547 155.418 155.418 0 01-1.563-2.548 107.6 107.6 0 01-1.473-2.547 80.243 80.243 0 01-.92-1.698 67.666 67.666 0 01-.86-1.698 57.899 57.899 0 01-.794-1.699 50.146 50.146 0 01-.721-1.698 43.91 43.91 0 01-.642-1.698 38.866 38.866 0 01-.556-1.698 34.787 34.787 0 01-.464-1.698 31.518 31.518 0 01-.366-1.698 28.946 28.946 0 01-.355-2.548 26.223 26.223 0 01-.108-2.547 24.709 24.709 0 01.263-3.396 24.422 24.422 0 01.752-3.397 26.1 26.1 0 01.896-2.547 28.742 28.742 0 01.758-1.698 31.232 31.232 0 01.888-1.698 34.368 34.368 0 011.017-1.699 38.213 38.213 0 011.146-1.698 42.842 42.842 0 011.275-1.698 48.342 48.342 0 011.402-1.698 54.813 54.813 0 011.527-1.698 62.368 62.368 0 011.65-1.698 71.14 71.14 0 011.77-1.699 81.284 81.284 0 011.885-1.698 92.986 92.986 0 011.998-1.698 106.471 106.471 0 012.107-1.698 122.02 122.02 0 012.21-1.698 139.99 139.99 0 013.497-2.548 172.546 172.546 0 013.7-2.547 213.968 213.968 0 013.882-2.547 268.15 268.15 0 014.04-2.547 342.171 342.171 0 014.176-2.548 450.382 450.382 0 014.287-2.547 626.877 626.877 0 014.37-2.547 976.822 976.822 0 014.429-2.548 2060.5 2060.5 0 012.97-1.698l1.489-.849 1.488-.849 1.487-.849a2566.607 2566.607 0 004.448-2.547 1073.747 1073.747 0 004.403-2.548 662.375 662.375 0 004.332-2.547 465.65 465.65 0 004.233-2.547 348.211 348.211 0 004.107-2.547 269.109 269.109 0 003.955-2.548 211.759 211.759 0 003.778-2.547 168.192 168.192 0 003.576-2.547 134.106 134.106 0 002.26-1.698 115.356 115.356 0 002.155-1.699 99.177 99.177 0 002.042-1.698 85.19 85.19 0 001.924-1.698 73.1 73.1 0 001.799-1.698 62.667 62.667 0 001.67-1.698 53.699 53.699 0 001.536-1.698 46.032 46.032 0 001.396-1.699 39.526 39.526 0 001.253-1.698 34.06 34.06 0 001.106-1.698 29.528 29.528 0 00.955-1.698 25.833 25.833 0 00.8-1.698 22.894 22.894 0 00.644-1.699 20.64 20.64 0 00.483-1.698 19.013 19.013 0 00.323-1.698 17.968 17.968 0 00.176-2.547 17.431 17.431 0 00-.344-3.397 18.612 18.612 0 00-.422-1.698 20.055 20.055 0 00-.589-1.698 22.12 22.12 0 00-.755-1.698 24.863 24.863 0 00-.921-1.698 28.355 28.355 0 00-1.086-1.698 32.675 32.675 0 00-1.25-1.699 37.915 37.915 0 00-1.411-1.698 44.171 44.171 0 00-1.572-1.698 51.55 51.55 0 00-1.73-1.698 60.165 60.165 0 00-1.884-1.698 70.136 70.136 0 00-2.036-1.699 81.594 81.594 0 00-2.186-1.698 94.675 94.675 0 00-2.332-1.698 109.532 109.532 0 00-2.473-1.698 126.327 126.327 0 00-2.612-1.698 145.24 145.24 0 00-2.745-1.698 166.476 166.476 0 00-2.876-1.699 190.26 190.26 0 00-3-1.698 216.857 216.857 0 00-4.724-2.547 262.7 262.7 0 00-4.979-2.547 316.834 316.834 0 00-5.215-2.548 380.929 380.929 0 00-5.434-2.547 457.253 457.253 0 00-5.635-2.547 548.987 548.987 0 00-5.816-2.547 660.747 660.747 0 00-5.979-2.548 799.499 799.499 0 00-6.122-2.547 976.267 976.267 0 00-8.354-3.396 1304.99 1304.99 0 00-8.531-3.397 1829.397 1829.397 0 00-8.665-3.396 2812.926 2812.926 0 00-8.756-3.396 5391.064 5391.064 0 00-8.806-3.397l-2.205-.849-2.206-.849-2.205-.85a12890.36 12890.36 0 01-8.804-3.395 4647.21 4647.21 0 01-8.757-3.397 2878.887 2878.887 0 01-8.676-3.396 2098.988 2098.988 0 01-8.569-3.397 1655.009 1655.009 0 01-10.521-4.245 1308.173 1308.173 0 01-10.272-4.245 1078.62 1078.62 0 01-9.988-4.246 914.236 914.236 0 01-9.677-4.245 790.206 790.206 0 01-9.344-4.246 693.156 693.156 0 01-8.999-4.245 615.188 615.188 0 01-8.644-4.246 551.285 551.285 0 01-8.284-4.245 498.057 498.057 0 01-7.927-4.246 453.097 453.097 0 01-3.07-1.698"
                  strokeWidth={2}
                  stroke="#1f77b4"
                />
              </g>
            </g>
            <g className="box-plot" transform="translate(50 50)">
              <rect
                className="box"
                fill="#1f77b4"
                opacity={0.4}
                stroke="#1f77b4"
                strokeWidth={2}
                x={276.5}
                width={237}
                y={139.127}
                rx={1}
                ry={1}
                height={175.187}
              />
              <path className="median" d="M276.5 199.471h237" />
              <circle
                className="median"
                r={3.5}
                fill="#1f77b4"
                cx={395}
                cy={199.471}
              />
              <path
                className="upper whisker"
                stroke="#1f77b4"
                d="M276.5 29.336h237M395 139.127V29.336"
              />
              <path
                className="lower whisker"
                stroke="#1f77b4"
                d="M276.5 406.226h237M395 314.313v91.913"
              />
            </g>
            <g className="points-plot" transform="translate(50 50)">
              <circle
                className="point violin-graph-1 vPoint"
                stroke="#000"
                r={6}
                fill="orange"
                pointerEvents="all"
                cx={439}
                cy={88.429}
              />
            </g> */}
        </svg>
      </Fragment>
    );
    // }
  }
}

export default ViolinPlot;
