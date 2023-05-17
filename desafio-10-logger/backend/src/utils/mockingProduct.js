import {faker} from '@faker-js/faker';


export const generateProducts = () => {

  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productAdjective(),
    price: faker.commerce.price({ min: 1000, max: 10000 }),
    thumbnail: faker.image.url(),
    code: faker.datatype.uuid(),
    stock: faker.number.int({ min: 10, max: 100 }),   
    category: faker.commerce.productAdjective()

  }
}