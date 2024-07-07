$('#logout').click(function () {
    localStorage.removeItem('hasura-jwt');
    window.location.href = 'index.html';
});

const baseUrl = "https://learn.reboot01.com";


async function fetchData(query) {
    const jwt = localStorage.getItem('hasura-jwt');
    if (!jwt) {
        window.location.href = 'index.html';
        return;
    }

    const id = parseInt(parseJwt().userId, 10); // Parse userId as an integer

    try {
        const response = await fetch(`${baseUrl}/api/graphql-engine/v1/graphql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                variables : id
            })
        });

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}




function displayUserData(data) {


    const userInfoDiv = document.getElementById('user-info');

    const user = data.user[0];
    userInfoDiv.innerHTML = `
        <p>ID: ${user.id}</p>
        <p>Login: ${user.login}</p>
    `;

    // Display graphs
    displayGraphs(data);
}

function displayGraphs(data) {
    const graphsDiv = document.getElementById('graphs');

    // Example: XP earned over time
    const xpData = data.transaction.filter(tx => tx.type === 'xp');
    const xpGraph = generateXpGraph(xpData);
    graphsDiv.appendChild(xpGraph);

    // Example: Grade distribution
    const gradeData = data.progress;
    const gradeGraph = generateGradeGraph(gradeData);
    graphsDiv.appendChild(gradeGraph);
}

function generateXpGraph(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '300');

    // Generate graph here...

    return svg;
}

function generateGradeGraph(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '300');

    // Generate graph here...

    return svg;
}

function generateXpGraph(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '300');

    const barWidth = 40;
    const maxHeight = 200;

    const maxXP = Math.max(...data.map(d => d.amount));
    const scale = maxHeight / maxXP;

    data.forEach((d, i) => {
        const barHeight = d.amount * scale;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', i * (barWidth + 10));
        rect.setAttribute('y', maxHeight - barHeight);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', 'blue');
        svg.appendChild(rect);
    });

    return svg;
}

function generateGradeGraph(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '300');

    const gradeCounts = data.reduce((acc, d) => {
        acc[d.grade] = (acc[d.grade] || 0) + 1;
        return acc;
    }, {});

    const barWidth = 40;
    const maxHeight = 200;

    const maxCount = Math.max(...Object.values(gradeCounts));
    const scale = maxHeight / maxCount;

    Object.entries(gradeCounts).forEach(([grade, count], i) => {
        const barHeight = count * scale;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', i * (barWidth + 10));
        rect.setAttribute('y', maxHeight - barHeight);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', 'green');
        svg.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', i * (barWidth + 10) + barWidth / 2);
        text.setAttribute('y', maxHeight - barHeight - 10);
        text.setAttribute('text-anchor', 'middle');
        text.textContent = grade;
        svg.appendChild(text);
    });

    return svg;
}

async function getUserId() {
    const query = userId;
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}/api/graphql-engine/v1/graphql`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("hasura-jwt")}`,
            },
            body: JSON.stringify({ query }),
        })
            .then((response) => {
                if (response.status !== 200) {
                    reject(`could not get user id: ${response.status} ${response.statusText}`);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (data.errors) {
                    reject(`could not get user id: ${data.errors[0].message}`);
                    return;
                }
                if (data.data.user.length === 0) {
                    reject(`user not found`);
                    return;
                }
                resolve(data.data.user[0].id);
            });
    });
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

document.addEventListener('DOMContentLoaded', fetchData(userDataQuery));
