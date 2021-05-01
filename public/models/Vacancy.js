class Vacancy {
    constructor() {
        this.currentVacancyId = -1;
        this.vacancysMap = new Map([]);
    }

    setAttributes(attr) {
        this.vacancysMap.set(Number(attr.id), attr);
        this.currentVacancyId = Number(attr.id);
    }

    setVacancys(data) {
        data.forEach((res) => {
            this.setAttributes({
                id: res.id,
                avatar: res.img, // этого нет
                login: res.login, // этого нет
                name: res.vacancy_name,
                customerId: res.customer_id, // этого нет
                category: res.category,
                definition: res.description,
                salary: res.salary,
            });
        });
    }

    getVacancyById(id) {
        return this.vacancysMap.get(id);
    }

    setResponses(id, res) {
        const responses = [];

        res.forEach((item) => {
            responses.push(this.pushResponse(id, item));
        });

        this.vacancysMap.get(id).responses = responses;
    }

    pushResponse(id, item) {
        return {
            id: item.id,
            creatorId: item.user_id,
            avatar: item.user_img,
            login: item.user_login,
            rate: item.rate,
            text: item.text,
            // date: this.getDate(item.time),
        };
    }

    push(id, item) {
        this.vacancysMap.get(id).responses.push(this.pushResponse(id, item));
    }

    findRate(id, creatorId) {
        let rate = 0;
        this.vacancysMap.get(id).responses.forEach((item) => {
            if (item.creatorId === creatorId) {
                rate = item.rate;
            }
        });
        return rate;
    }

    findTextRate(id, creatorId) {
        let text = '';
        this.vacancysMap.get(id).responses.forEach((item) => {
            if (item.creatorId === creatorId) {
                text = item.text;
            }
        });
        return text;
    }

    deleteResponse(id, creatorId) {
        let pos;
        this.vacancysMap.get(id).responses.forEach((item, index) => {
            if (item.creatorId === creatorId) {
                pos = index;
            }
        });

        this.vacancysMap.get(id).responses.splice(pos, 1);
    }
}

export default new Vacancy();
