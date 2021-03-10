export default {
    async sendRequest(method, url, body = undefined) {
        return await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async res => {
                if (res.ok) {
                    return await res.json();
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
