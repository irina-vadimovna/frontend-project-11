export default function parseRss(html) {
  const parser = new DOMParser();
  const data = parser.parseFromString(html, 'text/xml');
  const parsererror = data.querySelector('parsererror');
  if (parsererror) {
    throw new Error('invalidRss');
  }
  const channel = data.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const items = channel.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    return { postTitle, postDescription, postLink };
  });
  return {
    feed: { title, description },
    posts,
  };
}
