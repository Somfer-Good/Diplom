import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { ConfigProvider } from 'antd';
import ru_RU from 'antd/locale/ru_RU';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <ConfigProvider locale={ru_RU}>
            <App />
        </ConfigProvider>
    </React.StrictMode>
);