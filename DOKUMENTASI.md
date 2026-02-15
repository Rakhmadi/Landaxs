# 📋 Dokumentasi Landaxs - Form Management Library

## 🎯 Ringkasan
Landaxs adalah library TypeScript untuk mengelola input form secara dinamis dengan two-way data binding, event handling otomatis, dan method chaining.

---

## 📦 Instalasi & Setup

```typescript
import Landaxs from './index.ts'

const form = new Landaxs()
```

---

## 🔧 Properties (Properti)

| Property | Tipe | Deskripsi |
|----------|------|-----------|
| `_data` | `Record<string, any>` | **Private** - Menyimpan nilai data form |
| `input` | `Record<string,any>` | Proxy object untuk akses data dengan two-way binding |
| `input_details` | `Array<Record<string, any>>` | Metadata setiap input (nama, tipe, tipe variable) |
| `data_ref` | `Record<string,any>` | Reference DOM elements untuk akses langsung |
| `method` | `Record<string, Function>` | Custom methods yang didefinisikan user |

---

## 📝 Methods (Metode)

### 1️⃣ `defineInput(data: Record<string,any>): this`

**Fungsi:** Mendefinisikan dan menginisialisasi form input dengan automatic event binding.

**Parameter:**
- `data` - Object dengan key = nama input, value = nilai default

**Tipe Input yang Didukung:**
- `text`, `email`, `password`, `number` → Diupdate otomatis
- `radio` → Satu nilai terpilih
- `checkbox` → Array nilai (multi-select)
- `file` → FileList

**HTML Requirement:**
```html
<!-- Text Input -->
<input type="text" x_input="username" />

<!-- Radio Button Group -->
<label>
    <input type="radio" x_input="gender" value="male" /> Laki-laki
</label>
<label>
    <input type="radio" x_input="gender" value="female" /> Perempuan
</label>

<!-- Checkbox Group -->
<label>
    <input type="checkbox" x_input="hobi" value="membaca" /> Membaca
</label>
<label>
    <input type="checkbox" x_input="hobi" value="gaming" /> Gaming
</label>

<!-- File Input -->
<input type="file" x_input="foto" />
```

**Contoh Penggunaan:**
```typescript
form.defineInput({
    username: "john_doe",
    gender: "male",
    hobi: ["membaca"],
    foto: null
})
```

**Penjelasan Kode:**
```typescript
// Proxy mengupdate DOM saat data berubah
this.input = new Proxy(this._data, {
    set: (target, key, value) => {
        target[key] = value
        // Update semua input dengan x_input=key
        document.querySelectorAll(`[x_input='${key}']`).forEach(ctx => {
            ctx.value = value
        })
        return true
    }
})

// Loop setiap input dan tambahkan event listener
for (let [key, value] of Object.entries(this._data)) {
    document.querySelectorAll(`[x_input='${key}']`).forEach((ctx) => {
        // Jika radio button → set name attribute & add change listener
        // Jika checkbox → initialize checked state & add input listener
        // Jika file → add change listener
        // Else → add input listener untuk text/email/etc
    })
}
```

**Return:** `this` (untuk method chaining)

---

### 2️⃣ `setRef(data: Array<string>): this`

**Fungsi:** Menyimpan reference ke DOM elements untuk akses mudah.

**Parameter:**
- `data` - Array string berisi nama reference

**HTML Requirement:**
```html
<button x_ref="submitBtn">Submit</button>
<div x_ref="errorMsg" style="color: red;"></div>
<div x_ref="successMsg" style="color: green;"></div>
```

**Contoh Penggunaan:**
```typescript
form.setRef(["submitBtn", "errorMsg", "successMsg"])

// Akses:
form.data_ref.submitBtn.addEventListener("click", () => {})
form.data_ref.errorMsg.textContent = "Error!"
```

**Kode Internal:**
```typescript
data.forEach(ctx => {
    // Cari elemen pertama dengan x_ref=ctx
    this.data_ref[ctx] = document.querySelectorAll(`[x_ref='${ctx}']`)[0]
})
```

**Return:** `this`

---

### 3️⃣ `triggerInput(name_input: string | Array<string>, callback: Function): this`

**Fungsi:** Mendengarkan perubahan input dan jalankan callback function.

**Parameter:**
- `name_input` - String (1 input) atau Array (multiple inputs)
- `callback` - Function(data) - dipanggil saat input berubah

**Contoh Penggunaan:**
```typescript
// Single input
form.triggerInput("username", (data) => {
    console.log("Username:", data.username)
})

// Multiple inputs
form.triggerInput(["username", "email"], (data) => {
    console.log("Form data:", data)
})
```

**Kode Internal:**
```typescript
if (typeof name_input === "string") {
    // Single input
    document.querySelectorAll(`[x_input='${name_input}']`).forEach(ctx => {
        ctx.addEventListener("input", (e) => {
            callback(this._data) // Pass seluruh data object
        })
    })
} else {
    // Multiple inputs
    name_input.forEach(inputName => {
        document.querySelectorAll(`[x_input='${inputName}']`).forEach(ctx => {
            ctx.addEventListener("input", (e) => {
                callback(this._data)
            })
        })
    })
}
```

**Return:** `this`

---

### 4️⃣ `methods(function_parameter: Record<string, Function>): this`

**Fungsi:** Mendefinisikan custom methods yang dapat diakses via `method` property.

**Parameter:**
- `function_parameter` - Object berisi custom methods

**Contoh Penggunaan:**
```typescript
form.methods({
    validate: () => {
        const { username, email } = form._data
        return username.length > 3 && email.includes("@")
    },
    
    submit: () => {
        if (form.method.validate()) {
            console.log("Submit:", form._data)
            return true
        }
        return false
    },
    
    reset: () => {
        form._data = {
            username: "",
            email: "",
            gender: "male"
        }
    }
})

// Panggil method:
form.method.validate()  // true/false
form.method.submit()    // submit logic
form.method.reset()     // reset form
```

**Return:** `this`

---

## 💻 Contoh Lengkap

### HTML Template
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .error { color: red; font-weight: bold; }
        .success { color: green; font-weight: bold; }
    </style>
</head>
<body>

<form id="myForm">
    <input type="text" x_input="username" placeholder="Username (min 3 char)">
    <input type="email" x_input="email" placeholder="Email">
    
    <fieldset>
        <legend>Role:</legend>
        <label>
            <input type="radio" x_input="role" value="admin"> Admin
        </label>
        <label>
            <input type="radio" x_input="role" value="user"> User
        </label>
    </fieldset>
    
    <fieldset>
        <legend>Permissions:</legend>
        <label>
            <input type="checkbox" x_input="permissions" value="read"> Read
        </label>
        <label>
            <input type="checkbox" x_input="permissions" value="write"> Write
        </label>
        <label>
            <input type="checkbox" x_input="permissions" value="delete"> Delete
        </label>
    </fieldset>
    
    <button type="button" x_ref="submitBtn">Submit</button>
    <button type="button" x_ref="resetBtn">Reset</button>
</form>

<div x_ref="message"></div>

<script src="index.ts"></script>
<script>
    const form = new Landaxs()

    form
        .defineInput({
            username: "",
            email: "",
            role: "user",
            permissions: []
        })
        .setRef(["submitBtn", "resetBtn", "message"])
        .triggerInput(["username", "email"], (data) => {
            console.log("Form berubah:", data)
        })
        .methods({
            validate: () => {
                const { username, email } = form._data
                
                if (username.length < 3) {
                    form.data_ref.message.textContent = "❌ Username minimal 3 karakter"
                    form.data_ref.message.className = "error"
                    return false
                }
                
                if (!email.includes("@")) {
                    form.data_ref.message.textContent = "❌ Email tidak valid"
                    form.data_ref.message.className = "error"
                    return false
                }
                
                return true
            },
            
            submit: () => {
                if (form.method.validate()) {
                    form.data_ref.message.textContent = "✅ Form berhasil disubmit!"
                    form.data_ref.message.className = "success"
                    console.log("Data:", form._data)
                }
            },
            
            reset: () => {
                form.defineInput({
                    username: "",
                    email: "",
                    role: "user",
                    permissions: []
                })
                form.data_ref.message.textContent = ""
            }
        })

    // Event listeners
    form.data_ref.submitBtn.addEventListener("click", () => {
        form.method.submit()
    })

    form.data_ref.resetBtn.addEventListener("click", () => {
        form.method.reset()
    })
</script>

</body>
</html>
```

---

## ⚠️ Penting!

| Aturan | Penjelasan |
|--------|-----------|
| **Atribut `x_input`** | Harus unik dan match dengan key di `defineInput()` |
| **Checkbox values** | HARUS berupa array di `defineInput()` |
| **Radio buttons** | Otomatis diberi `name` attribute |
| **Method chaining** | Semua method return `this` untuk chaining |
| **Event binding** | Otomatis di `defineInput()`, tidak perlu manual |
| **Proxy usage** | Mengupdate `input` property update DOM langsung |

---

## 🎁 Bonus Tips

```typescript
// Akses raw data
console.log(form._data)

// Akses data via Proxy
form.input.username = "new_value"  // Auto update DOM!

// Check input details
console.log(form.input_details)
// Output: [
//   { name_input: "username", type_input: "text", type_variable: "string" },
//   { name_input: "role", type_input: "radio", type_variable: "string" }
// ]

// Combine methods
form
    .defineInput({ /* ... */ })
    .setRef([ /* ... */ ])
    .triggerInput([ /* ... */ ], (data) => { /* ... */ })
    .methods({ /* ... */ })
```

---

## 🚀 Browser Support
✅ Chrome 60+  
✅ Firefox 55+  
✅ Safari 11+  
✅ Edge 79+  

---

**Version:** 1.0.0  
**Last Updated:** February 15, 2026