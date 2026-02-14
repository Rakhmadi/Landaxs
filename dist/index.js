"use strict";
class Landaxs {
    constructor() {
        this._data = {};
        this.input = {};
        this.input_details = [];
        this.data_ref = {};
        this.method = {};
    }
    defineInput(data) {
        this._data = data;
        this.input = new Proxy(this._data, {
            set: (target, key, value) => {
                target[key] = value;
                document.querySelectorAll(`[x_input='${key}']`).forEach(ctx => {
                    ctx.value = value;
                    this._data[key] = value;
                });
                return true;
            }
        });
        let input_details = [];
        for (let [key, value] of Object.entries(this._data)) {
            document.querySelectorAll(`[x_input='${key}']`).forEach((ctx) => {
                input_details.push({
                    name_input: key,
                    type_input: ctx.type,
                    type_variable: typeof this._data[key],
                });
                if (ctx.type === "radio") {
                    ctx.setAttribute("name", key);
                    if (ctx.value === this._data[key]) {
                        ctx.checked = true;
                    }
                    ctx.addEventListener("change", (e) => {
                        let target = e.currentTarget;
                        this._data[key] = target.value;
                    });
                }
                else if (ctx.type === "checkbox") {
                    this._data[key].forEach((ctx2) => {
                        if (ctx.value === ctx2) {
                            ctx.checked = true;
                        }
                    });
                    ctx.addEventListener("input", (e) => {
                        let target = e.currentTarget;
                        if (target.checked) {
                            this._data[key].push(target.value);
                        }
                        else {
                            this._data[key] = this._data[key].filter((item) => {
                                return item !== target.value;
                            });
                        }
                    });
                }
                else if (ctx.type === "file") {
                    ctx.addEventListener("change", (e) => {
                        let target = e.target;
                        this._data[key] = target.files;
                    });
                }
                else {
                    ctx.value = this._data[key];
                    ctx.addEventListener("input", (e) => {
                        let target = e.currentTarget;
                        this._data[key] = target.value;
                    });
                }
            });
        }
        function removeDuplicateByKey(arr, key) {
            return [...new Map(arr.map(item => [item[key], item])).values()];
        }
        this.input_details = removeDuplicateByKey(input_details, "name_input");
        return this;
    }
    setRef(data) {
        data.forEach(ctx => {
            this.data_ref[ctx] = document.querySelectorAll(`[x_ref='${ctx}']`)[0];
        });
        return this;
    }
    triggerInput(name_input, callback) {
        if (typeof name_input === "string") {
            document.querySelectorAll(`[x_input='${name_input}']`).forEach(ctx => {
                if (ctx.type === "file") {
                    ctx.addEventListener("change", (e) => {
                        callback(this._data);
                    });
                }
                else {
                    ctx.addEventListener("input", (e) => {
                        callback(this._data);
                    });
                }
            });
        }
        else {
            name_input.forEach(ctx => {
                document.querySelectorAll(`[x_input='${ctx}']`).forEach(ctx => {
                    if (ctx.type === "file") {
                        ctx.addEventListener("change", (e) => {
                            callback(this._data);
                        });
                    }
                    else {
                        ctx.addEventListener("input", (e) => {
                            callback(this._data);
                        });
                    }
                });
            });
        }
        return this;
    }
    methods(function_parameter) {
        this.method = function_parameter;
        return this;
    }
}
