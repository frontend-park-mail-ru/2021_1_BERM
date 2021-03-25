const origin = 'http://localhost:8080';

const defaultHeaders = {
    'Content-Type': 'application/json',
}

export function sendRequest (
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
        .catch((res) => {
            console.log(`Упс, ошибочка. Код: ${res.status}`);
        })
}
