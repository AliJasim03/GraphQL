const baseUrl = "https://learn.reboot01.com";
let eventId;

function checkToken() {
    const jwt = localStorage.getItem('hasura-jwt');
    if (!jwt) {
        window.location.href = 'index.html';
    }
}

export async function getEventId() {
    let events = await fetchData(userEventsQuery);
    debugger;
    eventId = parseInt(events.event_user[1].eventId, 10);
}

//check the token when the page is loaded
$(document).ready(function () {
    checkToken();
});

export async function fetchData(query) {
    const jwt = localStorage.getItem('hasura-jwt');
    if (!jwt) {
        window.location.href = 'index.html';
        return;
    }

    const userId = parseInt(parseJwt().userId, 10);
    const variables = { userId };
    try {
        const response = await fetch(`${baseUrl}/api/graphql-engine/v1/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (data.errors) {
            console.error(data.errors);
            if (data.errors[0].message === "Could not verify JWT: JWTExpired") {
                localStorage.removeItem('hasura-jwt');
                window.location.href = 'index.html';
            }
            return;
        }


        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function fetchData_Event(query) {
    const jwt = localStorage.getItem('hasura-jwt');
    if (!jwt) {
        window.location.href = 'index.html';
        return;
    }

    const userId = parseInt(parseJwt().userId, 10);
    debugger
    const variables = { userId, eventId };
    try {
        const response = await fetch(`${baseUrl}/api/graphql-engine/v1/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (data.errors) {
            console.error(data.errors);
            if (data.errors[0].message === "Could not verify JWT: JWTExpired") {
                localStorage.removeItem('hasura-jwt');
                window.location.href = 'index.html';
            }
            return;
        }


        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function fetchObjects(objectIds) {
    const jwt = localStorage.getItem('hasura-jwt');
    if (!jwt) {
        window.location.href = 'index.html';
        return;
    }

    const variables = { objectIds };
    try {
        const response = await fetch(`${baseUrl}/api/graphql-engine/v1/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: objectQuery,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (data.errors) {
            console.error(data.errors);
            if (data.errors[0].message === "Could not verify JWT: JWTExpired") {
                localStorage.removeItem('hasura-jwt');
                window.location.href = 'index.html';
            }
            return;

        }


        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function parseJwt() {
    const token = localStorage.getItem('hasura-jwt') || '';
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const json = JSON.parse(jsonPayload);
    return {
        userId: json['https://hasura.io/jwt/claims']['x-hasura-user-id'],
    };
}


document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('hasura-jwt');
    window.location.href = 'index.html';
});

