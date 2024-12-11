import { FLASK_SERVER_URL } from '../../config';

export async function fetchFlowsheets() {
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheets`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function createFlowsheet(name: string, diagramType: string) {
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, diagram_type: diagramType }),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function saveFlowsheet(id: string, content: any) {
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function loadFlowsheet(id: string) {
    const response = await fetch(`${FLASK_SERVER_URL}/api/flowsheets/${id}`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function fetchSvgElements(domainName: string) {
    const response = await fetch(`${FLASK_SERVER_URL}/api/domains/${domainName}/svg_elements`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch SVG elements');
    }
    return response.json();
}

export async function fetchSvgLibraries() {
    const response = await fetch(`${FLASK_SERVER_URL}/api/svg-libraries`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch SVG libraries');
    }
    return response.json();
}

export async function fetchDomainSvgElements(domainName: string) {
   const response = await fetch(`${FLASK_SERVER_URL}/api/domains/${domainName}/svg_elements`, {
       credentials: 'include',
   });
   if (!response.ok) {
       throw new Error('Failed to fetch domain SVG elements');
   }
   return response.json();
}

export async function fetchStreams() {
    const response = await fetch(`${FLASK_SERVER_URL}/api/streams`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch streams');
    }
    return response.json();
}

