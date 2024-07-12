import { getUser, fetchData } from './profile.js';

document.addEventListener('DOMContentLoaded', async () => {
    // const user = await getUser();
    // displayUserData(user);

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
function displayUserData(data) {
    const userInfoDiv = document.getElementById('user-info');
    const user = data;
    userInfoDiv.innerHTML = `
        <p>ID: ${user.id}</p>
        <p>Login: ${user.login}</p>
    `;
    displayGraphs();
}

async function displayGraphs() {
    const data = await fetchData(userTransactionQuery);
    const graphsDiv = document.getElementById('graphs');
    const xpData = data.transaction.filter(tx => tx.type === 'xp');
    const xpGraph = generateXpGraph(xpData);
    graphsDiv.appendChild(xpGraph);

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
