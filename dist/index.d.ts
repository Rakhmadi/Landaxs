declare class Landaxs {
    private _data;
    input: Record<string, any>;
    input_details: Array<Record<string, any>>;
    ref: Record<string, any>;
    method: Record<string, (...args: any[]) => any>;
    defineInput(data: Record<string, any>): this;
    setRef(data: string | Array<string>): this;
    triggerInput(name_input: string | Array<string>, callback: Function): this;
    setStyle(name_reference: string, style: Record<string, any>): void;
    methods(function_parameter: Record<string, (...args: any[]) => any>): this;
}
