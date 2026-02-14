declare class Landaxs {
    data_input: Record<string, any>;
    input_details: Array<Record<string, any>>;
    data_ref: Record<string, any>;
    method: Record<string, (...args: any[]) => any>;
    defineInput(data: Record<string, any>): this;
    setRef(data: Array<string>): this;
    setInput(name_input_string: string, value: any): this;
    triggerInput(name_input: string | Array<string>, callback: Function): this;
    methods(function_parameter: Record<string, (...args: any[]) => any>): this;
}
