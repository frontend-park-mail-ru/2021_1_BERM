export default {
    sendRequest(method, url, body = null) {
        return fetch(url, {
            method: method,
            body: JSON.stringify(body),
            credentials: 'include'
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                return res.json()
                    .then(err => {
                        const error = new Error('Что-то пошло не так :(');
                        error.data = err;
                        throw error;
                    })
            })
    }
}