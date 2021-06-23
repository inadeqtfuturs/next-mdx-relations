import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Page } from 'next-mdx-relations/types';
import { getPages } from '../next-mdx-relations.config';

export default function Home({ posts }: { posts: Page[] }) {
  return (
    <>
      <h1>next-mdx-relations</h1>
      <p>I have some md/x files. I want to draw relations between them.</p>
      <hr />
      <h2>featured posts</h2>
      {posts &&
        posts.map(({ frontmatter: { title, tags }, params: { slug } }) => (
          <div key={title} className={styles.postWrapper}>
            <Link href={slug.join('/')} passHref>
              <a className={styles.link}>{title}</a>
            </Link>
            <span>
              tags:{' '}
              {tags.map(t => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </span>
          </div>
        ))}
    </>
  );
}

export async function getStaticProps() {
  const posts: Page[] = await getPages({ frontmatter: { featured: true } });

  return {
    props: {
      posts
    }
  };
}
