class DateHandler {
    constructor() {
        this.actions = {
            WRITING: true,
            DELETING: false
        };
        this.dotes = {
            day: 2,
            mouth: 5
        }
        this.lengths = [0];
    }

    createDate() {
        let regex = /[-;":'a-zA-Zа-яА-Я]/;
        let action = this.actions.WRITING;
        const date = document.getElementById('date');
        date.addEventListener('input', (e) => {
            date.value = date.value.replace(regex, '');
            action = this.lengthHandler(e)
            this.inputHandler(e, action);
        })
    }

    inputHandler(e, action) {
        if (e.target.value.length === this.dotes.day && action === true
        || e.target.value.length === this.dotes.mouth && action === true) {
            e.target.value += '.'
        }
        console.log(e.target.value.length, " ", action)
        if (e.target.value.length === this.dotes.day && action === false) {
            e.target.value = e.target.value.slice(0, 1);
        }

        if (e.target.value.length === this.dotes.mouth && action === false) {
            e.target.value = e.target.value.slice(0, 4);
        }
        this.lengthHandler(e);
    }

    lengthHandler(e) {
        if (this.lengths.length < 2) {
            this.lengths.push(e.target.value.length);
        } else {
            this.lengths[0] = this.lengths[1];
            this.lengths[1] = e.target.value.length;
        }

        if (this.lengths[0] >= this.lengths[1]) {
            return this.actions.DELETING;
        } else {
            return this.actions.WRITING;
        }
    }

}



// eslint-disable-next-line no-undef

let abr = new DateHandler();
abr.createDate()