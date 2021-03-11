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
            .then( res => {
                if (res.ok) {
                    return res.json();
                }

                if (res.status === 401) {
                    console.log(res.error);
                    return Promise.resolve({isOk: false})
                }

                if (res.status === 400) {
                    console.log(res.error);
                    return Promise.resolve({isOk: false})
                }

                if (res.status === 409) {
                    console.log(res.error())
                    return Promise.resolve({isOk: false})
                }

                console.log("_______", res, res.json());

            })
            .catch(res => {
                console.log(res);
            })
    },
};
