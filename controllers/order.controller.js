const Order = require("../models/order.model");

exports.createOrder = async (req, res, next) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });
  const order = await newOrder.save();
  return res.status(201).send({ message: "New Order Created", order });
};

exports.getOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    return res.send(order);
  } else {
    return res.status(404).send({ message: "Order Not Found" });
  }
};

exports.updateOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    return res.send({ message: "Order Paid", order: updatedOrder });
  } else {
    return res.status(404).send({ message: "Order Not Found" });
  }
};

exports.getCurrentUserOrder = async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (order) {
    return res.send(order);
  } else {
    return res.status(404).send({ message: "you did not have any order" });
  }
};
