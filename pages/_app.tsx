import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { configureStore } from '@reduxjs/toolkit';
import usernameSlice from '../store/store';
import { Provider } from 'react-redux';
import '../network/index';

const store = configureStore({
  reducer: {
    username: usernameSlice,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  ); // Component 根据路由来渲染组件
}

export default MyApp;
