# Landaxs - Form Input Management Library

Landaxs adalah library TypeScript untuk mengelola input form dengan mudah dan dinamis. Library ini memungkinkan binding data two-way, validasi, dan event handling dengan syntax yang clean.

## Installation

```typescript
import Landaxs from './index.ts'
```

## Fitur Utama

- ✅ Two-way data binding
- ✅ Support radio, checkbox, dan text input
- ✅ Event listener management
- ✅ Reference element management
- ✅ Method chaining (fluent API)

## API Reference

### Constructor

```typescript
const form = new Landaxs()
```

### Properties

| Property | Type | Deskripsi |
|----------|------|-----------|
| `data_input` | `Record<string,any>` | Menyimpan nilai input form |
| `input_details` | `Array<Record<string, any>>` | Detail metadata setiap input |
| `data_ref` | `Record<string,any>` | Reference ke elemen DOM |
| `method` | `Record<string, Function>` | Custom methods |

### Methods

#### `defineInput(data: Record<string,any>): this`

Mendefinisikan dan menginisialisasi input form dengan automatic event binding.

**Parameters:**
- `data` - Object berisi data input dengan key sebagai nama input

**Supported Input Types:**
- `text` - Text input
- `email` - Email input  
- `radio` - Radio button group
- `checkbox` - Checkbox group (value harus array)

**HTML Example:**
```html
<input type="text" x_input="username" />
<input type="email" x_input="email" />

<label>
    <input type="radio" x_input="gender" value="male" /> Male
</label>
<label>
    <input type="radio" x_input="gender" value="female" /> Female
</label>

<label>
    <input type="checkbox" x_input="hobi" value="membaca" /> Membaca
</label>
<label>
    <input type="checkbox" x_input="hobi" value="gaming" /> Gaming
</label>
```

**Usage:**
```typescript
const form = new Landaxs()
form.defineInput({
    username: "john",
    email: "john@example.com",
    gender: "male",
    hobi: ["membaca", "gaming"]
})
```

---

#### `setRef(data: Array<string>): this`

Menetapkan reference ke elemen DOM untuk diakses nanti melalui `data_ref`.

**Parameters:**
- `data` - Array nama reference (sesuai atribut `x_ref`)

**HTML Example:**
```html
<div x_ref="errorMsg" style="color: red;"></div>
<button x_ref="submitBtn">Submit</button>
<div x_ref="successMsg" style="color: green;"></div>
```

**Usage:**
```typescript
form.setRef(["errorMsg", "submitBtn", "successMsg"])

// Access DOM elements
form.data_ref.submitBtn.addEventListener("click", () => { /* ... */ })
form.data_ref.errorMsg.textContent = "Error message"
```

---

#### `setInput(name_input_string: string, value: any): this`

Mengubah nilai input dan update `data_input` secara otomatis.

**Parameters:**
- `name_input_string` - Nama input (sesuai atribut `x_input`)
- `value` - Nilai baru

**Usage:**
```typescript
form.setInput("username", "jane_doe")
form.setInput("gender", "female")
form.setInput("hobi", ["gaming", "musik"])
```

---

#### `triggerInput(name_input: string | Array<string>, callback: Function): this`

Mendengarkan perubahan input dan menjalankan callback function.

**Parameters:**
- `name_input` - Nama input (string) atau array nama input
- `callback` - Function yang dijalankan saat input berubah (menerima `data_input` sebagai parameter)

**Usage:**
```typescript
// Single input
form.triggerInput("username", (data) => {
    console.log("Username berubah:", data.username)
})

// Multiple inputs
form.triggerInput(["username", "email"], (data) => {
    console.log("Form data updated:", data)
})
```

---

#### `methods(function_parameter: Record<string, Function>): this`

Menetapkan custom methods yang dapat diakses via `method` property.

**Parameters:**
- `function_parameter` - Object berisi custom methods

**Usage:**
```typescript
form.methods({
    validate: () => {
        const { username, email } = form.data_input
        return username.length > 0 && email.includes("@")
    },
    submit: () => {
        if (form.method.validate()) {
            console.log("Submitting:", form.data_input)
        }
    },
    reset: () => {
        form.setInput("username", "")
        form.setInput("email", "")
        form.setInput("gender", "male")
        form.setInput("hobi", [])
    }
})

// Call methods
form.method.validate()
form.method.submit()
form.method.reset()
```

---

## Complete Example

```typescript
// HTML
/*
<form>
    <input type="text" x_input="username" placeholder="Username" />
    <input type="email" x_input="email" placeholder="Email" />
    
    <fieldset>
        <legend>Role</legend>
        <label>
            <input type="radio" x_input="role" value="admin" /> Admin
        </label>
        <label>
            <input type="radio" x_input="role" value="user" /> User
        </label>
    </fieldset>
    
    <fieldset>
        <legend>Permissions</legend>
        <label>
            <input type="checkbox" x_input="permissions" value="read" /> Read
        </label>
        <label>
            <input type="checkbox" x_input="permissions" value="write" /> Write
        </label>
        <label>
            <input type="checkbox" x_input="permissions" value="delete" /> Delete
        </label>
    </fieldset>
    
    <button type="button" x_ref="submitBtn">Submit</button>
</form>

<div x_ref="message"></div>
*/

// TypeScript
import Landaxs from './index.ts'

const form = new Landaxs()

form
    .defineInput({
        username: "",
        email: "",
        role: "user",
        permissions: []
    })
    .setRef(["submitBtn", "message"])
    .triggerInput(["username", "email"], (data) => {
        console.log("Form updated:", data)
    })
    .methods({
        validate: () => {
            const { username, email } = form.data_input
            if (username.length === 0) {
                form.data_ref.message.textContent = "Username wajib diisi"
                return false
            }
            if (!email.includes("@")) {
                form.data_ref.message.textContent = "Email tidak valid"
                return false
            }
            return true
        },
        submit: () => {
            if (form.method.validate()) {
                console.log("Valid form:", form.data_input)
                form.data_ref.message.textContent = "Form berhasil disubmit!"
                form.data_ref.message.style.color = "green"
            }
        },
        reset: () => {
            form.setInput("username", "")
            form.setInput("email", "")
            form.setInput("role", "user")
            form.setInput("permissions", [])
            form.data_ref.message.textContent = ""
        }
    })

form.data_ref.submitBtn.addEventListener("click", () => {
    form.method.submit()
})
```

## Catatan Penting

- Gunakan atribut `x_input` untuk menghubungkan input dengan data
- Untuk checkbox, `data_input` value **harus berupa array**
- Gunakan `x_ref` untuk mengakses elemen DOM
- **Method chaining** didukung untuk semua method (return `this`)
- Event listener ditambahkan otomatis saat `defineInput()` dipanggil
- Hindari duplikat `x_input` atau `x_ref` di HTML

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

MIT