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
}

export default new Vacancy();
