import controller from './controller.mjs';

export default [
  {
    path: '/',
    method: 'get',
    controller: controller.health,
  },
];
