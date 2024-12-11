import { browser } from '$app/environment';

// Ensure that any browser-only code is not executed during SSR
export const load = async ({ url }) => {
  if (browser) {
    // Client-side initialization code here
  }
  return {};
};

