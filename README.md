# Imagespot is an image sharing web app that allows users to upload, view, and share images with others. It aims to provide a platform for people to share and discover beautiful, interesting, and meaningful images, and could appeal to a wide range of users. The app includes features such as user accounts, image uploads, browsing, sharing.

## How to setup locally:

### Due to the SPA routing logic and requirements of the project, It must be running on a server. If running on VSCode's Live server, some pages won't load after you refresh and you'd have to go back to the home page and reroute there. If hosted on an online service such as render, setup a rewrite logic to reroute all requests to the home page.

#### eg. Rewrite /* to /index.html
