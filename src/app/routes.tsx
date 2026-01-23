import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { CreateComplaintPage } from '../pages/CreateComplaintPage';
import { TrackComplaintPage } from '../pages/TrackComplaintPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { RequireAuth } from './RequireAuth';

export const routes: RouteObject[] = [
  { index: true, element: <RequireAuth><HomePage /></RequireAuth> },
  { path: 'create', element: <RequireAuth><CreateComplaintPage /></RequireAuth> },
  { path: 'track', element: <RequireAuth><TrackComplaintPage /></RequireAuth> },
  { path: 'feedback', element: <RequireAuth><FeedbackPage /></RequireAuth> },
];
