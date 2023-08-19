# Administrative panel to manage the site

It is an administrative panel for editing text, pictures, and meta tags on HTML site pages, with authorization in the administrative panel at the server level. It is possible to choose which pages to edit. Automatically creates a backup copy when the page is saved, and there is a mechanism for restoring pages from backups. The administration panel is not tied to a specific site and can be used on any site.

Stack and what I did: The client-side - React, the server-side - PHP. Built Gulp, Webpack, Babel, and a local MAMP server. Added API functions to add and delete pages on the server (PHP). Created visual editor via Iframe, adding edit element tag and making a copy of DOM tree for further work. Added API for saving changes on the server. Created UI and modal windows with UIkit. Implemented authorization in the application and rendering only after authorization. Requests to the server through Axios. The editing page happens in Iframe where the DOM copy is edited; after saving the DOM copy overwrites DOM, create an HTML file that will overwrite the old one before adding a copy of the old one to the backup folder for later restore.


## Installation

1. Clone the repository:

```bash
git clone https://github.com/Zhuk-off/admin-panel.git
```

2. Install dependencies:

```bash
npm install
```

## Contacts

You can contact me by email: zhukoffweb@gmail.com