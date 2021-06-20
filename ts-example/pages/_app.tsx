import '../styles/globals.css';
import Link from 'next/link';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <header>
        <Link href="/" passHref>
          <a className="brand" aria-label="home">
            {'</>'}
          </a>
        </Link>
        <nav>
          <Link href="/blog" passHref>
            <a className="menuItem">blog</a>
          </Link>
          <Link href="/about" passHref>
            <a className="menuItem">about</a>
          </Link>
        </nav>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer>
        <a href="https://github.com/inadeqtfuturs">github</a>
        <a href="https://digital-garden.dev" className="plantLink">
          <span role="img" aria-label="seedling">
            🌱
          </span>
        </a>
      </footer>
    </div>
  );
}
export default MyApp;
