"use strict";
class Landaxs {
    constructor() {
        this.data_input = {};
        this.input_details = [];
        this.data_ref = {};
        this.method = {};
    }
    defineInput(data) {
        this.data_input = data;
        let input_details = [];
        for (let [key, value] of Object.entries(this.data_input)) {
            document.querySelectorAll(`[x_input='${key}']`).forEach((ctx) => {
                input_details.push({
                    name_input: key,
                    type_input: ctx.type,
                    type_variable: typeof this.data_input[key],
                });
                if (ctx.type === "radio") {
                    if (ctx.value === this.data_input[key]) {
                        ctx.checked = true;
                    }
                    ctx.addEventListener("change", (e) => {
                        let target = e.currentTarget;
                        this.data_input[key] = target.value;
                    });
                }
                else if (ctx.type === "checkbox") {
                    this.data_input[key].forEach((ctx2) => {
                        if (ctx.value === ctx2) {
                            ctx.checked = true;
                        }
                    });
                    ctx.addEventListener("input", (e) => {
                        let target = e.currentTarget;
                        if (target.checked) {
                            this.data_input[key].push(target.value);
                        }
                        else {
                            this.data_input[key] = this.data_input[key].filter((item) => {
                                return item !== target.value;
                            });
                        }
                    });
                }
                else {
                    ctx.value = this.data_input[key];
                    ctx.addEventListener("input", (e) => {
                        let target = e.currentTarget;
                        this.data_input[key] = target.value;
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
    setInput(name_input_string, value) {
        document.querySelectorAll(`[x_input='${name_input_string}']`).forEach(ctx => {
            ctx.value = value;
            this.data_input[name_input_string] = value;
        });
        return this;
    }
    triggerInput(name_input, callback) {
        if (typeof name_input === "string") {
            document.querySelectorAll(`[x_input='${name_input}']`).forEach(ctx => {
                ctx.addEventListener("input", (e) => {
                    callback(this.data_input);
                });
            });
        }
        else {
            name_input.forEach(ctx => {
                document.querySelectorAll(`[x_input='${ctx}']`).forEach(ctx => {
                    ctx.addEventListener("input", (e) => {
                        callback(this.data_input);
                    });
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
