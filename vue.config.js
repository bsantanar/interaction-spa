process.env.VUE_APP_API_URL = "http://localhost:3000/api";
process.env.MEMBERS_MAX = 30;

module.exports = {
  chainWebpack: config => {
      config
          .plugin('html')
          .tap(args => {
              args[0].title = "Interaction";
              return args;
          })
  },
  "transpileDependencies": [
    "vuetify"
  ]
}