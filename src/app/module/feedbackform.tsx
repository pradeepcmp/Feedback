"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import axios from 'axios';
import logo from '../../../public/logo1.png';
import { useFeedbackStore } from '../store/feedbackStore';
import { Notification } from './notification';
import { FeedbackFormData, initialFormState } from '../types/feedback';


const FeedbackForm = () => {
  const params = useParams();
  const router = useRouter();
  const mobileNo = params.mobileNo as string;
  const branch = params.branch as string;
  const [notification, setNotification] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null);
  const [currentEvent, setCurrentEvent] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { submitFeedback, resetForm, loading, error } = useFeedbackStore();

  const form = useForm<FeedbackFormData>({
    defaultValues: {
      mobileNo: mobileNo,
      branch: branch,
      overallExperience: 0,
      customerService: 0,
      staffBehavior: 0,
      jewelryCollection: 0,
      wouldRecommend: '',
      discoveryMethods: [],
      additionalComments: ''
    }
  });
  // Fetch current event on component mount
  React.useEffect(() => {
    const fetchCurrentEvent = async () => {
      try {
        const response = await axios.get('https://cust.spacetextiles.net/events');
        setCurrentEvent(response.data.currentEvent);
      } catch (error) {
        console.error('Failed to fetch current event:', error);
      }
    };

    fetchCurrentEvent();
  }, []);

  const discoveryOptions = [
    { id: "Television", label: "Television" },
    { id: "Mass Media", label: "Mass Media" },
    { id: "Social Media", label: "Social Media" },
    { id: "Notice", label: "Notice" },
    { id: "News Paper", label: "News Paper" },
    { id: "Invites", label: "Invites" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const StarRating = ({ name, value, onChange }: { name: keyof FeedbackFormData; value: number; onChange: (value: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className="focus:outline-none"
            onClick={() => onChange(rating)}
          >
            <Star
              className={`w-6 h-6 ${
                rating <= value
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleReset = () => {
    form.reset(initialFormState);
    resetForm();
    setNotification({
      type: 'success',
      title: 'Form Reset',
      message: 'The form has been reset successfully.'
    });
  };

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      await submitFeedback({ ...data, mobileNo });
      setNotification({
        type: 'success',
        title: 'Success',
        message: 'Thank you for your feedback!'
      });
      router.push('/thankyou');
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to submit feedback'
      });
    }
  };

  if (!mobileNo || !/^\d{10}$/.test(mobileNo) || !branch) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Invalid or missing mobile number or branch code. Please use the link sent to your mobile.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-center items-center w-full h-full mb-6">
            <Image src={logo} alt="space" width={300} height={200} priority />
          </div>
          <CardTitle className="text-2xl text-blue-800 flex justify-center mb-4">Feedback</CardTitle>
          <CardDescription className="text-blue-800">
            Please Share your experience with us to improve our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Star Rating Fields */}
            <div className="space-y-4">
              {[
                { name: 'overallExperience' as const, label: 'Overall Experience' },
                { name: 'customerService' as const, label: 'Customer Service' },
                { name: 'staffBehavior' as const, label: 'Staff Behavior' },
                { name: 'jewelryCollection' as const, label: 'Jewelry Collection' },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base text-gray-800">{label}</FormLabel>
                        <FormControl>
                          <StarRating
                            name={name}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Would Recommend */}
            <FormField
              control={form.control}
              name="wouldRecommend"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <FormLabel className="text-gray-800 whitespace-nowrap">Would you recommend to others?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="text-gray-800">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="text-gray-800">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* How did you know */}
            <FormField
              control={form.control}
              name="discoveryMethods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">How did you know about {currentEvent}?</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {discoveryOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, option.id]);
                            } else {
                              field.onChange(
                                currentValue.filter((item) => item !== option.id)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={option.id} className="text-gray-800">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Comments */}
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="resize-none text-blue-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default FeedbackForm;