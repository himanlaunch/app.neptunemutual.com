import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { formatInsightsMonthId, getMonthsBetweenDates } from '@/lib/dates'
import { useAppConstants } from '@/src/context/AppConstants'
import { useProtocolMonthData } from '@/src/hooks/useProtocolMonthData'
import { toBN } from '@/utils/bn'
import { useLanguageContext } from '@/src/i18n/i18n'

const getInitialDateRange = (from) => {
  const currentDate = from

  const eightMonthsBack = new Date(currentDate)
  eightMonthsBack.setMonth(eightMonthsBack.getMonth() - 7)
  eightMonthsBack.setDate(1)
  eightMonthsBack.setHours(0, 0, 0, 0)

  currentDate.setDate(1)
  currentDate.setHours(0, 0, 0, 0)

  return [new Date(eightMonthsBack), new Date(currentDate.getTime())]
}

function useCoverEarningInsights () {
  const [dateRange, setDateRange] = useState(getInitialDateRange(new Date()))

  const { data, loading, fetchData } = useProtocolMonthData()

  const { liquidityTokenDecimals } = useAppConstants()

  const [yAxisData, setYAxisData] = useState([])

  const { locale } = useLanguageContext()

  const [labels, setLabels] = useState(getMonthsBetweenDates(locale, dateRange[0], dateRange[1]))

  const onPrevious = () => {
    const newInitialDate = dateRange[0]
    newInitialDate.setMonth(newInitialDate.getUTCMonth())

    setDateRange(getInitialDateRange(newInitialDate))
  }

  const onNext = () => {
    const newInitialDate = dateRange[1]
    newInitialDate.setMonth(newInitialDate.getUTCMonth() + 9)

    setDateRange(getInitialDateRange(newInitialDate))
  }

  useEffect(() => {
    if (data) {
      const newLabels = getMonthsBetweenDates(locale, dateRange[0], dateRange[1])

      setLabels(newLabels)

      const monthDataInRange = data.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id >= dateRange[0] && id <= dateRange[1]
      }).map(monthData => {
        return {
          ...monthData,
          id: formatInsightsMonthId(locale, new Date(monthData.id), { timeZone: 'UTC' })
        }
      })

      setYAxisData(newLabels.map(lbl => {
        const month = lbl.split(' ')[0]
        const foundMonth = monthDataInRange.find(monthData => { return monthData.id === month })

        if (foundMonth) {
          return foundMonth.nonCumulativeCoverFee
        }

        return '0'
      }
      ).map(val => { return toBN(val || 0).toNumber() }))
    }
  }, [data, dateRange, liquidityTokenDecimals, locale])

  const hasPrevious = useMemo(() => {
    if (data) {
      return data.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id < dateRange[0]
      }).length > 0
    } else {
      return false
    }
  }, [data, dateRange])

  const hasNext = useMemo(() => {
    if (data) {
      return data.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id > dateRange[1]
      }).length > 0
    } else {
      return false
    }
  }, [data, dateRange])

  return {
    hasNext,
    hasPrevious,
    onNext,
    onPrevious,
    labels,
    yAxisData,
    loading,
    fetchData
  }
}

export default useCoverEarningInsights
