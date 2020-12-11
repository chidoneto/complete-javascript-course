const shoppingCart = [
  { product: 'bread', quantity: 6 },
  { product: 'pizza', quantity: 2 },
  { product: 'milk', quantity: 4 },
  { product: 'water', quantity: 10 },
];

const allowedProducts = {
  lisbon: 5,
  others: 7,
};

const checkCorrectAllowedProducts = function (cart, numAllowed, city) {
  if (!cart || !cart.length) return;

  let allowed = (numAllowed[city] !== undefined) ? numAllowed[city] : numAllowed['others'];

  return cart.map(item => {
    return { ...item, quantity: (item.quantity > allowed) ? allowed : item.quantity };
  });
}

let allowedShoppingCart = checkCorrectAllowedProducts(shoppingCart, allowedProducts, 'lisbon');
console.log(allowedShoppingCart);

allowedShoppingCart = checkCorrectAllowedProducts(shoppingCart, allowedProducts, 'faro');
console.log(allowedShoppingCart);

const createOrderDescription = function (cart) {
  const [{ product: p, quantity: q }] = cart;

  return `Order with ${q} ${p}${cart.length > 1 ? ', etc...' : '.'}`;
};

let orderDescription = createOrderDescription(allowedShoppingCart);
console.log(orderDescription);

orderDescription = createOrderDescription([{ product: 'pizza', quantity: 2 }]);
console.log(orderDescription);
