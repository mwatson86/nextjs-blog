import fs from 'fs'
import path from 'path'
import remark from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'

const postDirectory = path.resolve(process.cwd(), 'posts');

export type PostDataType = {
  id: string;
  contentHtml: string;
  title?: string;
  date?: string;
};

export function getPostIds() {
  const filenames = fs.readdirSync(postDirectory);

  return filenames.map(filename => filename.replace(/\.md$/, ''));
};

export async function getPostData(id: string): Promise<PostDataType> {
  const pathToFile = path.resolve(postDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(pathToFile, 'utf8');

  const parsedFileContents = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(parsedFileContents.content);

  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...parsedFileContents.data
  };
}

export async function getSortedPostsData() {
  const ids = getPostIds();

  const postsData = await Promise.all(
    ids.map(async id => {
      const postData = await getPostData(id);
      return postData;
    })
  );

  return postsData.sort((a, b) => {
    if (a.date! < b.date!) {
      return 1
    } else {
      return -1
    }
  })
}
