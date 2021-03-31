const origin = 'http://localhost:8080';

const defaultHeaders = {
    'Content-Type': 'application/json',
}

export default {
     sendRequest(method,
                 url,
                 body = undefined,
                 headers = defaultHeaders
     ) {
         return fetch(origin + url, {
            method: method,
            body: JSON.stringify(body),
            credentials: 'include',
            headers: headers,
        })
            .then( res => {
                if (res.ok) {
                    return res.json();
                }

                if (res.status === 401) {
                    return Promise.resolve({isOk: false})
                }

                if (res.status === 400) {
                    return Promise.resolve({isOk: false})
                }

                if (res.status === 409) {
                    return Promise.resolve({isOk: false})
                }
            })
            .catch(res => {
                console.log(res);
            })
    },
};
