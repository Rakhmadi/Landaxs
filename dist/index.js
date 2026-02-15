class Landaxs {
    constructor() {
        this._data = {};
        this.input = {};
        this.input_details = [];
        this.ref = {};
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
                if (ctx instanceof HTMLInputElement) {
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
                        ctx.setAttribute("name", `${key}[]`);
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
                        ctx.setAttribute("name", key);
                        ctx.addEventListener("change", (e) => {
                            let target = e.target;
                            this._data[key] = target.files;
                        });
                    }
                    else {
                        ctx.setAttribute("name", key);
                        ctx.value = this._data[key];
                        ctx.addEventListener("input", (e) => {
                            let target = e.currentTarget;
                            this._data[key] = target.value;
                        });
                    }
                }
                else if (ctx instanceof HTMLSelectElement && ctx.hasAttribute("multiple")) {
                    ctx.setAttribute("name", key);
                    input_details.push({
                        name_input: key,
                        type_input: "select",
                        type_variable: typeof this._data[key],
                    });
                    let cx = [];
                    this._data[key].forEach((ctx2) => {
                        for (let i = 0; i < ctx.options.length; i++) {
                            if (ctx.options[i].value === ctx2) {
                                ctx.options[i].selected = true;
                                cx.push(ctx2);
                            }
                        }
                    });
                    ctx.addEventListener("input", (e) => {
                        this._data[key] = [];
                        const target = e.currentTarget;
                        for (let i = 0; i < target.length; i++) {
                            if (target.options[i].selected === true) {
                                this._data[key].push(target.options[i].value);
                            }
                        }
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
            this.ref[ctx] = document.querySelectorAll(`[x_ref='${ctx}']`)[0];
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