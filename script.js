const baseUrl = "https://learn.reboot01.com";

function checkToken() {
    const jwt = localStorage.getItem('hasura-jwt');
    if (jwt) {
        window.location.href = 'profile.html';
    }
}

//check the token when the page is loaded
checkToken();

$('#login-form').submit(async function (event) {
    debugger;
    event.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();


    $('#login-btn').prop('disabled', true);

    setTimeout(() => {
        $('#login-btn').prop('disabled', false);
    });

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
            if (!jwt || jwt.trim() === '') {
                throw new Error(`invalid jwt received: ${jwt}`);
            }
            localStorage.setItem('hasura-jwt', jwt.replaceAll('"', ''));
            window.location.href = 'profile.html';
        });

}

function logout() {
    localStorage.removeItem('hasura-jwt');
    window.location.href = '/graphql/index.html';
}

