import { create } from 'zustand';
import axios from 'axios';
import { FeedbackFormData, initialFormState, StoreState  } from '../types/feedback';

interface FeedbackStore extends StoreState {
  loading: boolean;
  error: string | null;
  formData: FeedbackFormData;
  submitFeedback: (feedback: FeedbackFormData) => Promise<void>;
  resetForm: () => void;
  resetError: () => void;
  updateFormData: (data: Partial<FeedbackFormData>) => void;
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  loading: false,
  error: null,
  formData: initialFormState,

  submitFeedback: async (feedback) => {
    try {
      set({ loading: true, error: null });
      await axios.post('https://cust.spacetextiles.net/feedback_submit', feedback);
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit feedback',
        loading: false 
      });
    }
  },

  resetForm: () => {
    set({ 
      formData: initialFormState,
      error: null 
    });
  },

  resetError: () => {
    set({ error: null });
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
  }
}));