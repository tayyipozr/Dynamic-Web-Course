

async function login() {
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("psw")[0].value;

    try {
        const response = await axios.post('http://localhost:3333/auth/signin', {
            email: email,
            password: password
        });

        localStorage.setItem("token", response.data['access_token']);
        window.location.replace("./index.html");
    } catch (error) {
        console.log(error);
    }

};