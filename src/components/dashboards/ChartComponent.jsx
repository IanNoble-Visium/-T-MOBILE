import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ChartComponent = ({ chart, isEditing, onUpdate }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [error, setError] = useState(null);
  const updateIntervalRef = useRef(null);

  // Generate mock data update
  const generateMockDataUpdate = (chartData) => {
    const updated = { ...chartData };

    switch (chartData.type) {
      case 'line':
      case 'bar':
        if (updated.data?.values) {
          updated.data.values = updated.data.values.map(v =>
            Math.max(0, v + (Math.random() - 0.5) * 20)
          );
        }
        break;

      case 'pie':
        if (updated.data?.items) {
          updated.data.items = updated.data.items.map(item => ({
            ...item,
            value: Math.max(0, item.value + (Math.random() - 0.5) * 50)
          }));
        }
        break;

      case 'scatter':
        if (updated.data?.points) {
          updated.data.points = updated.data.points.map(p => [
            Math.max(0, p[0] + (Math.random() - 0.5) * 5),
            Math.max(0, p[1] + (Math.random() - 0.5) * 5)
          ]);
        }
        break;

      case 'gauge':
        if (updated.data) {
          updated.data.value = Math.max(0, Math.min(100,
            updated.data.value + (Math.random() - 0.5) * 10
          ));
        }
        break;

      case 'heatmap':
        if (updated.data?.values) {
          updated.data.values = updated.data.values.map(v =>
            Math.max(0, Math.min(100, v + (Math.random() - 0.5) * 15))
          );
        }
        break;

      case 'network-topology':
        // For network topology, update node statuses randomly
        if (updated.data?.nodes) {
          updated.data.nodes = updated.data.nodes.map(node => ({
            ...node,
            status: Math.random() > 0.8 ? 'warning' : 'active'
          }));
        }
        break;
    }

    return updated;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    try {
      setError(null);

      // Initialize chart
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current, 'dark');
      }

      // Prepare chart options
      const options = prepareChartOptions(chart);

      // Set options
      chartInstance.current.setOption(options);

      // Handle window resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      // Start real-time updates
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }

      updateIntervalRef.current = setInterval(() => {
        const updatedChart = generateMockDataUpdate(chart);
        const newOptions = prepareChartOptions(updatedChart);
        chartInstance.current?.setOption(newOptions);
      }, 3000); // Update every 3 seconds

      return () => {
        window.removeEventListener('resize', handleResize);
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }
      };
    } catch (err) {
      console.error('Error rendering chart:', err);
      setError(err.message);
    }
  }, [chart]);

  const prepareChartOptions = (chartData) => {
    const baseOptions = {
      title: {
        text: chartData.title || 'Chart',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#E20074',
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '15%',
        bottom: '10%',
        containLabel: true
      },
      textStyle: {
        color: '#999'
      }
    };

    switch (chartData.type) {
      case 'line':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: chartData.data?.categories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: [
            {
              data: chartData.data?.values || [],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#E20074' },
              areaStyle: { color: 'rgba(226, 0, 116, 0.2)' }
            }
          ]
        };

      case 'bar':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: chartData.data?.categories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: [
            {
              data: chartData.data?.values || [],
              type: 'bar',
              itemStyle: { color: '#0066CC' }
            }
          ]
        };

      case 'pie':
        return {
          ...baseOptions,
          tooltip: { trigger: 'item' },
          series: [
            {
              name: chartData.title,
              type: 'pie',
              radius: '50%',
              data: chartData.data?.items || [],
              itemStyle: {
                borderColor: '#1e293b',
                borderWidth: 2
              },
              label: {
                color: '#fff'
              }
            }
          ]
        };

      case 'scatter':
        return {
          ...baseOptions,
          xAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: [
            {
              data: chartData.data?.points || [],
              type: 'scatter',
              symbolSize: 8,
              itemStyle: { color: '#E20074' }
            }
          ]
        };

      case 'gauge':
        return {
          ...baseOptions,
          series: [
            {
              type: 'gauge',
              startAngle: 200,
              endAngle: -20,
              min: 0,
              max: 100,
              splitNumber: 10,
              axisLine: {
                lineStyle: {
                  width: 30,
                  color: [[0.3, '#67e0eb'], [0.7, '#37b7ff'], [1, '#fd666d']]
                }
              },
              pointer: {
                itemStyle: { color: 'auto' }
              },
              axisTick: {
                distance: -30,
                length: 8,
                lineStyle: { color: '#fff', width: 2 }
              },
              splitLine: {
                distance: -30,
                length: 30,
                lineStyle: { color: '#fff', width: 4 }
              },
              axisLabel: {
                color: 'auto',
                distance: 40,
                fontSize: 16
              },
              detail: {
                valueAnimation: true,
                formatter: '{value}%',
                color: 'auto'
              },
              data: [{ value: chartData.data?.value || 50, name: chartData.title }]
            }
          ]
        };

      case 'network-topology':
        // Transform nodes and edges for force-directed graph
        const nodes = (chartData.data?.nodes || []).map(node => ({
          name: node.name || node.id,
          id: node.id,
          value: 10,
          itemStyle: {
            color: node.status === 'active' ? '#E20074' : node.status === 'warning' ? '#FFA500' : '#999'
          },
          label: {
            show: true,
            color: '#fff',
            fontSize: 10
          }
        }));

        const links = (chartData.data?.edges || []).map(edge => ({
          source: edge.source,
          target: edge.target,
          lineStyle: {
            color: edge.status === 'active' ? '#0066CC' : '#666',
            width: 2
          }
        }));

        return {
          ...baseOptions,
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#E20074'
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              force: {
                repulsion: 100,
                gravity: 0.1,
                edgeLength: 100
              },
              roam: true,
              nodes,
              links,
              lineStyle: {
                color: '#666',
                width: 1
              },
              label: {
                position: 'right',
                formatter: '{b}'
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          ]
        };

      case 'heatmap':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: chartData.data?.xCategories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'category',
            data: chartData.data?.yCategories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'vertical',
            right: '10',
            bottom: '20%',
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          series: [
            {
              data: chartData.data?.values || [],
              type: 'heatmap',
              emphasis: {
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
                }
              }
            }
          ]
        };

      case 'treemap':
        return {
          ...baseOptions,
          series: [
            {
              type: 'treemap',
              data: chartData.data?.items || [],
              roam: true,
              label: {
                show: true,
                color: '#fff'
              },
              itemStyle: {
                borderColor: '#1e293b',
                borderWidth: 2
              }
            }
          ]
        };

      case 'radar':
        return {
          ...baseOptions,
          radar: {
            indicator: chartData.data?.indicators || [],
            shape: 'polygon',
            splitNumber: 4,
            name: {
              textStyle: {
                color: '#999'
              }
            },
            splitLine: {
              lineStyle: {
                color: ['#444', '#555', '#666', '#777']
              }
            },
            splitArea: {
              areaStyle: {
                color: ['rgba(226, 0, 116, 0.1)', 'rgba(226, 0, 116, 0.2)']
              }
            },
            axisLine: {
              lineStyle: {
                color: '#666'
              }
            }
          },
          series: [
            {
              name: chartData.title,
              type: 'radar',
              data: chartData.data?.series || [],
              itemStyle: { color: '#E20074' },
              areaStyle: { color: 'rgba(226, 0, 116, 0.3)' }
            }
          ]
        };

      case 'sankey':
        return {
          ...baseOptions,
          series: [
            {
              type: 'sankey',
              data: chartData.data?.nodes || [],
              links: chartData.data?.links || [],
              emphasis: {
                focus: 'series'
              },
              lineStyle: {
                color: 'source',
                curveness: 0.5
              },
              itemStyle: {
                borderColor: '#1e293b',
                borderWidth: 1
              },
              label: {
                color: '#fff'
              }
            }
          ]
        };

      case 'funnel':
        return {
          ...baseOptions,
          tooltip: { trigger: 'item' },
          series: [
            {
              name: chartData.title,
              type: 'funnel',
              left: '10%',
              top: 60,
              bottom: 60,
              width: '80%',
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                show: true,
                position: 'inside',
                color: '#fff'
              },
              itemStyle: {
                borderColor: '#1e293b',
                borderWidth: 1
              },
              emphasis: {
                label: {
                  fontSize: 20
                }
              },
              data: chartData.data?.items || []
            }
          ]
        };

      case 'donut':
        return {
          ...baseOptions,
          tooltip: { trigger: 'item' },
          series: [
            {
              name: chartData.title,
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: '#1e293b',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: chartData.data?.items || []
            }
          ]
        };

      case 'horizontal-bar':
        return {
          ...baseOptions,
          xAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'category',
            data: chartData.data?.categories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: [
            {
              data: chartData.data?.values || [],
              type: 'bar',
              itemStyle: { color: '#0066CC' }
            }
          ]
        };

      case 'stacked-bar':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: chartData.data?.categories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: (chartData.data?.series || []).map((s, idx) => ({
            name: s.name,
            data: s.values,
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: ['#E20074', '#0066CC', '#FFA500', '#00D9FF', '#FF6B6B', '#4ECDC4'][idx % 6]
            }
          }))
        };

      case 'area':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: chartData.data?.categories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: [
            {
              data: chartData.data?.values || [],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#E20074' },
              areaStyle: { color: 'rgba(226, 0, 116, 0.4)' },
              emphasis: {
                focus: 'series'
              }
            }
          ]
        };

      case 'candlestick':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: chartData.data?.categories || [],
            axisLine: { lineStyle: { color: '#444' } }
          },
          yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#444' } }
          },
          series: [
            {
              data: chartData.data?.values || [],
              type: 'candlestick',
              itemStyle: {
                color: '#E20074',
                color0: '#0066CC',
                borderColor: '#E20074',
                borderColor0: '#0066CC'
              }
            }
          ]
        };

      case 'sunburst':
        return {
          ...baseOptions,
          series: [
            {
              type: 'sunburst',
              data: chartData.data?.items || [],
              radius: [0, '90%'],
              label: {
                rotate: 'radial',
                color: '#fff'
              },
              itemStyle: {
                borderRadius: 7,
                borderWidth: 2,
                borderColor: '#1e293b'
              }
            }
          ]
        };

      default:
        return baseOptions;
    }
  };

  const handleRefresh = () => {
    if (chartInstance.current) {
      chartInstance.current.resize();
    }
  };

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-300">Error rendering chart</p>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
        <button
          onClick={handleRefresh}
          className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-[#E20074]"
          title="Refresh chart"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={chartRef}
        className="w-full h-80 bg-slate-800/50 rounded-lg"
      />
      {chart.description && (
        <p className="text-xs text-slate-400">{chart.description}</p>
      )}
    </div>
  );
};

export default ChartComponent;

