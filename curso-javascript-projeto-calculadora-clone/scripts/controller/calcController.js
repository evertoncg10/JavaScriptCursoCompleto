class CalcController {

    constructor() {
        this._displayCalc = "0";
        this._currentDate;
        this.initialize();
    }

    initialize() {
        //o El é convenção, quer dizer que se refere ao elemento do HTML
        let displayCalcEl = document.querySelector('#display');
        let dateEl = document.querySelector('#data');
        let timeEl = document.querySelector('#hora');

        displayCalcEl.innerHTML = "4567";
        dateEl.innerHTML = "04/08/2019";
        timeEl.innerHTML = "21:03";
    }

    get displayCalc() {
        return this._displayCalc;
    }

    set displayCalc (displayCalc){
        this._displayCalc = displayCalc;
    }
    
    get currentDate() {
        return this._currentDate;
    }

    set currentDate (currentDate){
        this._currentDate = currentDate;
    }
}