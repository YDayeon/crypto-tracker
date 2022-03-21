import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atom';

interface ChartProps {
  coinId: string;
}

interface IHistoricalData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type='line'
          series={[
            {
              name: 'Price',
              data: data?.map((price) => price.close) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            chart: {
              background: 'transparent',
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: 'smooth',
              width: 3,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              type: 'datetime',
              labels: {
                show: false,
                datetimeFormatter: {
                  month: "MMM 'yy",
                },
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },

              categories: data?.map((price) => price.time_close),
            },
            fill: {
              type: 'gradient',
              gradient: {
                gradientToColors: ['#fffa65'],
                stops: [0, 100],
              },
            },
            colors: ['#7d5fff'],
            tooltip: {
              y: {
                formatter: (value) => `${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
