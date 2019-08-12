const sidebar = require('./code'); 
module.exports = {
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: sidebar
    // sidebar: [
    //   {
    //     '/heap/': [
    //       '',     /* /foo/ */
    //       'a',  /* /foo/one.html */
    //     ],
  
    //     // '/bar/': [
    //     //   '',      /* /bar/ */
    //     //   'three', /* /bar/three.html */
    //     //   'four'   /* /bar/four.html */
    //     // ],
  
    //     // // fallback
    //     // '/': [
    //     //   '',        /* / */
    //     //   'contact', /* /contact.html */
    //     //   'about'    /* /about.html */
    //     // ]
    //   }
    // ]
  }
}