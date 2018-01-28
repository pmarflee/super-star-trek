import Vue from 'vue';
import VueRouter, { Location, Route, RouteConfig } from 'vue-router';
import { makeHot, reload } from './util/hot-reload';

const homeComponent = () => import('./components/home').then(({ HomeComponent }) => HomeComponent);
const gameComponent = () => import('./components/game').then(({ GameComponent }) => GameComponent);

if (process.env.ENV === 'development' && module.hot) {
  const homeModuleId = './components/home';

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(homeModuleId, homeComponent,
    module.hot.accept('./components/home', () => reload(homeModuleId, (<any>require('./components/home')).HomeComponent)));
}

Vue.use(VueRouter);

export const createRoutes: () => RouteConfig[] = () => [
  {
    name: 'home',
    path: '/',
    component: homeComponent,
  },
  {
    name: 'game',
    path: '/game/:seed',
    component: gameComponent,
    props: true
  }
];

export const createRouter = () => new VueRouter({ mode: 'history', routes: createRoutes() });
