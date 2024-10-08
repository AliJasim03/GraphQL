import { getEventId, fetchData, fetchData_Event, fetchObjects } from './profile.js';


$(document).ready(async function () {

    await getEventId();
    google.charts.load('current', { 'packages': ['timeline', 'corechart'] });

    const user = await fetchData_Event(userDetailsQuery);
    displayUserData(user);

    const transactions = await fetchData_Event(userTransactionQuery);
    //sort teh top 10 transaction by amout
    transactions.transaction.sort((a, b) => b.amount - a.amount);
    transactions.transaction = transactions.transaction.slice(0, 10);
    await replaceObjectIdWithName(transactions.transaction);
    google.charts.setOnLoadCallback(() => displayUserXp(transactions.transaction));
    //displayUserXp(transactions.transaction);

    //display the user progress
    const progress = await fetchData(userProgressQuery);
    progress.progress.sort((a, b) => b.grade - a.grade);
    progress.progress = progress.progress.slice(0, 10);
    await replaceObjectIdWithName(progress.progress);
    google.charts.setOnLoadCallback(() => displayUserProgress(progress.progress));

    //display the user result
    const result = await fetchData(userResultQuery);
    //sort the top last project updatedAt
    result.result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    result.result = result.result.filter(obj => obj.grade === 1);
    result.result = result.result.slice(0, 10);
    await replaceObjectIdWithName(result.result);
    // google.charts.setOnLoadCallback(() => displayUserResult(result.result));

    //display the user aduitRatio
    const auditRatio = user.user[0];
    google.charts.setOnLoadCallback(() => displayUserRatio(auditRatio));

    //display the user skills
    const skills = await fetchData(userSkillsQuery);
    google.charts.setOnLoadCallback(() => displayUserSkills(skills.user[0]));
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
function displayUserResult(result) {
    // Map the last 10 updated projects data to Google Charts format
    const data = new google.visualization.DataTable();
    data.addColumn({ type: 'string', id: 'Project' });   // Project name
    data.addColumn({ type: 'string', id: 'Grade' });     // Grade as text
    data.addColumn({ type: 'date', id: 'Start Date' });  // Start Date (Created Date)
    data.addColumn({ type: 'date', id: 'End Date' });    // End Date (Updated Date)

    result.forEach(item => {
        const startDate = new Date(item.createdAt);
        const endDate = new Date(item.updatedAt);

        data.addRow([item.objectName, `Grade: ${item.grade}`, startDate, endDate]);
    });

    // Set chart options
    const options = {
        timeline: { showRowLabels: true, colorByRowLabel: true },
        title: 'Timeline of Last 10 Updated Projects',
        legend: { position: 'right' },
        chartArea: { width: '90%', height: '70%' },
    };

    // Initialize and render the timeline chart
    const chart = new google.visualization.Timeline(document.getElementById('gradeTimelineChart'));
    chart.draw(data, options);
}
function displayUserXp(transaction) {

    // Map the transaction data to Google Charts format
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Project');
    data.addColumn('number', 'Amount');
    transaction.forEach(item => {
        data.addRow([item.objectName, item.amount]);
    });

    // Set chart options
    const options = {
        title: 'Top 10 XP Projects',
        legend: { position: 'right' },
        colors: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(255, 129, 102)',
            'rgb(0, 128, 128)',
            'rgb(200, 124, 0)'
        ],
        pieSliceText: 'value', // Show values on each slice
        tooltip: { isHtml: true },
        chartArea: { left: 30, top: 30, width: '90%', height: '75%' }
    };

    // Initialize and render the pie chart
    const chart = new google.visualization.PieChart(document.getElementById('xpPieChart'));
    chart.draw(data, options);
}
function displayUserProgress(progress) {

    // Map the progress data to Google Charts format
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Project');  // Column for project names
    data.addColumn('number', 'Grade');    // Column for grades

    progress.forEach(entry => {
        data.addRow([entry.object.name, entry.grade]);
    });

    // Set chart options to customize labels and positioning
    const options = {
        title: 'Project Grades',
        legend: { position: 'none' },
        colors: ['#36A2EB'], // Use a custom color for the bars
        hAxis: {
            title: 'Projects',
            slantedText: false, // Keep text horizontal
            textStyle: {
                fontSize: 12, // Size of the labels under each column
                color: '#000'
            }
        },
        vAxis: {
            title: 'Grades',
            minValue: 0,
            maxValue: 3 // Set the y-axis range
        },
        chartArea: { left: 50, top: 50, width: '80%', height: '70%' }
    };

    // Initialize and render the column chart
    const chart = new google.visualization.ColumnChart(document.getElementById('progressBarChart'));
    chart.draw(data, options);
}



function displayUserSkills(skills) {
    // Transform and clean up skill types (capitalize and remove prefix)
    skills.transactions.forEach(item => {
        item.type = item.type.split('_')[1]; // Remove prefix (e.g., 'skill_')
        item.type = item.type.charAt(0).toUpperCase() + item.type.slice(1); // Capitalize first letter
    });

    // Map the skills data to Google Charts format
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Skill Type'); // Column for skill types
    data.addColumn('number', 'Amount');      // Column for skill levels

    skills.transactions.forEach(item => {
        data.addRow([item.type, item.amount]);
    });

    // Set chart options
    const options = {
        title: 'User Skills Distribution',
        legend: { position: 'right' },
        colors: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(255, 129, 102)',
            'rgb(0, 128, 128)',
            'rgb(200, 124, 0)'
        ],
        pieHole: 0.4, // Optional: Creates a donut-style chart for better visualization
        chartArea: { width: '70%', height: '70%' },
        pieSliceText: 'value', // Show values inside slices
        tooltip: { isHtml: true }
    };

    // Initialize and render the pie chart (donut style)
    const chart = new google.visualization.PieChart(document.getElementById('skillPolarChart'));
    chart.draw(data, options);
}

// Load the Google Charts library
google.charts.load('current', { 'packages': ['corechart', 'bar'] });

// Sample ratio data in bytes (replace with your actual data)
const auditRatio = {
    totalUp: 1318083,   // Aduits Done in bytes
    totalDown: 5242880  // Aduits Received in bytes
};

// Ensure Google Charts is loaded and draw the chart
google.charts.setOnLoadCallback(() => displayUserRatio(auditRatio));

function displayUserRatio(ratio) {
    // Convert bytes to megabytes
    const totalUpMB = (ratio.totalUp / (1024 * 1024)).toFixed(2);  // Convert Aduits Done to MB
    const totalDownMB = (ratio.totalDown / (1024 * 1024)).toFixed(2); // Convert Aduits Received to MB

    // Map the ratio data to Google Charts format
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Audit Type'); // Column for audit types
    data.addColumn('number', 'Count (MB)'); // Column for counts in MB

    // Add rows for each type of audit with converted MB values
    data.addRows([
        ['Aduits Done', parseFloat(totalUpMB)],
        ['Aduits Received', parseFloat(totalDownMB)]
    ]);

    // Set chart options
    const options = {
        title: 'Audit Ratio in Megabytes (MB)',
        legend: { position: 'none' },
        colors: ['#4BC0C0', '#FF6384'], // Custom colors for the bars
        chartArea: { width: '60%' },    // Adjust chart area to fit labels
        hAxis: {
            title: 'Count (MB)',
            minValue: 0,                 // Ensure x-axis starts at 0
        },
        vAxis: {
            title: 'Audit Type'
        },
        bars: 'horizontal',             // Display bars horizontally
        annotations: {
            alwaysOutside: true,
            textStyle: {
                fontSize: 12,
                color: '#000',
                auraColor: 'none'
            }
        }
    };

    // Initialize and render the horizontal bar chart
    const chart = new google.visualization.BarChart(document.getElementById('ratioBarChart'));
    chart.draw(data, options);
}


