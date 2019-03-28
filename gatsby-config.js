module.exports = {
  siteMetadata: {
    title: `wikiconga`,
    description: `Oulipian inspired poetry generator, inspired by Marcel Bénabou's Littérature définitionnelle, Wikiconga recursively concatenates Wikipedia pages.`,
    author: `Dan Beaven`,
  },
  plugins: [
    { resolve: `gatsby-plugin-typescript` },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `wikiconga`,
        short_name: `wikiconga`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
