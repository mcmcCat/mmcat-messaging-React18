export async function getServerSideProps() {
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
export default function BlogSSR({ time }: { time: any }) {
  return (
    <div>
      <h1>每次刷新，即每次请求页面都会去获取动态数据</h1>
      <h2>BlogSSR: {time}</h2>
    </div>
  );
}
