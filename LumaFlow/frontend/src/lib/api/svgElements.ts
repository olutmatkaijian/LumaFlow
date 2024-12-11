import { FLASK_SERVER_URL } from '../../config';

export async function fetchSvgElements() {
    const response = await fetch(`${FLASK_SERVER_URL}/api/svg-elements`);
    if (!response.ok) {
        throw new Error('Failed to fetch SVG elements');
    }
    return response.json();
}

