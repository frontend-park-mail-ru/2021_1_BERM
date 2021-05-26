export class QueryParser {
    parseDataToQuery(data) {
        let res = '?';
        Object.entries(data).forEach(([key, value]) => {
            if (value.toString().length !== 0) {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        res = res.concat(`${key}=${item.toString()
                            .split(' ')
                            .join('+')}`, `&`);
                    });
                } else {
                    res = res.concat(`${key}=${value.toString()
                        .split(' ')
                        .join('+')}`, `&`);
                }
            }
        });
        return res.slice(0, res.length - 1);
    }
}
