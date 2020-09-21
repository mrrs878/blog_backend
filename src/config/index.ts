const MAIN_CONFIG = {
  db: process.env.NODE_ENV === 'production' ? 'mongodb://blog_database' : 'mongodb://127.0.0.1:27017/article',
};

export default MAIN_CONFIG;
