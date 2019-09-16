/**
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class BbIndicator extends SmaIndicator
            implements MultipleLinesIndicator {
            public data: Array<BbIndicatorPoint>;
            public linesApiNames: MultipleLinesMixin['linesApiNames'];
            public getTranslatedLinesNames: MultipleLinesMixin[
                'getTranslatedLinesNames'
            ];
            public getValues(
                series: Series,
                params: BbIndicatorParamsOptions
            ): (boolean|IndicatorMultipleValuesObject);
            public options: BbIndicatorOptions;
            public yData: Array<Array<number>>;
        }

        interface BbIndicatorParamsOptions extends SmaIndicatorParamsOptions {
            standardDeviation?: number;
        }

        class BbIndicatorPoint extends SmaIndicatorPoint {
            public series: BbIndicator;
        }

        interface BbIndicatorOptions extends SmaIndicatorOptions,
            MultipleLinesIndicatorOptions {
            bottomLine?: Dictionary<CSSObject>;
            params?: BbIndicatorParamsOptions;
            topLine?: Dictionary<CSSObject>;
        }

        interface SeriesTypesDictionary {
            bb: typeof BbIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

import multipleLinesMixin from '../mixins/multipe-lines.js';

var merge = H.merge,
    SMA = H.seriesTypes.sma;

/* eslint-disable valid-jsdoc */

// Utils:
/**
 * @private
 */
function getStandardDeviation(
    arr: Array<Array<number>>,
    index: number,
    isOHLC: boolean,
    mean: number
): number {
    var variance = 0,
        arrLen = arr.length,
        std = 0,
        i = 0,
        value: number;

    for (; i < arrLen; i++) {
        value = ((isOHLC ? arr[i][index] : arr[i]) as any) - mean;
        variance += value * value;
    }
    variance = variance / (arrLen - 1);

    std = Math.sqrt(variance);
    return std;
}
/* eslint-enable valid-jsdoc */

/**
 * Bollinger Bands series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bb
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.BbIndicator>(
    'bb',
    'sma',
    /**
     * Bollinger bands (BB). This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/bollinger-bands
     *         Bollinger bands
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @optionparent plotOptions.bb
     */
    {
        params: {
            period: 20,
            /**
             * Standard deviation for top and bottom bands.
             */
            standardDeviation: 2,
            index: 3
        },
        /**
         * Bottom line options.
         */
        bottomLine: {
            /**
             * Styles for a bottom line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.bb.color](#plotOptions.bb.color).
                 *
                 * @type  {Highcharts.ColorString}
                 */
                lineColor: undefined
            }
        },
        /**
         * Top line options.
         *
         * @extends plotOptions.bb.bottomLine
         */
        topLine: {
            styles: {
                lineWidth: 1,
                /**
                 * @type {Highcharts.ColorString}
                 */
                lineColor: undefined
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
        },
        marker: {
            enabled: false
        },
        dataGrouping: {
            approximation: 'averages'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    H.merge(multipleLinesMixin, {
        pointArrayMap: ['top', 'middle', 'bottom'],
        pointValKey: 'middle',
        nameComponents: ['period', 'standardDeviation'],
        linesApiNames: ['topLine', 'bottomLine'],
        init: function (this: Highcharts.BbIndicator): void {
            SMA.prototype.init.apply(this, arguments);

            // Set default color for lines:
            this.options = merge({
                topLine: {
                    styles: {
                        lineColor: this.color
                    }
                },
                bottomLine: {
                    styles: {
                        lineColor: this.color
                    }
                }
            }, this.options);
        },
        getValues: function (
            this: Highcharts.BbIndicator,
            series: Highcharts.BbIndicator,
            params: Highcharts.BbIndicatorParamsOptions
        ): (boolean|Highcharts.IndicatorMultipleValuesObject) {
            var period = (params.period as any),
                standardDeviation = (params.standardDeviation as any),
                xVal = (series.xData as any),
                yVal: Array<Array<number>> = series.yData,
                yValLen: number = yVal ? yVal.length : 0,
                // 0- date, 1-middle line, 2-top line, 3-bottom line
                BB: Array<Array<number>> = [],
                // middle line, top line and bottom line
                ML: number,
                TL: number,
                BL: number,
                date: number,
                xData: Array<number> = [],
                yData: Array<Array<number>> = [],
                slicedX: (Array<number>|undefined),
                slicedY: Array<Array<number>>,
                stdDev: number,
                isOHLC: boolean,
                point: (
                    boolean|
                    Highcharts.IndicatorValuesObject|
                    Highcharts.IndicatorMultipleValuesObject
                ),
                i: (number|undefined);

            if (xVal.length < period) {
                return false;
            }

            isOHLC = isArray(yVal[0]);

            for (i = period; (i as any) <= yValLen; (i as any)++) {
                slicedX = xVal.slice((i as any) - period, i);
                slicedY = yVal.slice((i as any) - period, i);

                point = SMA.prototype.getValues.call(
                    this,
                    ({
                        xData: slicedX,
                        yData: slicedY
                    } as any),
                    params
                );

                date = (point as any).xData[0];
                ML = (point as any).yData[0];
                stdDev = getStandardDeviation(
                    slicedY,
                    (params.index as any),
                    isOHLC,
                    ML
                );
                TL = ML + standardDeviation * stdDev;
                BL = ML - standardDeviation * stdDev;

                BB.push([date, TL, ML, BL]);
                xData.push(date);
                yData.push([TL, ML, BL]);
            }

            return {
                values: BB,
                xData: xData,
                yData: yData
            };
        }
    })
);

/**
 * A bollinger bands indicator. If the [type](#series.bb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.bb
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.bb
 */

''; // to include the above in the js output
