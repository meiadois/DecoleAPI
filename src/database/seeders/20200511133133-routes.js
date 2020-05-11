'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('routes', [
      {
        id: 1,
        title: 'Primeiros passos no Instagram',
        description: 'Aprenda como apresentar seu negocio no Instagram',
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        id: 2,
        title: 'Primeiros passos no Facebook ',
        description: 'Aprenda como apresentar seu negocio no Facebook ',
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        id: 3,
        title: ' Conta Comercial e Publicações no Instagram ',
        description: ' aprenda como conectar suas redes social,sobre conta comercial,pubicações',
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        id: 4,
        title: 'Primeiros passos no MercadoLivre',
        description: 'Aprenda como apresentar seu negocio no MercadoLivre',
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        id: 5,
        title: 'Primeiros passos no Twitter',
        description: 'Aprenda como apresentar seu negocio no Twitter',
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('routes', null, {});
  }
};