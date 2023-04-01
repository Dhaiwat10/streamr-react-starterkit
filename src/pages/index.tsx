import dynamic from 'next/dynamic';

// This is because our code needs `window` to be defined
const HomePage = dynamic(() => import('./components/HomePage'), {
  ssr: false,
});

export default function Home() {
  return <HomePage />;
}
