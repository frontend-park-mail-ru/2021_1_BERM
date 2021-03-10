export default {
    sendRequest(method, url, body = undefined) {
        return fetch(url, {
            method: method,
            body: JSON.stringify(body),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                console.log(res.status);

                for (let val of res.headers.values()) {
                    console.log(val)
                }

                return res.json()
                    .then(err => {
                        const error = new Error('Что-то пошло не так :(');
                        error.data = err;
                        throw error;
                    })
            })
            .catch(res => {
                console.log(res.status);
                console.log('Не удалось подключиться к серверу');
            })
    },
};
