export async function getStaticProps() {
  // 模拟动态请求回来的数据
  const time = new Date().toString();

  // 返回结果
  return {
    props: {
      time,
    },
  };
}

// Blog 组件
export default function BlogSSG({ time }: { time: any }) {
  return (
    <div>
      <h1>只获取得到构建时缓存的数据</h1>
      <h2>BlogSSR: {time}</h2>
    </div>
  );
}
