import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

const HomePage = lazy(() => import('@/pages/HomePage'));
const BuilderPage = lazy(() => import('@/pages/BuilderPage'));
const FillPage = lazy(() => import('@/pages/FillPage'));
const InstancesPage = lazy(() => import('@/pages/InstancesPage'));

function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyPage>
        <HomePage />
      </LazyPage>
    )
  },
  {
    path: '/builder/new',
    element: (
      <LazyPage>
        <BuilderPage />
      </LazyPage>
    )
  },
  {
    path: '/builder/:templateId',
    element: (
      <LazyPage>
        <BuilderPage />
      </LazyPage>
    )
  },
  {
    path: '/fill/:templateId',
    element: (
      <LazyPage>
        <FillPage />
      </LazyPage>
    )
  },
  {
    path: '/fill/:templateId/:instanceId',
    element: (
      <LazyPage>
        <FillPage />
      </LazyPage>
    )
  },
  {
    path: '/instances/:templateId',
    element: (
      <LazyPage>
        <InstancesPage />
      </LazyPage>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
