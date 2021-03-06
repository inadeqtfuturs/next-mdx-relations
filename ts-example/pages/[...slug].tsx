import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import Link from 'next/link';
import { MDXPage, Params } from 'next-mdx-relations';
import styles from '../styles/Home.module.css';
import { getPaths, getPageProps } from '../next-mdx-relations.config';

function Slug({ mdx, ...pageNode }: MDXPage) {
  const {
    frontmatter,
    meta: { mentionedIn }
  } = pageNode;
  const {
    author,
    tags,
    title
  }: { author: string; tags: string[]; title: string } = frontmatter;
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
            ({ frontmatter: { title, tags }, params: { slug } }: MDXPage) => (
              <div key={title} className={styles.postWrapper}>
                <Link href={'/'.concat(slug.join('/'))} passHref>
                  <a className={styles.link}>{title}</a>
                </Link>
                <span>
                  tags:{' '}
                  {tags.map((t: string) => (
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

export async function getStaticProps({ params: { slug } }: Params) {
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
