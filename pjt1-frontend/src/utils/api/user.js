import api from "./index"

async function loginAPI(inputId, inputPw) {
    return await api.post("/api/v1/auth/login", {
        id: inputId,
        password: inputPw,
    })
    .then(res => res.data)
    .catch(err => err.response.data);
}

async function registAPI(id,name,password,email,phone) {
    return await api.post("/api/v1/users", {
        id: id,
        name: name,
        password: password,
        email: email,
        phone: phone
    })
    .then(res => res.data)
    .catch(err => err.response.data);
}

async function idCheckAPI(id) {
    return await api.get("/api/v1/users/idcheck/"+id)
    .then(res => res.data)
    .catch(err => err.response.data)
}


export { loginAPI, registAPI, idCheckAPI }
