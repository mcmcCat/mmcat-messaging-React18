import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '../network/index';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />; // Component 根据路由来渲染组件
}

export default MyApp;
