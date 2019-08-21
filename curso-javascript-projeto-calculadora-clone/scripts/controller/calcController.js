class CalcController {

    constructor() {
        this._locale = 'pt-BR';
        //o El é convenção, quer dizer que se refere ao elemento do HTML
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._operation = [];
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    initButtonsEvents() {
        //o sinal de > significa trazer todos os g dentro do id
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                console.log("igual");
                break;

            case 'ponto':
                this.addOperation('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll() {
        this._operation = [];
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);

            } else if (isNaN(value)) {

                console.log("Outra coisa", value);

            } else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                this.setLastNumberToDisplay();

            }
        }

    }

    setLastNumberToDisplay() {
        let lastNumber;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i];
                break;
            }
        }

        if (!lastNumber) {
            lastNumber = 0;
        }

        this.displayCalc = lastNumber;
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    isOperator(value) {
        return ['+', '-', '*', '%', '/',].indexOf(value) > -1;
    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
            console.log(this._operation);
        }
    }

    calc() {
        let last = '';
        if(this._operation.length > 3){
            last = this._operation.pop();
        }

        let result = eval(this._operation.join(""));

        if (last == '%') {

            result /= 100;
            this._operation = [result];

        } else {

            this._operation = [result];

            if(last) {
                this._operation.push(last);
            }
        }

        this.setLastNumberToDisplay();
    }

    setError() {
        this.displayCalc = "Error..."
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(displayTime) {
        this._timeEl.innerHTML = displayTime;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(displayDate) {
        this._dateEl.innerHTML = displayDate;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(displayCalc) {
        this._displayCalcEl.innerHTML = displayCalc;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(currentDate) {
        dateEl.innerHTML = currentDate;
    }

}