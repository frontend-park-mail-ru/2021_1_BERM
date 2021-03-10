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
                    return {isOk: false}
                }

                console.log("_______", res);

            })
            .catch(res => {
                console.log(res);
            })
    },
};
