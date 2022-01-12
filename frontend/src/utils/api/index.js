import axios from "axios";

const url = axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
    }
});

export default url;
