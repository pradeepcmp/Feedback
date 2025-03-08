import FeedbackFormReport from '@/app/module/feedbackreport';
import PrivateRoute from '@/app/ProtectedRoute';

export default function FeedbackPage() {
  return (
    <main>
      <PrivateRoute>
      <FeedbackFormReport />
      </PrivateRoute>
    </main>
  );
}