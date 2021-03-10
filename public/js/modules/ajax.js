export default {
    async sendRequest(method, url, body = null) {
        return await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            // mode: 'no-cors'
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

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
            .catch(() => {
                console.log('Не удалось подключиться к серверу');
            })
    }
}