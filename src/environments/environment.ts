// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAmpIET4krGNhfr5bPpQfpmVfQHRrqPvec",
    authDomain: "scmg-notification.firebaseapp.com",
    databaseURL: "https://scmg-notification.firebaseio.com",
    projectId: "scmg-notification",
    storageBucket: "scmg-notification.appspot.com",
    messagingSenderId: "1036640796227"
  }
};
