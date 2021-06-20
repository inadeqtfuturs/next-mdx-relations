import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Page } from 'next-mdx-relations/src/types';
import { getPages } from '../next-mdx-relations.config';

export default function Blog({ posts }: { posts: Page[] }) {
  return (
    <>
      <h1>blog</h1>
      <p>A list of all posts</p>
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
  const posts: Page[] = await getPages();

  return {
    props: {
      posts
    }
  };
}
