document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    const App = {
        queue: [],
        settings: {
            maxQueueItems: 37,
            minValueLength: 1,
            maxValueLength: 32,
            storageItemName: "queue",
            buttonEnter: 13,
        },
    };

    App.controls = {
        dashboard: document.getElementById("dashboard"),
        form:      document.querySelector("form"),
        input:     document.querySelector("form input[name='value']"),
        add:       document.querySelector("form button[name='add']"),
        remove:    document.querySelector("form button[name='remove']"),
        debounce:  undefined,
    };



    App.render = function() {
        let queueItem, queueItemNum, queueItemValue, queueItemDate;
        this.controls.dashboard.innerHTML = "";

        for ( let i = this.queue.length - 1; i >= 0; i-- ) {
            console.log(i, this.queue[i]);
            queueItem = document.createElement("div");

            queueItemNum = document.createElement("p");
            queueItemNum.innerHTML = "# " + (i + 1);
            queueItem.append(queueItemNum);

            queueItemValue = document.createElement("p");
            queueItemValue.innerHTML = this.queue[i].value;
            queueItem.append(queueItemValue);

            queueItemDate = document.createElement("p");
            queueItemDate.innerHTML = this.queue[i].date;
            queueItem.append(queueItemDate);

            this.controls.dashboard.append(queueItem);
        }
    };



    App.init = function() {
        if ( localStorage.getItem(this.settings.storageItemName )) {
            try {
                this.queue = JSON.parse(localStorage.getItem(this.settings.storageItemName));
            } catch(e) {
                localStorage.clear();
                this.error("Fucking script kids go home, vodka tut net.");
            }
        }

        if ( this.queue.length > 0 ) {
            this.controls.remove.disabled = false;
        }

        this.render();
        console.log(this.queue);
    };



    App.save = function() {
        localStorage.setItem(this.settings.storageItemName, JSON.stringify(this.queue));
        this.render();
    };



    App.error = msg => {
        window.alert(msg);
    };



    App.checkInputValue = str => {
        return new RegExp("^.{" + App.settings.minValueLength + "," + App.settings.maxValueLength + "}$").test(str);
    };



    App.add = function(str) {
        let current_date = new Date().toString().split(" ");
        current_date.length = 5;

        this.queue.push({
            value: str,
            date: current_date.join(" "),
        });

        if ( this.queue.length > 0 ) {
            this.controls.remove.disabled = false;
        }

        this.save();
    };



    App.remove = function() {
        this.queue.shift();
        this.save();
    };



    App.init();
    App.controls.input.select();



    App.controls.form.addEventListener("submit", event => {
        event.preventDefault();
    }, false);



    App.controls.input.addEventListener("input", event => {
        if ( !App.checkInputValue(App.controls.input.value.trim()) ) {
            App.controls.add.disabled = true;
        } else {
            App.controls.add.disabled = false;
        }
    }, false);



    App.controls.input.addEventListener("keypress", event => {
        console.log(event.charCode);
        if ( event.charCode === App.settings.buttonEnter ) {
            App.controls.add.dispatchEvent(new Event("click", { bubbles: true, cancelable: true }));
        }
    }, false);



    App.controls.add.addEventListener("click", event => {
        event.preventDefault();

        // Because we can enable this button from developer console :)
        if ( !App.checkInputValue(App.controls.input.value.trim()) ) {
            App.controls.add.disabled = true;
            App.error("Hacker go home, vodka tut net.");
            return;
        }

        if ( App.queue.length >= App.settings.maxQueueItems ) {
            App.controls.add.disabled = true;
            App.error("Error: Maximum Queue Items reached. Please remove some items.");
            return;
        }

        App.add(App.controls.input.value.trim());
        App.controls.input.value = "";
        App.controls.input.select();
        App.controls.add.disabled = true;
        console.log(App.queue);
    }, false);



    App.controls.remove.addEventListener("click", event => {
        event.preventDefault();

        // Because we can enable this button from developer console :)
        if ( App.queue.length === 0 ) {
            App.controls.remove.disabled = true;
            App.error("Hacker go home, vodka tut net.");
            return;
        }

        App.remove();

        if ( App.controls.input.value.trim().length > 0 ) {
            App.controls.add.disabled = false;
        }

        if ( App.queue.length === 0 ) {
            App.controls.remove.disabled = true;
        }

        console.log(App.queue);
    }, false);

}, false);
