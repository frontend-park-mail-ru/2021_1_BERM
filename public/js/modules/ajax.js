export default {
     sendRequest(method, url, body = undefined) {
         console.log(5)
         return fetch(url, {
            method: method,
            body: JSON.stringify(body),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then( res => {
                console.log(6)
                if (res.ok) {
                    console.log(7)
                    return res.json();
                }

                if (res.status === 409) {
                    return {isOk: false}
                }

                console.log("_______", res);

            })
            .catch(res => {
                console.log(res);
            })
    },
};
