export interface FeedbackFormData {
  mobileNo: string;
  branch: string;
  overallExperience: number;
  customerService: number;
  staffBehavior: number;
  jewelryCollection: number;
  wouldRecommend: string;
  discoveryMethods: string[];
  additionalComments?: string;
}

export const initialFormState: FeedbackFormData = {
  mobileNo: '',
  branch: '',
  overallExperience: 0,
  customerService: 0,
  staffBehavior: 0,
  jewelryCollection: 0,
  wouldRecommend: '',
  discoveryMethods: [],
  additionalComments: ''
};

export interface StoreState {
  loading: boolean;
  error: string | null;
  formData: FeedbackFormData;
}
