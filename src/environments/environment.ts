// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAVdqmOEFQawMJNi2seM9C5BhcblerSgLI",
    authDomain: "legendsapp-9817f.firebaseapp.com",
    projectId: "legendsapp-9817f",
    storageBucket: "legendsapp-9817f.appspot.com",
    messagingSenderId: "59355372271",
    appId: "1:59355372271:web:81cb31f7423054c8b5191a",
    measurementId: "G-RHEHKFYYJ9"
  },
  useEmulators: {},
  airtable_token: "patRMlff8oQvBi15b.aa8b99c6a475dbce771a67f824f77e754fffdef554295d11a12082e830bd770f"
};

export const actionCodeSettings = {
  url: 'http://10.0.0.2:4200/',
  handleCodeInApp: true
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
