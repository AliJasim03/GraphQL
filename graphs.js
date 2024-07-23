import { getUser, fetchData, fetchObjects } from './profile.js';

document.addEventListener('DOMContentLoaded', async () => {

    const user = await fetchData(userDetailsQuery);
    displayUserData(user);

    const transactions = await fetchData(userTransactionQuery);
    //sort teh top 10 transaction by amout
    transactions.transaction.sort((a, b) => b.amount - a.amount);
    transactions.transaction = transactions.transaction.slice(0, 10);
    await replaceObjectIdWithName(transactions.transaction);
    displayUserXp(transactions.transaction);

    //display the user progress
    const progress = await fetchData(userProgressQuery);
    progress.progress.sort((a, b) => b.grade - a.grade);
    progress.progress = progress.progress.slice(0, 10);
    await replaceObjectIdWithName(progress.progress);
    displayUserProgress(progress.progress);

    //display the user result
    // const result = await fetchData(userResultQuery);
    //sort the top last project updatedAt
    // result.result = result.result.slice(0, 10);
    // await replaceObjectIdWithName(result.result);
    // displayUserResult(result.result);

    //display the user aduitRatio
    const aduitRatio = user.user[0];
    displayUserRatio(aduitRatio);

    //display the user skills
    const skills = await fetchData(userSkillsQuery);
    displayUserSkills(skills.user[0]);
});



function displayUserData(data) {
    const userInfoDiv = document.getElementById('user-info');
    const user = data;
    userInfoDiv.innerHTML = `
        <p>ID: ${user.user[0].id}</p>
        <p>Login: ${user.user[0].login}</p>
        <p>Level: ${user.event_user[0].level}</p>
    `;
}

async function replaceObjectIdWithName(data) {
    const objectIds = data.map(obj => obj.objectId);
    const objectsResponse = await fetchObjects(objectIds);

    const objectArr = objectsResponse.object;

    data.forEach(obj => {
        const object = objectArr.find(o => o.id === obj.objectId);
        obj.objectName = object.name;
        //add object type and attras to the objectArray
        obj.objectType = object.type;
        obj.objectAttrs = object.attrs;
    });
}

function displayUserXp(transaction) {
    const ctx = document.getElementById('xpPieChart').getContext('2d');

    const data = {
        datasets: [{
            label: 'Top 10 XP Projects',
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 129, 102)',
                'rgb(0, 128, 128)',
                'rgb(200, 124, 0)',
            ]
        }]
    };
    data.labels = transaction.map(item => item.objectName);
    data.datasets[0].data = transaction.map(item => item.amount);
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw;
                            return label;
                        }
                    }
                }
            }
        }
    };
    const xpPolarChart = new Chart(ctx, config);
}

function displayUserProgress(progress) {
    const ctx = document.getElementById('progressBarChart').getContext('2d');


    const labels = progress.map(entry => entry.object.name);
    const data = progress.map(entry => entry.grade);

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Project Grades',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
}

function displayUserSkills(skills) {
    const skillsDiv = document.getElementById('skillPolarChart').getContext('2d');
    const data = {
        datasets: [{
            label: 'User Skills',
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 129, 102)',
                'rgb(0, 128, 128)',
                'rgb(200, 124, 0)',
            ]
        }]
    };
    console.log(skills);
    //change the labels
    skills.transactions.forEach(item => {
        item.type = item.type.split('_')[1];
        //capitalize the first letter
        item.type = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    });

    data.labels = skills.transactions.map(item => item.type);
    data.datasets[0].data = skills.transactions.map(item => item.amount);
    const config = {
        type: 'polarArea',
        data: data,
        options: {
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    };
    const skillPolarChart = new Chart(skillsDiv, config);

}

function displayUserRatio(ratio) {

    var ctxBar = document.getElementById('ratioBarChart').getContext('2d');
    var barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Aduits Done', 'Aduits Received'],
            datasets: [{
                label: 'Counts',
                data: [ratio.totalUp, ratio.totalDown],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // This makes the bar chart horizontal
            scales: {
                x: {
                    beginAtZero: true
                }
            },

        }
    });
}




