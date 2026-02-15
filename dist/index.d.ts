declare class Landaxs {
    private _data;
    input: Record<string, any>;
    input_details: Array<Record<string, any>>;
    ref: Record<string, any>;
    method: Record<string, (...args: any[]) => any>;
    defineInput(data: Record<string, any>): this;
    setRef(data: Array<string>): this;
    triggerInput(name_input: string | Array<string>, callback: Function): this;
    methods(function_parameter: Record<string, (...args: any[]) => any>): this;
}
export default Landaxs;
