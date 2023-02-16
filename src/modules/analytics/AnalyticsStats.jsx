import { StatsCard } from '@/src/modules/analytics/StatsCard'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'

export const AnalyticsStats = ({ loading, statsData }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  return (
    <div>
      {loading ? ' Loading...' : <StatDisplay liquidityTokenDecimals={liquidityTokenDecimals} router={router} statsData={statsData} />}
    </div>
  )
}

const StatDisplay = ({ liquidityTokenDecimals, router, statsData }) => (
  <div className='flex items-start justify-between pb-6 lg:pb-10 flex-wrap gap-x-2 gap-y-4'>
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Total Capacity' value={
              formatCurrency(
                convertFromUnits(
                  statsData?.combined?.totalCapacity || 0,
                  liquidityTokenDecimals
                ).toString(),
                router.locale
              ).short
              }
    />
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Covered' value={
              formatCurrency(
                convertFromUnits(
                  statsData?.combined?.totalCoveredAmount,
                  liquidityTokenDecimals
                ).toString(),
                router.locale
              ).short
            }
    />
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Commitment' value={
              formatCurrency(
                convertFromUnits(
                  statsData?.combined?.activeCoveredAmount,
                  liquidityTokenDecimals
                ).toString(),
                router.locale
              ).short
            }
    />
    <StatsCard
      titleClass='text-999BAB lg:text-404040'
      valueClass='uppercase'
      title='Cover Fee' value={
              formatCurrency(
                convertFromUnits(
                  statsData?.combined?.totalCoverFee,
                  liquidityTokenDecimals
                ).toString(),
                router.locale
              ).short
            }
    />
  </div>
)
