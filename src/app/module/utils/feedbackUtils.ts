// utils/feedbackUtils.ts

import { FeedbackData, AdvancedMetrics, TimelineDataPoint, ChartDataPoint } from '@/app/types/feedbackreport';

export const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
];

export const getDateRange = (range:string):Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (range) {
    case 'today':
      return today;
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    case 'last7days':
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      return last7Days;
    case 'last30days':
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);
      return last30Days;
    case 'thisMonth':
      return new Date(today.getFullYear(), today.getMonth(), 1);
    case 'lastMonth':
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    default:
      return new Date(0);
  }
};

export const calculateMetrics = (data: FeedbackData[], uniqueBranches: string[]): AdvancedMetrics | null => {
  if (data.length === 0) {
    return null;
  }

  const metrics: AdvancedMetrics = {
    totalResponses: data.length,
    averageRatings: {
      overall: Number((data.reduce((acc, curr) => acc + curr.overallExperience, 0) / data.length).toFixed(2)),
      service: Number((data.reduce((acc, curr) => acc + curr.customerService, 0) / data.length).toFixed(2)),
      staff: Number((data.reduce((acc, curr) => acc + curr.staffBehavior, 0) / data.length).toFixed(2)),
      collection: Number((data.reduce((acc, curr) => acc + curr.jewelryCollection, 0) / data.length).toFixed(2))
    },
    recommendationRate: Number(((data.filter(item => item.wouldRecommend === 'yes').length / data.length) * 100).toFixed(2)),
    branchPerformance: {}
  };

  uniqueBranches.forEach(branch => {
    const branchData = data.filter(item => item.branch === branch);
    if (branchData.length > 0) {
      metrics.branchPerformance[branch] = {
        total: branchData.length,
        average: Number((branchData.reduce((acc, curr) => acc + curr.overallExperience, 0) / branchData.length).toFixed(2)),
        recommendation: Number(((branchData.filter(item => item.wouldRecommend === 'yes').length / branchData.length) * 100).toFixed(2))
      };
    }
  });

  return metrics;
};

export const calculateChartData = (feedbackData: FeedbackData[], uniqueBranches: string[]): ChartDataPoint[] => {
  return uniqueBranches.map(branch => {
    const branchData = feedbackData.filter(item => item.branch === branch);
    return {
      branch,
      overallExperience: Number((branchData.reduce((acc, curr) => acc + curr.overallExperience, 0) / branchData.length).toFixed(2)),
      customerService: Number((branchData.reduce((acc, curr) => acc + curr.customerService, 0) / branchData.length).toFixed(2)),
      staffBehavior: Number((branchData.reduce((acc, curr) => acc + curr.staffBehavior, 0) / branchData.length).toFixed(2)),
      jewelryCollection: Number((branchData.reduce((acc, curr) => acc + curr.jewelryCollection, 0) / branchData.length).toFixed(2))
    };
  });
};

export const calculateTimelineData = (feedbackData: FeedbackData[]): TimelineDataPoint[] => {
  const timeline = feedbackData.reduce((acc: { [key: string]: TimelineDataPoint }, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        date,
        count: 0,
        averageRating: 0,
        totalRatings: 0
      };
    }
    acc[date].count++;
    acc[date].totalRatings += curr.overallExperience;
    acc[date].averageRating = Number((acc[date].totalRatings / acc[date].count).toFixed(2));
    return acc;
  }, {});

  return Object.values(timeline).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const exportToCSV = (filteredData: FeedbackData[]) => {
  const headers = [
    'Date',
    'Mobile',
    'Branch',
    'Overall Experience',
    'Customer Service',
    'Staff Behavior',
    'Jewelry Collection',
    'Would Recommend',
    'Discovery Methods',
    'Comments'
  ];

  const csvData = filteredData.map(feedback => [
    new Date(feedback.createdAt).toLocaleDateString(),
    feedback.mobileNo,
    feedback.branch,
    feedback.overallExperience,
    feedback.customerService,
    feedback.staffBehavior,
    feedback.jewelryCollection,
    feedback.wouldRecommend,
    feedback.discoveryMethods.join('; '),
    feedback.additionalComments || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `feedback_report_${new Date().toLocaleDateString()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};