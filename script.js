const baseUrl = "https://learn.reboot01.com";

function checkToken() {
    debugger
    const jwt = localStorage.getItem('hasura-jwt');
    if (jwt) {
        window.location.href = 'profile.html';
    }
}

//check the token when the page is loaded
checkToken();

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    try {
        await login(username, password);
    } catch (error) {
        console.error(error);
        alert(error);
    }

});


async function login(username, password) {
    const base64Data = btoa(`${username}:${password}`);
    fetch(`${baseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64Data}`
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response.text();
            } else {
                return response.json().then(error => {
                    $('#error').text(error.error || `could not login: ${response.status} ${response.statusText}`);
                    $('#error').show();
                    $('#error').fadeOut(5000);
                    $('#error').removeClass('d-none');
                    throw new Error(error.error || `could not login: ${response.status} ${response.statusText}`);
                });
            }
        })
        .then(jwt => {
            debugger;
            if (!jwt || jwt.trim() === '') {
                throw new Error(`invalid jwt received: ${jwt}`);
            }
            localStorage.setItem('hasura-jwt', jwt.replaceAll('"', ''));
            window.location.href = 'profile.html';
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

function logout() {
    localStorage.removeItem('hasura-jwt');
    window.location.href = '/graphql/index.html';
}

