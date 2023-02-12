//  *  array quản lý post
//  */
import { getAll, searchProduct , postData , sort  } from "./services/productServices.js";
 const USER_PRODUCT ="user_product"
class ManagerProduct {
  constructor(products) {
    this.products = products;
  }
  static async getAll() {
    const data = await getAll();
    this.products = data;
  }
  static async searchProduct(keyword) {
    const data = await searchProduct({
      title_like: keyword,
    });
    this.products = data;
  }
   static async sort() {
     const data = await sort();
     this.products = data
   }
  // tạo trường tạo Course
  static async create(title, thumbnail , description) {
    console.log("isProduct , is call");
    const data = await postData(title, thumbnail, description);
    console.log("data", data.length);
    if (data.length > 0) {
      ManagerProduct.saveProductData(data[0]);
      return true;
    }
    return false;
  }
  static saveProductData(data) {
    localStorage.setItem(USER_PRODUCT, JSON.stringify(data));
  }
 
  // static register = (product) => {
  //   this.products.push(product);
  // }
}

export default ManagerProduct;
