import type { PageLoad } from './$types';

// Disable server-side rendering for this route
export const ssr = false;

// Enable client-side rendering
export const csr = true;

export const load: PageLoad = async ({ params }) => {
  return {
    flowsheetId: params.id
  };
};

