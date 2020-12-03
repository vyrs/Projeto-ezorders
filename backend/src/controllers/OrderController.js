const Order = require('../models/Order');

class OrderController {
  async index(request, response) {
    const orders = await Order.find();
    response.json(orders);
  }

  async store(request, response) {
    // não precisa pegar o status pq já definimos um valor default
    const { table, description } = request.body;

    if (!table || !description) {
      return response.sendStatus(400);
    }

    const order = await Order.create({ table, description });

    request.io.emit('newOrder', order);
    response.json(order); // nem precisaria disso por ser uma aplicação simples com um tela mas é interessante colocar
  }

  async update(request, response) {
    try {
      const { id } = request.params; // params é da url
      const { status } = request.body; // body é o json enviado no post

      // precisa verifiar apenas o status pq se não tiver o id
      // nem vai chegar nessa rota pq tem que ter id na url
      if (!status) {
        return response.sendStatus(400);
      }

      const order = await Order.findByIdAndUpdate(
        { _id: id }, // esse 1° objeto significa que vamos buscar no mongo um order com _id igual ao id que recebemos aqui
        { status }, // esse 2° objeto é para especificar qual propriedade do pedido queremos atualizar, ou seja aqui estamos passando o status que recebemos pelo request.body e atualizando o status do pedido
        { new: true, runValidators: true }, // precisamos desse new pq quando usamos o findByIdAndUpdate o que fica salvo na const order é as informações antigas do pedido só depois que faz o update, com esse new agora depois do update a const order vai receber as informações atualizadas do pedido depois do update
      ); // esse runValidators é para forçar que o mongoose só aceite um status igual um daqueles do enum do model ou seja apenas 'PENDING', 'PREPARING', 'DONE'.

      request.io.emit('statusChange', order);
      response.json(order);
    } catch (error) {
      response.sendStatus(500);
    }
  }
}

// retornando a instancia da classe direto podemos acessar os metodos lá no routes direto
// sem instanciar a classe lá com new
module.exports = new OrderController();
