import { json } from '@sveltejs/kit';
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';
import { FLASK_SERVER_URL } from '$lib/config';

export const GET: RequestHandler = async ({ url, fetch }: RequestEvent) => {
    const id = url.searchParams.get('id');
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheet${id ? `?id=${id}` : ''}`);
    const data = await response.json();
    return json(data);
};

export const POST: RequestHandler = async ({ request, fetch }: RequestEvent) => {
    const data = await request.json();
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return json(result);
};

export const PUT: RequestHandler = async ({ url, request, fetch }: RequestEvent) => {
    const id = url.searchParams.get('id');
    if (!id) {
        return json({ error: 'No id provided' }, { status: 400 });
    }
    const data = await request.json();
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheet?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return json(result);
};

