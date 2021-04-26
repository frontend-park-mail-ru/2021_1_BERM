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
            date: this.getDate(item.time),
        };
    }
}

export default new Vacancy();
