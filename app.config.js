import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
});
