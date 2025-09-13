import { useNavigate as useReactRouterNavigate } from 'react-router-dom';

/**
 * Custom navigation hook that combines React Router's useNavigate with scrolling to top
 * Use this hook instead of the standard useNavigate for consistent scroll behavior
 */
export function useNavigate() {
  const navigate = useReactRouterNavigate();

  const navigateAndScroll = (to: string, options?: any) => {
    // First navigate to the new page
    navigate(to, options);
    
    // Then scroll to the top
    // Using setTimeout to ensure this happens after the navigation completes
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return navigateAndScroll;
}
