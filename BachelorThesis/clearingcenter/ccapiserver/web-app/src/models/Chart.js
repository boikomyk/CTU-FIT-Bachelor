import React from 'react';
import PropTypes from 'prop-types';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates';

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { OHLCTooltip, SingleValueTooltip } from 'react-stockcharts/lib/tooltip';
import { ema } from 'react-stockcharts/lib/indicator';
import { fitWidth } from 'react-stockcharts/lib/helper';
import algo from 'react-stockcharts/lib/algorithm';
import {
  Label,
  Annotate,
  SvgPathAnnotation
} from 'react-stockcharts/lib/annotation';
import { last } from 'react-stockcharts/lib/utils';
import chartStyles from 'styles/components/chart/Chart.jss';
import withStyles from '@material-ui/core/styles/withStyles';
import BarAnnotation from 'react-stockcharts/es/lib/annotation/BarAnnotation';

class MovingAverageCrossOverAlgorithmV2 extends React.Component {
  signalPath(_ref) {
    const x = _ref.x,
      y = _ref.y,
      r = 10;

    return (
      'M ' +
      x +
      ' ' +
      y +
      ' m -' +
      r +
      ', 0 a ' +
      r +
      ',' +
      r +
      ' 0 1,0 ' +
      r * 2 +
      ',0 a ' +
      r +
      ',' +
      r +
      ' 0 1,0 -' +
      r * 2 +
      ',0'
    );
  }
  render() {
    const {type, data: initialData, width, ratio} = this.props;

    const longBuyAnnotationProps = {
      y: ({yScale, datum}) => yScale(datum.askPrice),
      fill: '#B4D2C1',
      stroke: '#515151',
      path: this.signalPath,
      textIconFontSize: 18,
      textIconFill: '#006517',
      textIconXOffset: -8,
      textIconYOffset: 16,
      tooltip: 'BUY LONG',
      text: 'BUY LONG',
      textFill: '#ccc',
      textXOffset: 21,
      textYOffset: -3,
      textRotate: -90,
      textAnchor: 'start'
    };

    const shortBuyAnnotationProps = {
      y: ({yScale, datum}) => yScale(datum.askPrice),
      fill: '#B4D2C1',
      stroke: '#515151',
      path: this.signalPath,
      textIconFontSize: 18,
      textIconFill: '#006517',
      textIconXOffset: -8,
      textIconYOffset: 16,
      text: 'BUY SHORT',
      tooltip: 'BUY SHORT',
      textFill: '#ccc',
      textXOffset: 21,
      textYOffset: -3,
      textRotate: 90,
      textAnchor: 'start'
    };

    const longSellAnnotationProps = {
      y: ({yScale, datum}) => yScale(datum.askPrice),
      fill: '#FF7F7F',
      stroke: '#515151',
      path: this.signalPath,
      textIconFontSize: 18,
      textIconFill: '#006517',
      textIconXOffset: -8,
      textIconYOffset: 16,
      tooltip: 'SELL LONG',
      text: 'SELL LONG',
      textFill: '#ccc',
      textXOffset: 21,
      textYOffset: -3,
      textRotate: -90,
      textAnchor: 'start'
    };
    const shortSellAnnotationProps = {
      y: ({yScale, datum}) => yScale(datum.askPrice),
      fill: '#FF7F7F',
      stroke: '#515151',
      path: this.signalPath,
      textIconFontSize: 18,
      textIconFill: '#006517',
      textIconXOffset: -8,
      text: 'SELL SHORT',
      textIconYOffset: 16,
      tooltip: 'SELL SHORT',
      textFill: '#ccc',
      textXOffset: 21,
      textYOffset: -3,
      textRotate: 90,
      textAnchor: 'start'
    };

    const margin = {left: 80, right: 80, top: 30, bottom: 50};
    const height = 400;

    const [yAxisLabelX, yAxisLabelY] = [
      width - margin.left - 40,
      margin.top + (height - margin.top - margin.bottom) / 2
    ];

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => d.date
    );
    const {data, xScale, xAccessor, displayXAccessor} = xScaleProvider(
      initialData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    return (
      <ChartCanvas
        height={height}
        width={width}
        ratio={ratio}
        margin={margin}
        type={type}
        seriesName='MSFT'
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          yExtents={[d => [d.high, d.low]]}
          padding={{top: 10, bottom: 20}}
        >
          <XAxis axisAt='bottom' orient='bottom' />

          <Label
            x={(width - margin.left - margin.right) / 2}
            y={height - 45}
            fontSize={12}
            text='XAxis Label here'
          />

          <YAxis axisAt='right' orient='right' ticks={5} />

          <Label
            x={yAxisLabelX}
            y={yAxisLabelY}
            rotate={-90}
            fontSize={12}
            text='YAxis Label here'
          />
          <MouseCoordinateX
            at='bottom'
            orient='bottom'
            displayFormat={timeFormat('%Y-%m-%d %X')}
            rectWidth={160}
          />
          <MouseCoordinateY
            at='right'
            orient='right'
            displayFormat={format('.8')}
            rectWidth={100}
          />

          <CandlestickSeries />

          <OHLCTooltip origin={[-40, 0]} />
          <SingleValueTooltip
            yLabel={`Signal Prediction`}
            yAccessor={d => d.action}
            yDisplayFormat={b => {
              return b;
            }}
            origin={[-40, 20]}
          />

          <Annotate
            with={BarAnnotation}
            when={d => d.action === 'BUY LONG'}
            usingProps={longBuyAnnotationProps}
          />
          <Annotate
            with={BarAnnotation}
            when={d => d.action === 'SELL SHORT'}
            usingProps={shortSellAnnotationProps}
          />
          <Annotate
            with={BarAnnotation}
            when={d => d.action === 'BUY SHORT'}
            usingProps={shortBuyAnnotationProps}
          />
          <Annotate
            with={BarAnnotation}
            when={d => d.action === 'SELL LONG'}
            usingProps={longSellAnnotationProps}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

MovingAverageCrossOverAlgorithmV2.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
};

MovingAverageCrossOverAlgorithmV2.defaultProps = {
  type: 'svg'
};

MovingAverageCrossOverAlgorithmV2 = fitWidth(MovingAverageCrossOverAlgorithmV2);

export default withStyles(chartStyles)(MovingAverageCrossOverAlgorithmV2);
