import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format } from 'date-fns'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';
import Link from 'next/link';

type  Post = {
  uid?: string;
  updatedAt: string | null;
  data: {
    slug: string;
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostsProps  {
  posts: Post[]
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}
export default function Home({ posts }: Post) {
  <>
  <Head>
  <title>SpaceTraveling</title>
</Head>
<nav>
  <img src='Logo.svg' alt="logo" />
</nav>

<main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post => (
                        <Link href={`/posts/${post.slug}`}>
                        <a key={posts.slug}href='#'>
                        <time>{posts.updatedAt}</time>
                        <strong>{posts.title}</strong>
                        <p>{posts.heading}</p>
                    </a>
                        </Link>
                        
                    ))}
                    
                </div>
            </main>




</>

}

export const getStaticProps = async () => {//TODO
const prismic = getPrismicClient();

const postsResponse = await prismic.query<any>([
  Prismic.predicates.at('document-type', 'posts')], {
    fetch:['posts.title', 'posts.content'],
    pageSize: 5,
  });//TODO

  const posts = postsResponse.results.map(post => {
    return {
      slug: posts.uid,
      title: posts.title,
      subtitle: posts.subtitle,
      author: posts.author,
      banner: posts.banner,
      heading: posts.heading,
      body: posts.body,
      updatedAt:format(
        new Date(),
        posts.last_publication_date,
        {
          locale: ptBR,
        }
      )
       

    }
  })

  return {
    props: {
      posts
    }
  }


};
