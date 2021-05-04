const origin = '/api';
// const origin = 'http://localhost:8080';
// const origin = 'https://findfreelancer.ru:8080';

let token;

const defaultHeaders = {
    'Content-Type': 'application/json',
};

export const sendRequest = async (
    method,
    url,
    body = undefined,
    headers = defaultHeaders,
) => {
    headers['X-Csrf-Token'] = token?`${token}`:'';

    let response = null;

    await fetch(origin + url, {
        method: method,
        body: JSON.stringify(body),
        credentials: 'include',
        headers: headers,
    })
        .then(async (res) => {
            if (res.headers.has('x-csrf-token')) {
                token = res.headers.get('x-csrf-token');
            }

            // Обновление token при просрочке токена
            if (res.status === 403) {
                await fetch(origin + '/profile/authorized', {
                    method: 'GET',
                    credentials: 'include',
                    headers: headers,
                })
                    .then(async (res) => {
                        if (res.headers.has('x-csrf-token')) {
                            token = res.headers.get('x-csrf-token');
                        }
                        headers['X-Csrf-Token'] = token?`${token}`:'';

                        response = await fetch(origin + url, {
                            method: method,
                            body: JSON.stringify(body),
                            credentials: 'include',
                            headers: headers,
                        });
                    });
            } else {
                response = Promise.resolve(res);
            }
        });

    if (response) {
        return response;
    }
};
