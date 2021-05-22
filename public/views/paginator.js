// selecting required element
// const element = document.querySelector('.pagination ul');
// let totalPages = 20;
// const page = 1;
import orderTemplate from '@/components/pages/orders/orderInOrders.pug';

export class Paginator {
    constructor(data, count, itemsPerPage, contentSelect, options) {
        this.options = options;
        this.orders = data;
        this.count = count;
        this.itemPerPage = itemsPerPage;
        this.paginationPages = [];
        this.element = document.querySelector(contentSelect);

        this.countOfPages = Math.ceil(this.count / this.itemPerPage);
        console.log();

        this._setUp();


        this._prevPage = 0;

        // createPagination(page)
        // _paginationHandler(item);
    }

    _setUp() {
        this.element.addEventListener('click', (event) => {
            console.log(event.target);
            if (event.target.tagName !== 'UL') {
                let item = event.target;
                if (item.tagName !== 'LI') {
                    item = item.parentNode;
                    console.log(item.tagName);
                }
                this._paginationHandler(item);
            }
        });

        this._showContent(1);
    }

    createPagination(page) {
        const a = performance.now();
        let liTag = '';
        let liCurrent = '';
        let active;
        let beforePage = page - 2;
        let afterPage = page + 2;

        if (!this.notStart) {
            // this.paginationPages.forEach((item) => {
            //     item.removeEventListener();
            // })

        }
        this.notStart = true;
        if (beforePage < 0) {
            beforePage = 0;
        }

        console.log(page);

        if (page > 1) {
            // show the next button if the page value is greater than 1
            liCurrent =
                `<li data-type="prev" data-value="${page - 1}" class="btn prev">
                    <img src="Icons-Chevron%20Left.svg" alt=""></li>`;
            this.paginationPages.push(liCurrent);
            liTag += liCurrent;
        }

        if (page > 1) { // if page value is less than 2 then add 1 after the previous button
            liCurrent = `<li data-type="start" class="first numb"><img src="Component%203.svg" alt=""></li>`;
            this.paginationPages.push(liCurrent);
            liTag += liCurrent;
            // if(page > 3){ //if page value is greater than 3 then add this (...) after the first li or page
            //   liTag += `<li class="dots"><span>...</span></li>`;
            // }
        }

        // how many pages or li show before the current li
        // console.log(beforePage);
        if (page === this.countOfPages) {
            beforePage = beforePage - 2;
        } else if (page === this.countOfPages - 1) {
            beforePage = beforePage - 1;
        }

        if (beforePage < 0) {
            beforePage = 0;
        }
        // console.log(beforePage);
        // // how many pages or li show after the current li
        // console.log(afterPage);
        if (page === 1) {
            afterPage = afterPage + 2;
        } else if (page === 2) {
            afterPage = afterPage + 1;
        }
        // console.log(afterPage);

        for (let plength = beforePage; plength <= afterPage; plength++) {
            if (plength > this.countOfPages) { // if plength is greater than totalPage length then continue
                continue;
            }
            if (plength === 0) { // if plength is 0 than add +1 in plength value
                plength = plength + 1;
            }
            if (page === plength) { // if page is equal to plength than assign active string in the active variable
                active = 'active';
                // this._prevPage = page;
            } else { // else leave empty to the active variable
                active = '';
            }
            liCurrent = `<li data-value="${plength}" class="numb ${active}"><span>${plength}</span></li>`;
            this.paginationPages.push(liCurrent);
            liTag += liCurrent;
        }

        if (page < this.countOfPages) { // if page value is less than totalPage value by -1 then show the last li or page
            // if(page < totalPages - 2){ //if page value is less than totalPage value by -2 then add this (...) before the last li or page
            //   liTag += `<li class="dots"><span>...</span></li>`;
            // }
            liCurrent = `<li data-type="end" class="last numb" ><img src=require("@/static/img/card.svg").default alt=""></li>`;
            this.paginationPages.push(liCurrent);
            liTag += liCurrent;
        }

        if (page < this.countOfPages) { // show the next button if the page value is less than totalPage(20)
            liCurrent = `<li data-type="next" data-value="${page + 1}" class="btn next"><img src="rightArrow.svg" alt=""></li>`;
            this.paginationPages.push(liCurrent);
            liTag += liCurrent;
        }
        this.element.innerHTML = liTag; // add li tag inside ul tag
        // const wtf = element.querySelectorAll('li');
        // console.log(wtf)
        // element.innerHTML = liTag;

        // this.paginationPages[0].addEventListener('click', (item) => {
        //     console.log('fuxk');
        // })
        //
        // wtf.forEach((item) => {
        //     item.addEventListener('click', (event) => {
        //         this._paginationHandler(event.currentTarget);
        //     })
        // })
        // console.log(element);
        const b = performance.now();
        console.log(b - a);


        return liTag; // reurn the li tag
    }

    _paginationHandler(item) {
        // let currentItem = null;
        // console.log(item.tagName)
        //
        // if (item.tagName !== 'LI') {
        //     item = item.parentNode;
        //     console.log(item.tagName)
        // }
        const pageNumber = Number(item.getAttribute('data-value'));
        if (item.getAttribute('data-type') === 'prev') {
            // const pageNumber = Number(item.getAttribute('data-value'));
            this.createPagination(pageNumber);
            this._showContent(pageNumber);
            return;
        }

        if (item.getAttribute('data-type') === 'end') {
            console.log('start');
            this.createPagination(this.countOfPages);
            this._showContent(this.countOfPages);
            return;
        }

        if (item.getAttribute('data-type') === 'next') {
            // const pageNumber = Number(item.getAttribute('data-value'));
            this.createPagination(pageNumber);
            this._showContent(pageNumber);
            return;
        }

        if (item.getAttribute('data-type') === 'start') {
            this.createPagination(1);
            this._showContent(1);
            return;
        }

        this.createPagination(pageNumber);
        this._showContent(pageNumber);
    }

    _showContent(page) {
        const mainDiv = document.querySelector('.content');
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild);
        }
        console.log((page - 1) * this.itemPerPage);
        console.log((page) * this.itemPerPage);
        for (let i = ((page - 1) * this.itemPerPage); i < (page * this.itemPerPage); i++) {
            const content = document.createElement('div');
            console.log(this.orders[i]);
            content.innerHTML = orderTemplate({
                order: this.orders[i],
                isI: this.options.isI,
                isMyOrders: this.options.isMyOrders,
                isArchive: this.options.isArchive,
                isExecutor: this.options.isExecutor,
            });
            mainDiv.appendChild(content);
        }
    }
}

// calling function with passing parameters and adding inside element which is ul tag
// element.innerHTML = createPagination(totalPages, page);

// const pag = new Paginator(users, 13, 3);
// pag.createPagination(page);


