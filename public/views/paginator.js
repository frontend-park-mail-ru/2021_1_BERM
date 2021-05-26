import eventBus from '@/modules/eventBus.js';
import orderTemplate from '@/components/pages/orders/orderInOrders.pug';
import arrowRight3 from '@/static/img/3-rightArrow.svg';
import arrowLeft from '@/static/img/leftArrow.svg';
import arrowLeft3 from '@/static/img/3-leftArrow.svg';
import {QueryParser} from '@/views/viewUtils/queryParser';
import {
    GO_TO_ORDER,
    SEND_DATE_PAGINATE_TO_SERVER,
} from '@/modules/constants/actions';


export class Paginator {
    constructor(itemsPerPage, countObjInMemory) {
        this.countObjInMemory = 5;
        this.options = null;
        this.orders = null;
        this.count = 8;
        this.itemPerPage = itemsPerPage;
        this.paginationPages = [];
        this.element = null;
        this.countOfPages = 0;
        this.begin = 0;
        this.end = 0;
        this.parser = new QueryParser();

        // this._setUp();


        this._prevPage = 0;
        this.currentPage = 0;

        // createPagination(page)
        // _paginationHandler(item);
    }

    setItems(data, options, count) {
        this.orders = data;
        this.count = count;
        this.options = options;
    }

    setUp(contentSelect) {
        this.element = document.querySelector(contentSelect);
        console.log(this.element);
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
        this.begin = 1;
        this.end = this.countObjInMemory;
        this.countOfPages = Math.ceil(this.count / this.itemPerPage);
        this.showContent(1);
    }

    createPagination(page) {
        const a = performance.now();
        let liTag = '';
        let liCurrent = '';
        let active;
        let beforePage = page - 2;
        let afterPage = page + 2;
        let prevActive = 'disactivePrev';
        let nextActive = 'disactiveNext';

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
            prevActive = 'activePrev';
        }

        // if page value is less than 2 then add 1 after the previous button
        liCurrent = `<li data-type="start" class="first-numb ${prevActive}"><img src=${arrowLeft3} alt=""></li>`;
        this.paginationPages.push(liCurrent);
        liTag += liCurrent;
        // if(page > 3){ //if page value is greater than 3 then add this (...) after the first li or page
        //   liTag += `<li class="dots"><span>...</span></li>`;
        // }

        // if (page > 1) {
        // show the next button if the page value is greater than 1
        liCurrent =
            `<li data-type="prev" data-value="${page - 1}" class="btn-prev ${prevActive}">
                   <img src=${arrowLeft} alt=""></li>`;
        this.paginationPages.push(liCurrent);
        liTag += liCurrent;
        // }

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
            liCurrent = `<li data-value="${plength}" class="numb ${active}"><div class="numbSpan">${plength}</div></li>`;
            this.paginationPages.push(liCurrent);
            liTag += liCurrent;
        }

        if (page < this.countOfPages) {
            nextActive = 'activeNext';
        }


         // show the next button if the page value is less than totalPage(20)
        liCurrent = `<li data-type="next" data-value="${page + 1}" class="btn-next ${nextActive}"><img class="right" src=${arrowLeft} alt=""></li>`;
        this.paginationPages.push(liCurrent);
        liTag += liCurrent;

        // if page value is less than totalPage value by -1 then show the last li or page
        // if(page < totalPages - 2){ //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        //   liTag += `<li class="dots"><span>...</span></li>`;
        // }
        liCurrent = `<li data-type="end" class="last-numb ${nextActive}" ><img src=${arrowRight3} alt=""></li>`;
        this.paginationPages.push(liCurrent);
        liTag += liCurrent;

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
            this.currentPage = pageNumber;
            this.createPagination(pageNumber);
            this.showContent(pageNumber);
            return;
        }

        if (item.getAttribute('data-type') === 'end') {
            console.log('start');
            this.currentPage = this.countOfPages;
            this.createPagination(this.countOfPages);
            this.showContent(this.countOfPages);
            return;
        }

        if (item.getAttribute('data-type') === 'next') {
            // const pageNumber = Number(item.getAttribute('data-value'));
            this.currentPage = pageNumber;
            this.createPagination(pageNumber);
            this.showContent(pageNumber);
            return;
        }

        if (item.getAttribute('data-type') === 'start') {
            this.currentPage = 1;
            this.createPagination(1);
            this.showContent(1);
            return;
        }

        this.currentPage = pageNumber;
        this.createPagination(pageNumber);
        this.showContent(pageNumber);
    }

    showContent(page) {
        console.log('COUNT: ',page * this.itemPerPage);
        debugger;
        if (page * this.itemPerPage < this.begin ||
        page * this.itemPerPage > this.end) {
            this.begin = page * this.itemPerPage;
            this.end = page * this.itemPerPage + this.countObjInMemory;
            const data = {
                limit: this.end - this.begin + 1,
                offset: this.begin,
            };
            const queryString = this.parser.parseDataToQuery(data);
            eventBus.emit(SEND_DATE_PAGINATE_TO_SERVER, queryString);
            return;
        }
        const mainDiv = document.querySelector('.orders__items');
        while (mainDiv.firstChild) {
            // if (mainDiv.tagName === 'search') {
            //     break;
            // }
            mainDiv.removeChild(mainDiv.firstChild);
        }
        console.log((page - 1) * this.itemPerPage);
        console.log((page) * this.itemPerPage);
        for (let i = ((page - 1) * this.itemPerPage); i < (page * this.itemPerPage); i++) {
            const content = document.createElement('div');
            // content.style.width = '100%';
            content.classList.add('orders__order');
            // this.orders[i].budget += '₽';
            console.log(this.orders[i]);
            console.log(this.orders[i].budget);
            content.innerHTML = orderTemplate({
                order: this.orders[i],
                isI: this.options.isI,
                isMyOrders: this.options.isMyOrders,
                isArchive: this.options.isArchive,
                isExecutor: this.options.isExecutor,
            });
            mainDiv.appendChild(content);
        }
        debugger;
        const allRef = document.querySelectorAll('.orders__order_link');
        allRef.forEach((ref) => {
            ref.addEventListener('click', (e) => {
                e.preventDefault();
                eventBus.emit(GO_TO_ORDER, ref.getAttribute('name'));
            });
        });

        const allTit = document.querySelectorAll('.orders__order_title');
        allTit.forEach((tit) => {
            tit.addEventListener('click', () => {
                eventBus.emit(GO_TO_ORDER, tit.getAttribute('name'));
            });
        });
    }
}

// calling function with passing parameters and adding inside element which is ul tag
// element.innerHTML = createPagination(totalPages, page);

// const pag = new Paginator(users, 13, 3);
// pag.createPagination(page);


