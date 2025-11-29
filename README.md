# Pocket

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Pocket** is a comprehensive collection of browser-based utility tools designed for developers and power users. It provides a clean, modern interface to perform common tasks like data formatting, conversion, and generation without sending any data to a server.

🚀 **Live Demo:** [https://bibeshpaudel.github.io/pocket-web/](https://bibeshpaudel.github.io/pocket-web/)

## ✨ Features

Pocket bundles over 20+ essential tools into a single, offline-capable application:

### 🛠️ Data & Formatting
- **JSON Formatter**: Minify, beautify, and validate JSON with syntax highlighting.
- **XML Formatter**: Format and validate XML data.
- **Markdown Preview**: Real-time Markdown editing and previewing.
- **Mermaid Editor**: Create diagrams using code with real-time preview.

### 🔐 Security & Cryptography
- **AES Encrypt/Decrypt**: Securely encrypt text using AES.
- **Hash Generator**: Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.
- **Password Generator**: Create strong, customizable passwords.
- **UUID Generator**: Generate version 4 UUIDs.

### 🔄 Converters
- **Base64**: Encode and decode Base64 strings.
- **URL Encoder**: Encode and decode URLs.
- **Unit Converter**: Convert length, weight, and temperature.
- **Timestamp Converter**: Convert between Unix timestamps and human-readable dates.
- **Timezone Converter**: Check time across different timezones.
- **Image Converter**: Convert images between PNG, JPG, and WEBP formats.

### 🎨 Images & Media
- **Image Compressor**: Compress images directly in the browser.
- **SVG Viewer**: View and edit SVG code with live preview.
- **QR Code Generator**: Generate QR codes for URLs and text.

### 📝 Text Tools
- **Case Converter**: Switch between camelCase, snake_case, kebab-case, etc.
- **Word Counter**: Count words, characters, and lines.
- **Regex Tester**: Test regular expressions against text.
- **Text Compare**: Diff two text blocks to find differences.
- **Lorem Ipsum**: Generate placeholder text.

### 🌐 Network
- **IP Lookup**: Get details about your IP address or lookup others.

## 🎨 Design System

Pocket features a custom-built design system inspired by **Shadcn UI**, utilizing:
- **Amber Theme**: A professional, warm color palette (`#f59e0b`).
- **Dark/Light Mode**: Fully supported system-aware theming.
- **Responsive Layout**: Works seamlessly on desktop and mobile.
- **Glassmorphism**: Modern UI elements with backdrop blurs.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, CSS Variables
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Utilities**: `crypto-js`, `browser-image-compression`, `react-syntax-highlighter`

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bibeshpaudel/pocket-web.git
   cd pocket-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173/pocket-web/`.

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `docs` directory (configured for GitHub Pages).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Bibesh Paudel](https://github.com/bibeshpaudel)
