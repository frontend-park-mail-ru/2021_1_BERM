import eventBus from "../eventBus";

const origin = 'http://localhost:8080';

const defaultHeaders = {
    'Content-Type': 'application/json',
}

function sendRequest (
    method,
    url,
    body = undefined,
    headers = defaultHeaders
){
    return fetch(origin + url, {
        method: method,
        body: JSON.stringify(body),
        credentials: 'include',
        headers: headers,
    })
}

export default {
    login(data) {
        sendRequest('POST', '/login', JSON.parse(JSON.stringify(data)))
            .then((res) => {
                eventBus.emit('login', res);
            })
    }
}