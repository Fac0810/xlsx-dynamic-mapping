const { getHelloUseCase } = require('../use-cases/getHelloUseCase');


const helloController = (req, res) => {
  const message = getHelloUseCase();
  res.status(200).send(message);
};

module.exports = { helloController };