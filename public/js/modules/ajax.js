export default {
     sendRequest(method, url, body = undefined, headers = {
         'Content-Type': 'application/json',
     }) {
         return fetch(url, {
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

                console.log("_______", res, res.json().then(res=>console.log(res)));

            })
            .catch(res => {
                console.log(res);
            })
    },
};
