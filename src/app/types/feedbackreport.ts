// types/feedbackTypes.ts

export interface FeedbackData {
    id: string;
    createdAt: string;
    mobileNo: string;
    branch: string;
    overallExperience: number;
    customerService: number;
    staffBehavior: number;
    jewelryCollection: number;
    wouldRecommend: 'yes' | 'no';
    discoveryMethods: string[];
    additionalComments?: string;
  }
  
  export interface TimelineDataPoint {
    date: string;
    count: number;
    averageRating: number;
    totalRatings: number;
  }
  
  export interface AdvancedMetrics {
    totalResponses: number;
    averageRatings: {
      overall: number;
      service: number;
      staff: number;
      collection: number;
    };
    recommendationRate: number;
    branchPerformance: {
      [key: string]: {
        total: number;
        average: number;
        recommendation: number;
      };
    };
  }
  
  export interface ChartDataPoint {
    branch: string;
    overallExperience: number;
    customerService: number;
    staffBehavior: number;
    jewelryCollection: number;
  }
  
  export interface DateRangeOption {
    value: string;
    label: string;
  }