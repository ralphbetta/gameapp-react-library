# Sixchat React Library
Sixchat is a powerful React component designed to embed a real-time chat interface into your web applications. Whether you're building customer support systems or live chat features, Sixchat provides an out-of-the-box solution.

## 🚀 Features
 - Real-time Messaging: Powered by WebSocket for instant communication.
- Customizable Interface: Easily adjust the title, caption, and overall styling.
- Keyboard Shortcuts: Supports sending messages with the "Enter" key.
- Device ID Management: Automatically assigns and stores unique device IDs.
- Timestamps: Displays human-readable timestamps like "2 minutes ago."
## 📦 Installation
Install the component using npm or yarn:

```
npm install sixchat
```
or

```
yarn add sixchat
```
## 🛠️ Usage
Here's how to integrate the Sixchat component into your React application:

```javascript
import React from 'react';
import { Sixchat } from 'sixchat';

function App() {
  return (
    <div>
      <h1>Welcome to Sixchat</h1>
      <Sixchat 
        uid="12345" 
        title="Customer Support" 
        caption="How can we help you today?" 
      />
    </div>
  );
}

export default App;

```
## 🎨 Props
The Sixchat component accepts the following props:

| Prop        | Type           | Default  | Description  |
| ------------- |:-------------:| -----:|  -----:|
| uid     | string | 7 | Unique identifier for the user. |
| title     | string | SixChat | Unique identifier for the user. |
| caption     | string | Customer Support | Displayed under the title |
| apikey     | string | ***** | Your API key for authentication |
| secret     | string | ***** | Secret key for additional  |


## ✨ Example
```javascript
<Sixchat
  uid="12345"
  title="Live Chat"
  caption="We're here to help!"
  apikey="your-api-key"
  secrete="your-secret-key"
/>
```
## ⚙️ Development
To contribute or customize the library, clone the repository and install dependencies:

```
git clone https://github.com/yourusername/sixchat.git
cd sixchat
npm install
```

### To start the development server:

```
npm start
```

## 📝 License
This project is licensed under the MIT License. See the LICENSE file for more details.

## 🤝 Contributing
Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

📧 Contact
For any questions or support, please open an issue on GitHub or contact us at contact@ralphbetta.com