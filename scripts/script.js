import ManagerProduct from "./mangerProduct.js";
import ManagerUser from "./mangerUser.js";
import { debounce } from "./helper/helper";
import { router } from "./views/router.js";
import CardManger from "./mangerCard.js";

let productList = [];
const fetchDada = async () => {
  console.log(ManagerProduct.products);
  const data = await ManagerProduct.getAll();
  printHtml(ManagerProduct.products);
  productList = ManagerProduct.products;
};
fetchDada();

// const totalPage = Math.ceil(ManagerProduct.products.length /perPage)
let currentPage = 1;
let start = 0;
let perPage = 8;
let end = perPage;
// console.log(totalPage)
const printHtml = (data) => {
  const elPost = document.getElementById("items");
  const View = data.map((item, index) => {
    if (index >= start && index < end) {
      return `
       <div id="item" class="col-lg-3 col-md-12 mt-5">
       <div class="card shadow-sm">
         <img class="thumbnail" src="${item.thumb}" alt="Error Image"/>
         <div class="card-body">
         <h5   style="font-weight:bold flex-shrink:0">
         <a data-id="${item.id}" class="items_box" style="color:black; text-decoration:none" href="#">${item.title} <a/> 
         </h5>
           <div class="d-flex justify-content-between align-items-center btnCrud">
             <div class="btn-group">
         <img style="width:100px; height:20px" class="thumbnail" src="${item.logo}" alt="Error Image"/>
             </div>
             <small class="text-muted">
             <button data-id="${item.id}" class="btnCard"> Mua </button>
 <button data-id="${item.id}" class="btn-delete"> Delete </button>
  <button data-id="${item.id}" class="btn_updateCOde"> Edit </button>
             </small>
           </div>
         </div>
       </div>
     </div>
       `;
    }
  });
  elPost.innerHTML = View.join("");
  document.querySelectorAll(".items_box").forEach((e) =>
    e.addEventListener("click", () => {
      const id = e.getAttribute("data-id");
      console.log("id", id);
      console.log("ManagerProduct", ManagerProduct.products);

      const detail = ManagerProduct.products.filter(
        (product) => product.id === Number(id)
      );
      console.log("detail", detail);
      rootHtml.innerHTML = router("/detail", detail[0]);
      backHomeDetail();
    })
  );
  handleDelete();
  handleUpdate();
  handleAddCard();
};

// quay laji trang chu tu trang chi tiet san pham
const backHomeDetail = () => {
  document.querySelector(".backHome").addEventListener("click", () => {
    window.location.reload();
  });
};
// fetch NextBtn Page js
const NextBtn = () => {
  document.querySelector(".nextBtn").addEventListener("click", () => {
    currentPage++;

    start = (currentPage - 1) * perPage;
    end = currentPage * perPage;
    fetchDada();
  });
};
NextBtn();
const prevBtn = () => {
  document.querySelector(".prevBtn").addEventListener("click", () => {
    currentPage--;
    start = (currentPage - 1) * perPage;
    end = currentPage * perPage;
    fetchDada();
  });
};
prevBtn();
const inputSearch = document.getElementById("input-search");
const spinerLoading = document.getElementById("loading-spiner");

const searchDouce = debounce(async (event) => {
  await ManagerProduct.searchProduct(event.target.value);
  const searchModal = document.querySelector(".search_modal");
  searchModal.innerHTML = "";
  printModalSearchHtml(ManagerProduct.products);
  printHtml(ManagerProduct.products);
  spinerLoading.classList.remove("spinner-border");
}, 1000);

if (inputSearch) {
  inputSearch.addEventListener("input", (event) => {
    spinerLoading.classList.add("spinner-border");

    searchDouce(event);
  });
}
const rootHtml = document.querySelector("#root");
// router("/");
inputSearch.addEventListener("focus", () => {
  console.log("show input search");
  const searchModal = document.querySelector(".search_modal");
  printModalSearchHtml(ManagerProduct.products);
  searchModal.classList.remove("hide");
});

inputSearch.addEventListener("blur", () => {
  console.log("show input out");
  const searchModal = document.querySelector(".search_modal");
  searchModal.classList.add("hide");
});
// Search model function
const printModalSearchHtml = (data) => {
  const elPost = document.querySelector(".search_modal");
  console.log(elPost);
  let html = "";
  let i = 0;
  for (const item of data) {
    if (i > 5) {
      break;
    }
    html += `
    <div class="row">
        <div class="col-md-3">
          <img class="img-thumbnail" src="${item.thumb}" />
        </div>
        <div class="col-md-8">
        <a data-id=${item.id} class="item_href" href="#"/>
        <p>${item.title}</p>
        <p class="price">${item.description}</p>
        </a>
        </div>
    </div>
    `;
    i++;
  }
  i = 0;
  elPost.innerHTML = html;
  document.querySelectorAll(".item_href").forEach((e) =>
    e.addEventListener("click", () => {
      const id = e.getAttribute("data-id");
      const detail = ManagerProduct.products.filter(
        (product) => product.id === id
      );
      rootHtml.innerHTML = router("/detail", detail[0]);
      window.history.pushState({}, null, `/detail/${detail[0].id}`);
    })
  );
};
// handel  Delete
const handleDelete = (callback) => {
  document.querySelectorAll(".btn-delete").forEach((e) =>
    e.addEventListener("click", (id) => {
      const i = e.getAttribute("data-id");
      if (confirm("are you sure delete") == true) {
        const productDeleted = ManagerProduct.products.filter(
          (product) => product.id !== Number(id)
        );
        console.log(productDeleted);
        var options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        };
        fetch("http://localhost:3000/products" + "/" + i, options)
          .then((res) => {
            res.json();
          })
          .then(function () {
            printHtml(productDeleted);
             window.location.reload()
          });
      } else {
        return;
      }
    })
  );
};

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOMContent");
  const btn_login = document.querySelector("#btn_login");
  console.log("btn_login", btn_login);
  if (btn_login) {
    btn_login.addEventListener("click", function (e) {
      e.preventDefault();
      alert("show login form");
      return false;
    });
  }
});

const btn = document.querySelector("#btn-login");
if (btn) {
  btn.addEventListener("click", () => {
    rootHtml.innerHTML = router("/login");
    window.history.pushState({}, null, `/login`);
    xuLyLogin();
  });
}

const btnRegister = document.querySelector("#btn-register");
if (btnRegister) {
  btnRegister.addEventListener("click", () => {
    rootHtml.innerHTML = router("/register");
    window.history.pushState({}, null, `/register`);
    xuLyRegister();
  });
}

const xuLyLogin = () => {
  const elUsername = document.getElementById("username");
  const elPassword = document.getElementById("password");
  const elButtonLogin = document.getElementById("btn-login-submit");
  const elErros = document.getElementById("errors");
  let errors = [];
  console.log("elButtonLogin", elButtonLogin);
  elButtonLogin.addEventListener("click", async (event) => {
    event.preventDefault();
    if (elUsername.value.trim() === "") {
      errors.push("user not empty");
    }
    if (elPassword.value.trim() === "") {
      errors.push("password not empty");
    }
    if (errors.length > 0) {
      // show error message
      elErros.innerHTML = errors.join("</br>");
      return;
    } else {
      // dang nhap thanh cong
      const isLogin = await ManagerUser.login(
        elUsername.value,
        elPassword.value
      );
      if (isLogin) {
        document.querySelector("#btn-login").classList.add("hidden");
        document.querySelector("#btn-register").classList.add("hidden");
        const navigation = document.querySelector(".navbar-nav");
        navigation.insertAdjacentHTML(
          "beforeend",
          `<li class="nav-item">
        <a id="btn-admin" class="nav-link" href="#">admin</a>
        <a id="btn-logout" class="nav-link" href="#">Logout</a>
        </li>`
        );
        window.location.reload();
      }
    }
  });
};

const checkUser = () => {
  const isLogin = ManagerUser.checkLogin();
  if (isLogin) {
    const user = ManagerUser.getUser();
    console.log("user", user);
    if (user) {
      document.querySelector("#btn-login").classList.add("hidden");
      document.querySelector("#btn-register").classList.add("hidden");
    }
    const navigation = document.querySelector(".menu-right");
    navigation.insertAdjacentHTML(
      "beforeend",
      `<ul class="admin-box">
       ADMIN
        <li class="nav-link admin_model">
        <a href="nav-link ">Cpanel Admin</a>
        <a class="nav-link nav_logout" href="#">Logout</a>
        </li>
      </ul>`
    );
    // View Login
  } else {
    // View Gest
  }
};
checkUser(navigation);

const logout = () => {
  const el = document.querySelector(".nav_logout");
  console.log("el", el);
  if (el) {
    el.addEventListener("click", () => {
      document.querySelector("#btn-login").classList.remove("hidden");
      document.querySelector("#btn-register").classList.remove("hidden");

      ManagerUser.logout();
      rootHtml.innerHTML = router("/login");
      window.history.pushState({}, null, `/login`);
      window.location.reload();
      el.remove();
    });
  }
};

logout();
// xu ly view admin
 // back PageHome
  
// sử lý đăng ký
const xuLyRegister = () => {
  const elUsername = document.getElementById("username");
  const elPassword = document.getElementById("password");
  const elEmail = document.getElementById("email");
  const elButtonLogin = document.getElementById("btn-register-submit");
  const elErros = document.getElementById("errors");
  const errors = [];
  elButtonLogin.addEventListener("click", async (event) => {
    event.preventDefault();
    if (elUsername.value.trim() === "") {
      errors.push("user not empty");
    }
    if (elPassword.value.trim() === "" && elPassword.value.length < 3) {
      errors.push("password not empty");
    }
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(elEmail.value.trim())) {
      errors.push("email not emty");
    }
    if (errors.length > 0) {
      // show error message
      elErros.innerHTML = errors.join("</br>");
      return;
    } else {
      // dang nhap thanh cong
      const isRegister = await ManagerUser.register(
        elUsername.value,
        elPassword.value,
        elEmail.value
      );
      console.log("isRegister", isRegister);
      if (!isRegister) {
        // lưu vào db -> chuyển về trang đăng nhập
        var options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: elUsername.value,
            password: elPassword.value,
            email: elEmail.value,
          }),
        };
        fetch("http://localhost:3000/users", options);
         rootHtml.innerHTML = router('/login')
      } else {
        elErros.innerHTML = "user đã tồn tại";
      }
    }
  });
};
const btnCreate = document.querySelector(".create_btn");
if (btnCreate) {
  btnCreate.addEventListener("click", () => {
    rootHtml.innerHTML = router("/createPost");
    window.history.pushState({}, null, `/createPost`);
    xulyCreatePost();
  });
}
//xu ly creqate post
function xulyCreatePost() {
  const Title = document.querySelector("#username");
  const thumbnail = document.querySelector("#password");
  const description = document.querySelector("#description");
  const btnSubmit = document.querySelector("#btn-login-submit");
  const elErros = document.querySelector("#errors");
  const errors = [];
  btnSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    if (Title.value.trim() === "") {
      errors.push("Vui lòng nhập thông tin tiêu đề");
    }
    if (thumbnail.value.trim() === "") {
      errors.push("Vui lòng nhập thông tin hình ảnh");
    }
    if (description.value.trim() === "") {
      errors.push("Vui lòng nhập thông tin nội dung ");
    }
    if (errors.length > 0) {
      // show error message
      elErros.innerHTML = errors.join("</br>");
      return;
    } else {
      // dang nhap thanh cong
      const isRegister = await ManagerProduct.create(
        Title.value,
        thumbnail.value,
        description.value
      );
      console.log("isRegister", isRegister);
      if (!isRegister) {
        // lưu vào db -> chuyển về trang đăng nhập
        var options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: Title.value,
            thumbnail: thumbnail.value,
            description: description.value,
          }),
        };
        fetch("http://localhost:3000/products", options);
         window.location.reload()
         

      } else {
        elErros.innerHTML = "user đã tồn tại";
      }
    }
  });
}

function handleUpdate() {
  document.querySelectorAll(".btn_updateCOde").forEach((e) => {
    const id = e.getAttribute("data-id");
    e.addEventListener("click", () => {
      const ProductEdit = ManagerProduct.products.filter((product) => {
        return product.id === Number(id);
      });
      rootHtml.innerHTML = router("/updatePost", ProductEdit[0]);
      window.history.pushState({}, null, `/updatePost/${ProductEdit[0].id}`);
      console.log(ProductEdit);
      const submitEdit = document.getElementById("btn-login-submit");
      submitEdit.addEventListener("click", () => {
        const des = document.getElementById("description");
        const pass = document.getElementById("password");
        const user = document.getElementById("username");
        var formdata = {
          title: user.value,
          description: des.value,
          thumb: pass.value,
        };
        const options = {
          method: "PUT",
          body: JSON.stringify(formdata),
          headers: {
            "Content-Type": "application/json",
          },
        };
        fetch("http://localhost:3000/products" + "/" + id, options).then(
          (res) => {
            res.json();
             window.location.reload()
          }
        );
      });
    });
  });
}
//   add Card

const handleAddCard = () => {
  document.querySelectorAll(".btnCard").forEach((e) => {
    e.addEventListener("click", () => {
      const id = e.getAttribute("data-id");
      const addProduct = ManagerProduct.products.filter(
        (card) => card.id === Number(id)
        );
        console.log(addProduct);
        cardData.add({ ...addProduct[0], quantity: 1 });
        console.log("addProduct", cardData.carts);
      });
    });
  };
   // router View card
  const cardData = new CardManger();
    document
    .querySelector("#btn-card")
    .addEventListener("click", () => {
      rootHtml.innerHTML = router("/card", cardData);
      window.history.pushState({}, null, `/card`);
      deleteCard()
       checkout()
    });

    const deleteCard = () => {
      const del = document.querySelectorAll(".delete_card");
      del.forEach((e) => {
        e.addEventListener("click", () => {
          const id = e.getAttribute("data-id");
         console.log(cardData.carts)
       const dels = cardData.remove(Number(id));
          console.log(dels);
          //render card
          rootHtml.innerHTML = router('/card' , cardData)
          window.history.pushState({} , null , '/card')
          
        });
      });
};
 function checkout () {
    document.querySelector('.checkout-btn').addEventListener('click' , function () {
    
    })
 }

