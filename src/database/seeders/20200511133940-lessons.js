'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('lessons', [
      // routes 1 instagram
      {
        id: 1,
        title: 'Como funciona o Instagram?',
        route_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        route_id: 1,
        title: 'Crie uma conta no Instagram pelo aplicativo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        route_id: 1,
        title: 'Crie uma conta no Instagram usando um computador',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        route_id: 1,
        title: 'Alterar o perfil para conta comercial',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // rota 2
      {
        id: 5,
        route_id: 2,
        title: 'Estruturação da Bio',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        route_id: 2,
        title: 'Instagram Stories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        route_id: 2,
        title: 'Instagram Stories: stickers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        route_id: 2,
        title: 'Instagram Stories: música',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        route_id: 2,
        title: 'Instagram Stories: links',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // route 3
      {
        id: 10,
        route_id: 3,
        title: 'Como criar #umahashtagperfeita',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: 11,
        route_id: 3,
        title: 'Planejar as suas publicações',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        route_id: 3,
        title: 'Tamanhos ideais para o Instagram',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        route_id: 3,
        title: 'Dicas de conteúdo',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('lessons', null, {})
  }
}
