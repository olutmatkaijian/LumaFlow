import { FLASK_SERVER_URL } from '../../config';

export async function uploadScript(formData: FormData) {
  const response = await fetch(`${FLASK_SERVER_URL}/api/upload-script`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload script');
  }
  return response.json();
}