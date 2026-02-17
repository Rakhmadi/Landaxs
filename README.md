Landaxs is library for dynamically managing input forms, supporting two-way binding and event handling with clean syntax.

<img src="logo.png" width="200" />
## ✨ Features
- Two-way data binding
- Event handling
- TypeScript support
- Lightweight & dependency-free

CDN

```html
<script src="https://cdn.jsdelivr.net/npm/landaxs@1.0.1/dist/index.min.js"></script>
```

### Define input name
define the input tag input name into the input property

>example
```html
<!-- in html -->
<input type="text" x_input="username">
<input type="email" x_input="email">

<input type="radio" x_input="gender" value="male"/>
<input type="radio" x_input="gender" value="female"/>

<input type="checkbox" x_input="role" value="admin">
<input type="checkbox" x_input="role" value="sales">
<input type="checkbox" x_input="role" value="employee">


<!-- in js -->
<script>
// to define input name
    let form_login = new Landaxs()
    .defineInput({
        username : "",
        email: "",
        gender : "male",
        role : []
    })
// to access input
	form_login.input.username
	form_login.input.email
	form_login.input.gender
	form_login.input.role
</script>
```

### Triggering Input
to trigger input from html
**Parameters:**

- `name_input` - Nama input (string) atau array nama input
- `callback` - Function yang dijalankan saat input berubah (menerima `data_input` sebagai parameter)

>example
```html
<script>
//to define input name 
    let form_login = new Landaxs()
    .defineInput({
        username : "",
        email: "",
    }).triggerInput("username",(data)=>{
	    console.log(data)
    })

// for single trigger input 
	.triggerInput("username",(data)=>{
		    console.log(data) // print input property
	})
// for mutiple trigger input
	.triggerInput(["username","email"],(data)=>{
		    console.log(data) //print input property
	})
</script>
```

### Reference DOM elements

>this is the same as document.getElementById("id_")

>example
```html
<!-- in html -->
<div x_ref="msg"></div>
<script>
// to define input name 
    let form_login = new Landaxs()
    .defineInput({
        username : "",
        email: "",
    }).triggerInput("username",(data)=>{
	    console.log(data)
    }).setRef(["msg"])
    
// for single ref 
    .setRef("msg")
// for mutiple ref
    .setRef(["msg","msg2"])
    
// to access ref
	form_login.ref.msg.textContent = "hello world"
</script>
```
### Method
register a method to the methods property
> 
```html
<!-- in html -->
<button type="button" onclick="form_login.method.my_method">Save</button>

<script>
//to define input name 
    let form_login = new Landaxs()
    
    .defineInput({
        username : "",
        email: "",
    })
    
    .triggerInput("username",(data)=>{
	    console.log(data)
    })
    
    .setRef(["msg"])
    
    .methods({
	    my_method(){
		    form_login.ref.msg.textContent = "hello world"
	    },
	    my_method2(){
			form_login.ref.msg.textContent = "hello 22"
	    }
    })
    
    // access method 
    form_input.method.my_methods()
    
    //format object method
    
    .method({
	    method_name : function(){
			// code
	    }
    })
    
    .method({
	    method_name : ()=>{
			// code
	    }
    })
    
	.method({
	    method_name(){
			// code
	    }
    })
    
</script>
```
### properties and methods of the Landaxs class
### 📦 Properties (Internal State)

| Property        | Type                                   | Function                                            |
| --------------- | -------------------------------------- | --------------------------------------------------- |
| `_data`         | `Record<string, any>`                  | Stores the main internal reactive state             |
| `input`         | `Record<string, any>`                  | Proxy wrapper of `_data` to intercept value changes |
| `input_details` | `Array<Record<string, any>>`           | Stores metadata of all registered inputs            |
| `ref`           | `Record<string, any>`                  | Stores DOM references based on `x_ref` attribute    |
| method          | Record<string, (...args:any[]) => any> | Stores externally registered functions              |
|                 |                                        |                                                     |
### ⚙ Methods

| Method         | Parameters                       | Function                                                     |
| -------------- | -------------------------------- | ------------------------------------------------------------ |
| `defineInput`  | `data: Record<string, any>`      | Initializes data binding between state and DOM via `x_input` |
| `setRef`       | `string \| string[]`             | Registers DOM references using `x_ref`                       |
| `triggerInput` | `string \| string[]`, `callback` | Executes callback when input value changes                   |
| methods        | Record<string, Function>         | Registers external custom methods into the instance          |
>example use 
```html
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/landaxs@1.0.1/dist/index.min.js"></script>
<style>
    .form-control {
        display: flex;
        flex-direction: column;
        width: min-content;
    }
</style>
</head>
<body>
<div x_ref="msg"></div>
<form>
<div class="form-control">
    <label>Username</label>
    <input x_ref="input_username" type="text" x_input="username">
</div>
<div class="form-control">
    <label>Email</label>
    <input type="email" x_input="email">
</div>
<div>
    <label>Gender</label>
    <label>
        <input type="radio" x_input="gender" value="male"/>
        Male
    </label>
    <label>
        <input type="radio" x_input="gender" value="female"/>
        Female
    </label>
</div>
<div>
  <label>Role</label>
  <label>
    <input type="checkbox" x_input="role" value="admin">
    Admin
  </label>
  <label>
    <input type="checkbox" x_input="role" value="sales">
    Sales
  </label>
  <label>
    <input type="checkbox" x_input="role" value="employee">
    Employee
  </label>
</div>
<button type="button" onclick="form_login.method.send(this)">Save</button>
<button type="button" onclick="form_login.method.clear()">clear</button>
</form>
<div x_ref="data"></div>
<div x_ref="send_msg"></div>
<script>

    let form_login = new Landaxs()
    .defineInput({
        username : "",
        email: "",
        gender : "male",
        role : ""
    })
    
    .triggerInput(["username","email","gender","role"],(data)=>{
        form_login.ref.data.textContent = JSON.stringify(data)
        form_login.method.validate()
    })

    .setRef(["data","msg","send_msg","input_username"])

    .methods({
    
        send : (e)=>{
            if(form_login.method.validate()){
                form_login.ref.send_msg.innerHTML = `<h4>Result</h4> ${JSON.stringify(form_login.input)}`
                form_login.method.clear()
            }
        },
        
        validate : ()=>{
            if(form_login.input.username.length < 4){
                form_login.ref.msg.textContent = "Length Username Must > 3"
                form_login.ref.msg.style.color = "red"
            }else if(!form_login.input.email.includes("@")){
                form_login.ref.msg.textContent = "Input Must an Email"
                form_login.ref.msg.style.color = "red"
            }else{
                form_login.ref.msg.textContent = "nice"
                form_login.ref.msg.style.color = "green"
                return true
            }
        },

        clear : ()=>{
            form_login.input.username = ""
            form_login.input.email = ""
            form_login.input.gender = ""
            form_login.input.role = []
            form_login.ref.input_username.focus()
        }

    })

    form_login.ref.data.textContent = JSON.stringify(form_login.input)

  

</script>
</body>
</html>
```
---
### 💡 Tips & Tricks
#### Tip 1: Two-Way Binding

```typescript
// Update data → DOM automatically updates
form.input.nama = "Baru"
// Update DOM (user types) → data automatically updates
// <input x_input="nama" /> ← When the user changes a value, form.input.nama updates.
```
#### Tip 2: Akses Raw Data

```typescript
// Via Proxy (two-way)
console.log(form.input)
// Via Private Data
console.log(form._data)
```
#### Tip 3: Get Form Metadata

```typescript

form.input_details

// Output:
// [
//   { name_input: "nama", type_input: "text", type_variable: "string" },
//   { name_input: "email", type_input: "email", type_variable: "string" },
//   { name_input: "gender", type_input: "radio", type_variable: "string" },
//   { name_input: "hobi", type_input: "checkbox", type_variable: "object" }
// ]

```
#### Tip 4: Convert Checkbox Array to String

```typescript

form.methods({
    getHobiString: () => {
        return form.input.hobi.join(", ")
        // "membaca, gaming, olahraga"
    }
})

```
#### Tip 5: Method Chaining

```typescript

form
    .defineInput({/* ... */})
    .setRef([/* ... */])
    .triggerInput([/* ... */], (data) => {/* ... */})
    .methods({/* ... */})
	// Can chain multiple methods!
```


---
### 🚀 Browser Support

✅ Chrome 60+  
✅ Firefox 55+  
✅ Safari 11+  
✅ Edge 79+  

---