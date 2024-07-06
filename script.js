document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const credentials = btoa(`${username}:${password}`);

    try {
        const response = await fetch('https://((DOMAIN))/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('jwt', data.jwt);

        window.location.href = 'profile.html';
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});

async function fetchUserData() {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://((DOMAIN))/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                {
                  user {
                    id
                    login
                  }
                  transaction {
                    id
                    type
                    amount
                    userId
                    createdAt
                  }
                  progress {
                    id
                    grade
                    createdAt
                  }
                }`
            })
        });

        const result = await response.json();
        displayUserData(result.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
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

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('jwt');
    window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', fetchUserData);


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