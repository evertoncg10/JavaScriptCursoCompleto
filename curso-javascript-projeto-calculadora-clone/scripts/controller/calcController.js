class CalcController {

    constructor() {
        this._locale = 'pt-BR';
        //o El é convenção, quer dizer que se refere ao elemento do HTML
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
    }

    initialize() {

        this.setDisplayDateTime();

        setInterval(()=> {
            this.setDisplayDateTime();
        }, 1000);
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    initButtonsEvents(){
        //o sinal de > significa trazer todos os g dentro do id
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
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