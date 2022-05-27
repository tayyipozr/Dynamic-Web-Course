

async function register() {
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("psw")[0].value;
    const firstName = document.getElementsByName("firstName")[0].value;
    const lastName = document.getElementsByName("lastName")[0].value;
    try {
        const response = await axios.post('http://localhost:3333/auth/signup', {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "type": "user"
        });
        window.location.replace("./login.html");
    } catch (error) {
        console.log(error);
    }

    console.log(email);
    console.log(password);
    console.log(firstName);
    console.log(lastName);
};