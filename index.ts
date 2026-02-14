class Landaxs {
    
    public data_input:Record<string,any> = {}
    public input_details:Array<Record<string, any>> = []
    public data_ref:Record<string,any> = {}
    public method:Record<string, (...args: any[]) => any> = {}
    
    defineInput(data:Record<string,any>):this{
        this.data_input = data
        let input_details: Array<Record<string, any>> = []

        for(let [key,value] of Object.entries(this.data_input)){

            document.querySelectorAll<HTMLInputElement>(`[x_input='${key}']`).forEach((ctx)=>{

            input_details.push({
                name_input : key,
                type_input : ctx.type,
                type_variable : typeof this.data_input[key],
            })

            if (ctx.type === "radio") {
                if(ctx.value === this.data_input[key]){
                    ctx.checked = true
                }
                ctx.addEventListener("change",(e)=>{
                    let target = e.currentTarget as HTMLInputElement
                    this.data_input[key] = target.value
                })

            }else if(ctx.type === "checkbox"){
                this.data_input[key].forEach((ctx2: string)=>{
                    if(ctx.value === ctx2){
                        ctx.checked = true
                    }
                })

                ctx.addEventListener("input",(e)=>{
                    
                    let target = e.currentTarget as HTMLInputElement
                    
                    if(target.checked){
                        this.data_input[key].push(target.value)    
                    }else{
                        this.data_input[key] = this.data_input[key].filter((item:any)=>{
                            return item !== target.value
                        })
                    }
                })

            }else{
                ctx.value = this.data_input[key]
                ctx.addEventListener("input",(e)=>{
                    let target = e.currentTarget as HTMLInputElement
                    this.data_input[key] = target.value
                })
            }
        })
    } 
    
    function removeDuplicateByKey(arr:Array<Record<string, any>>, key:string) {
        return [...new Map(arr.map(item => [item[key], item])).values()];
    }

    this.input_details = removeDuplicateByKey(input_details,"name_input")
    return this

    }

    setRef(data:Array<string>):this{
        data.forEach(ctx=>{
            this.data_ref[ctx] = document.querySelectorAll(`[x_ref='${ctx}']`)[0]
        })
        return this
    }

    setInput(name_input_string:string,value:any):this{
        document.querySelectorAll<HTMLInputElement>(`[x_input='${name_input_string}']`).forEach(ctx=>{
            ctx.value = value
            this.data_input[name_input_string] = value
        })

        return this
    }

    triggerInput(name_input:string | Array<string>,callback:Function):this{
        if(typeof name_input === "string"){
            document.querySelectorAll(`[x_input='${name_input}']`).forEach(ctx=>{
                ctx.addEventListener("input",(e)=>{
                    callback(this.data_input);
                })
            })
        }else{
            name_input.forEach(ctx=>{
                document.querySelectorAll(`[x_input='${ctx}']`).forEach(ctx=>{
                    ctx.addEventListener("input",(e)=>{
                        callback(this.data_input);
                    })
                })
            })
        }

        return this        
    }

    
    methods(function_parameter:Record<string, (...args: any[]) => any>):this{
        this.method = function_parameter
        return this
    }
}

