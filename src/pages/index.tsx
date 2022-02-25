import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { RichText } from 'prismic-dom';

interface  Post  {
  uid?: string;
  updatedAt: string | null;
  heading: string;
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
  posts: Post[];
}
export default function Home({ posts }: PostsProps) {
        return (
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
                        //<Link href={`/posts/${post.data.slug}`}>
                        <a key={post.data.slug}href='#'>
                        <time>{post.updatedAt}</time>
                        <strong>{post.data.title}</strong>
                        <p>{post.heading}</p>
                    </a>
                        //</Link>
                        
                    ))}
                    
                </div>
            </main>




</>
        )

}

export const getStaticProps = async () => {//TODO
const prismic = getPrismicClient();

const response = await prismic.query<any>([
  Prismic.predicates.at('document.type', 'posts')], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author' ],
    pageSize: 1,

  });//TODO

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      subtitle: post.data.subtitle,
      author: post.data.author,
      //banner: post.data.banner.url,
      heading: post.data.heading?.text ?? '',
      body:  post.data.body?.text ?? '',
      updatedAt:  format(new Date(post.first_publication_date), 'dd MMM yyyy', {
        locale: ptBR,
      }

      )
    
    }
    
    }
  )
  console.log(posts)


  return {
    
    props: {
      posts
    },
    
    revalidate: 60 * 30, // 30 minutos
    
  }
  


};
