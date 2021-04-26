const origin = 'http://localhost:8080';
// const origin = 'https://findfreelancer.ru:8080';

let token;

const defaultHeaders = {
    'Content-Type': 'application/json',
};

export const sendRequest = (
    method,
    url,
    body = undefined,
    headers = defaultHeaders,
) => {
    headers['X-Csrf-Token'] = token?`${token}`:'';

    return fetch(origin + url, {
        method: method,
        body: JSON.stringify(body),
        credentials: 'include',
        headers: headers,
    })
        .then((res) => {
            if (res.headers.has('x-csrf-token')) {
                token = res.headers.get('x-csrf-token');
            }

            // Обновление token при просрочке токена
            if (res.status === 403) {
                fetch(origin + '/profile/authorized', {
                    method: 'GET',
                    credentials: 'include',
                    headers: headers,
                })
                    .then((res) => {
                        debugger;
                        if (res.headers.has('x-csrf-token')) {
                            debugger;
                            token = res.headers.get('x-csrf-token');
                        }
                        headers['X-Csrf-Token'] = token?`${token}`:'';

                        return fetch(origin + url, {
                            method: method,
                            body: JSON.stringify(body),
                            credentials: 'include',
                            headers: headers,
                        });
                    });
            } else {
                return Promise.resolve(res);
            }
        });
};
