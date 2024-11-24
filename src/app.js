import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './locales/resources.js';
import parseFeed from './parserRSS.js';
import customErrors from './locales/yupLocale.js';

const refreshTimeout = 5000;
const validateUrl = (url, urls) => {
  const schema = yup.string()
    .url(customErrors.string.url)
    .required();
  return schema
    .notOneOf(urls, customErrors.string.test)
    .validate(url)
    .then(() => null)
    .catch((error) => error.message.key);
};

const addProxy = (originUrl) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('url', originUrl);
  proxyUrl.searchParams.set('disableCache', 'true');
  return proxyUrl.toString();
};

const getErrorCode = (error) => {
  if (error.isAxiosError) {
    return 'networkError';
  }
  if (error.isParseError) {
    return 'parseError';
  }
  return 'unknown';
};

const getParsedData = (url) => {
  const proxiedUrl = addProxy(url);
  const getRequest = axios.get(proxiedUrl, { responseType: 'json' });
  return getRequest
    .then((response) => {
      const data = response.data.contents;
      const feed = parseFeed(data);
      return feed;
    });
};

const loadRss = (url, state) => {
  const setState = state;
  setState.rssForm.status = 'loading Rss';
  return getParsedData(url).then((feed) => {
    const { feedTitle, feedDescription, posts } = feed;
    const feedId = _.uniqueId('feed_');
    const postswithIds = posts.map((post) => ({
      ...post,
      feedId,
      postId: _.uniqueId('post_'),
    }));
    setState.feeds = [
      ...state.feeds,
      {
        feedTitle,
        feedDescription,
        feedId,
        feedUrl: url,
      },
    ];
    setState.posts = [...postswithIds, ...state.posts];
    setState.rssForm.status = 'success';
    setState.rssForm.fields.input = '';
  })
    .catch((error) => {
      setState.rssForm.error = getErrorCode(error);
    });
};

const updatePosts = (state) => {
  const setState = state;
  const { feeds } = setState;
  const feedsPromises = feeds.map(({ feedUrl, feedId }) => {
    setState.rssForm.status = 'loading Rss';
    const oldPosts = state.posts.filter((post) => post.feedId === feedId);
    return getParsedData(feedUrl)
      .then((feed) => {
        const { posts } = feed;
        const oldPostsTitles = oldPosts.map((post) => post.title);
        const newPosts = posts.filter((post) => !oldPostsTitles.includes(post.title));
        const newUpdatedPosts = newPosts.map((post) => (
          {
            ...post,
            feedId,
            postId: _.uniqueId('post_'),
          }
        ));
        setState.posts = [...newUpdatedPosts, ...state.posts];
      })
      .catch(() => {});
  });
  Promise.all(feedsPromises).then(() => setTimeout(() => updatePosts(state), refreshTimeout));
};

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    example: document.querySelector('.example'),
    message: document.querySelector('.feedback'),
    submitBtn: document.querySelector('button[type="submit"]'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    yup.setLocale(customErrors);

    const state = watch(elements, i18nInstance, {
      rssForm: {
        fields: {
          input: '',
        },
        error: '',
        status: '',
      },
      feeds: [],
      posts: [],
      ui: {
        openedLinks: new Set(),
        id: null,
      },
    });

    updatePosts(state);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const url = data.get('url');
      state.rssForm.fields.input = url;
      const urls = _.map(state.feeds, ({ feedUrl }) => feedUrl);
      validateUrl(url, urls)
        .then((error) => {
          if (!error) {
            state.rssForm.error = '';
            loadRss(url, state);
            return;
          }
          state.rssForm.error = error;
        });
    });

    elements.postsContainer.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      if (id === null) {
        return;
      }
      state.ui.id = id;
      state.ui.openedLinks.add(id);
    });
  }).catch((err) => {
    console.error('Error initializing i18next:', err);
  });
};

export default app;
