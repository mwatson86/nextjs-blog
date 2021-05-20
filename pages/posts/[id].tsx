import Head from 'next/head';

import Layout from '../../components/layout';
import Date from '../../components/date';

import { getPostIds, getPostData, PostDataType } from '../../lib/posts';

import utilStyles from '../../styles/utils.module.css';

type PageType = {
  params: {
    id: string
  }
};

export function getStaticPaths() {
  const paths = getPostIds().map(id => ({
    params: { id }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: PageType) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData
    }
  };
}

export default function Post({ postData }: { postData: PostDataType }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title} 123</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        {postData.date &&
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>
        }
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
