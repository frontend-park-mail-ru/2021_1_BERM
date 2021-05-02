/** Класс для хранения откликов */
class Vacancy {
    /**
     * Конструктор
     */
    constructor() {
        this.currentVacancyId = -1;
        this.vacancysMap = new Map([]);
    }

    /**
     * Установка атрибутов пользователя
     *
     * @param {Object} attr - результат запроса
     */
    setAttributes(attr) {
        this.vacancysMap.set(Number(attr.id), attr);
        this.currentVacancyId = Number(attr.id);
    }

    /**
     * Устанавливаем вакансии
     *
     * @param {Object} data - массив вакансий
     */
    setVacancys(data) {
        data.forEach((res) => {
            this.setAttributes({
                id: res.id,
                avatar: res.img,
                login: res.login,
                name: res.vacancy_name,
                customerId: res.customer_id,
                category: res.category,
                definition: res.description,
                salary: res.salary,
                selectExecutor: res.executor_id?res.executor_id:null,
            });
        });
    }

    /**
     * Получаем информацию о вакансии
     *
     * @param {number} id - уникальный номер вакансии
     *
     * @return {Object} - информация о вакансии
     */
    getVacancyById(id) {
        return this.vacancysMap.get(id);
    }

    /**
     * Устанавливаем отклики
     *
     * @param {number} id - уникальный номер вакансии
     * @param {Response} res - все отклики
     */
    setResponses(id, res) {
        const responses = [];

        res.forEach((item) => {
            responses.push(this.pushResponse(id, item));
        });

        this.vacancysMap.get(id).responses = responses;
    }

    /**
     * Возвращаем структурированный отклик
     *
     * @param {number} id - уникальный номер вакансии
     * @param {Object} item - информация отклика
     *
     * @return {Object}
     */
    pushResponse(id, item) {
        return {
            id: item.id,
            creatorId: item.user_id,
            avatar: item.user_img,
            login: item.user_login,
            rate: item.rate,
            text: item.text,
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

    getSelectResponse(vacancy, id) {
        console.log(vacancy, id);
        if (!id || !vacancy) {
            return null;
        }

        let select = null;
        this.vacancysMap.get(vacancy).responses.forEach((item) => {
            if (item.creatorId === id) {
                select = item;
            }
        });
        console.log('SELECT ', select);
        return select;
    }
}

export default new Vacancy();
