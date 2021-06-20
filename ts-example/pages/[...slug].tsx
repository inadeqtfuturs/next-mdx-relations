import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getPaths, getPageProps } from '../next-mdx-relations.config';

function Slug({ mdx, ...pageNode }) {
  const {
    frontmatter: { author, tags, title },
    meta: { mentionedIn }
  } = pageNode;
  console.log({ mentionedIn });
  return (
    <>
      <h1>{title}</h1>
      <p>by: {author}</p>
      <span>
        tags:{' '}
        {tags.map(t => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </span>
      <hr />
      <MDXRemote {...mdx} />
      {mentionedIn.length > 0 && (
        <>
          <hr />
          <h2>mentioned in</h2>
          {mentionedIn.map(
            ({ frontmatter: { title, tags }, params: { slug } }) => (
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
            )
          )}
        </>
      )}
    </>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const props = await getPageProps(slug);

  return {
    props
  };
}

export async function getStaticPaths() {
  const paths = await getPaths();

  return {
    paths,
    fallback: false
  };
}

export default Slug;
