import React, { useRef, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'

import HighchartsExporting from 'highcharts/modules/exporting'
import { hyphenToPascalCase } from '@/utils/hypenToPascalCase'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

const colors = {
  'popular-defi-apps': '#4E7DD9',
  prime: '#7800D6',
  okx: '#21AD8C',
  binance: '#B48B34',
  coinbase: '#FA5C2F',
  defi: '#D60000',
  huobi: '#454545'
}

const getColorForCover = (cover) => {
  const color = colors[cover]

  return color ?? '#454545'
}

function hexToRgba (hex, alpha) {
  // Remove the '#' character from the hex string
  hex = hex.replace('#', '')

  // Split the hex string into red, green, and blue components
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Create the RGBA string using the red, green, blue, and alpha values
  const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'

  // Return the RGBA string
  return rgba
}

const HistoricalRoiByCover = ({ loading, selectedChain, data }) => {
  const chartRef = useRef()

  const [selectedCover, setSelectedCover] = useState()

  const groupCovers = {}

  if (data) {
    data.forEach((item) => {
      if (item.chainId === selectedChain) {
        groupCovers[item.coverKeyString] = groupCovers[
          item.coverKeyString
        ]
          ? [...groupCovers[item.coverKeyString], item]
          : [item]
      }
    })
  }

  const series = Object.entries(groupCovers).map(([key, value]) => {
    if (selectedCover && selectedCover !== key) {
      return undefined
    }

    const color = getColorForCover(key)

    return {
      type: 'areaspline',
      showInNavigator: true,
      name: hyphenToPascalCase(key),
      data: value
        .map((item) => ({
          x: new Date(item.startDate).valueOf(),
          y: parseFloat((parseFloat(item.apr) * 100).toFixed(2))
        }))
        .sort((a, b) => a.x - b.x),
      lineWidth: 3,
      lineColor: color,
      color: color,
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, hexToRgba(color, 0.2)],
          [1, hexToRgba(color, 0)]
        ]
      },
      marker: {
        fillColor: 'white',
        lineWidth: 2,
        radius: 3,
        lineColor: color
      },
      animation: {
        duration: 500
      }
    }
  }).filter(v => v !== undefined)

  const chartOptions = {
    xAxis: {
      labels: {
        format:
          "<span class='font-poppins text-black uppercase'>{value:%b %y}</span>",
        useHTML: true
      },
      ordinal: false,
      minRange: 1 * 24 * 3600 * 1000,
      lineWidth: 0,
      lineColor: '#01052D'
    },
    yAxis: {
      opposite: false,
      labels: {
        formatter: function () {
          return `<span class='font-poppins text-black'>${this.value}%</span>`
        },
        useHTML: true
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#01052D40',
      gridLineWidth: 0.5,
      min: 0,
      lineWidth: 0,
      lineColor: '#01052D',
      showLastLabel: true
    },
    plotOptions: {
      areaspline: {
        lineWidth: 1, // Reduce the line width to make it more pointy
        step: true, // Set step to true to draw the line as a step line
        linecap: 'square'
      }
    },
    series,
    chart: {
      backgroundColor: 'transparent',
      height: '424px'
    },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      animation: true,
      xDateFormat: false,
      useHTML: true,
      padding: 0,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderWidth: 0,
      shadow: false,
      shape: 'rect',
      formatter: function () {
        const result = []
        for (let i = 0; i < this.points.length; i += 4) {
          result.push(this.points.slice(i, i + 4))
        }

        return `
          <div class='px-4 pr-6 py-3 bg-white bg-opacity-95 rounded-tooltip border border-B0C4DB shadow-hc-tooltip'>
            <div class='grid gap-4' style='grid-template-columns: ${Array.from({ length: result.length }).map(() => 'auto').join(' ')};'>
              ${result.map(group => (
                `<div>
                  ${group.map((point, index) => (
                    `
                    <p class='font-semibold font-poppins tracking-normal text-01052D${index !== group.length ? ' mb-2.5' : ''}${index === 0 ? ' -mt-2.5' : ''}'>
                      <div class='text-xs font-semibold' style="color: ${point.series.color};font-size: 12px;line-height: 24px;">${point.series.name}</div>
                      <div class='text-sm font-semibold text-black'>${point.y}%</div>
                    </p>
                    `
                  )).join('')}
                </div>`
              )).join('')}
            </div>
          </div>`
      },
      headerFormat: '',
      hideDelay: 100,
      outside: false,
      shared: true
    },
    navigator: {
      handles: {
        symbols: [
          'url(/icons/chart-navigator-handle.svg)',
          'url(/icons/chart-navigator-handle.svg)'
        ],
        lineWidth: 1,
        width: 20,
        height: 30
      },
      maskFill: 'rgba(66, 137, 242, 0.3)',
      outlineWidth: 0,
      xAxis: {
        // tickInterval: 5 * 24 * 3600 * 1000,
        labels: {
          format:
            "<span class='font-poppins text-black uppercase'>{value:%b %y}</span>",
          useHTML: true,
          style: {
            color: '#01052D'
          },
          align: 'right',
          y: 14
        }
      }
    },
    scrollbar: {
      enabled: false
    }
  }

  // useEffect(() => {
  //   if (chartRef.current && chartRef?.current?.chart) {
  //     chartRef.current?.chart?.showLoading()
  //   }
  // }, [])

  return (
    <div data-testid='total-liquidity-chart' className='h-full pt-1'>
      {!loading && (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType='stockChart'
          ref={chartRef}
        />
      )}

      <div className='flex flex-wrap justify-center items-center gap-4 mt-3'>
        {Object.keys(groupCovers).map((key) => (
          <div
            role='checkbox' aria-checked={selectedCover === key} onClick={() => {
              if (selectedCover === key) {
                setSelectedCover(undefined)
              } else {
                setSelectedCover(key)
              }
            }} className={`cursor-pointer${selectedCover ? selectedCover === key ? '' : ' opacity-50' : ''} flex items-center gap-1`} key={key}
          >
            <div
              className='rounded-full h-3.5 w-3.5'
              style={{
                background: getColorForCover(
                  key
                )
              }}
            />
            <span className='text-sm font-semibold'>{hyphenToPascalCase(key)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { HistoricalRoiByCover }
