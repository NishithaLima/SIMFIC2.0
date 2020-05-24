# FictionUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.5. Front end of Fiction interacts with spring boot application making GET and POST calls. The path is configurable in /asset/config.json.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Tomcat Server
Run 'ng build --prod --base-href <app-name>. Change base ref in index.html to base href = "/<app-name>/". Run the app in tomcat to 'http://localhost:4200/'
  
## Backend Configuration
Take build from the branch UI , Repo: https://github.com/surajsrivathsa/fiction.git.
Build war files and deploy it in tomcat server.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build --prod <app-name>` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
