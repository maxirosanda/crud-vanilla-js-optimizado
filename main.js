// Módulo de manipulación del DOM
const domManipulator = {
    root: document.getElementById("root"),
  
    createElement: (nameTarget, nameId, nameClass, content) => {
      const element = document.createElement(nameTarget)
      element.classList = nameClass
      element.id = nameId
      element.innerHTML = content
      return element
    },
  
    createProductForm: () => {
      const formElement = domManipulator.createElement(
        "form",
        "create-form",
        "template-form",
        `<input type="text" name="productName" placeholder="Ingrese nombre del producto" required>
         <input type="number" name="productPrice" placeholder="Ingrese precio del producto" required>
         <input type="number" name="productStock" placeholder="Ingrese stock" required>
         <button type="submit">Crear Producto</button>`
      )
      domManipulator.root.prepend(formElement)
    },
    createCardsContainer:()=>{
        const cards = domManipulator.createElement("section", "cards", "cards", "")
        domManipulator.root.append(cards)
    },
  
    createProductView: ({ id, name, price, stock }) => {
      const container = document.getElementById("cards")
      const element = domManipulator.createElement(
        "form",
        "product-" + id,
        "template-form",
        `
        <input type="hidden" value="${id}" name="productId">
        <input type="text" value="${name}" name="productName">
        <input type="number" value="${price}" name="productPrice">
        <input type="number" value="${stock}" name="productStock">
        <button type="button" class="btn-update">Actualizar</button>
        <button type="button" class="btn-delete">Borrar</button>
        `
      );
      return element
    },
    addElementView:(nameClass,element)=>{
        const container = document.getElementById(nameClass)
        container.append(element)
    },
    createProductsView: (products) => {
        const fragment = document.createDocumentFragment()
        const cards = document.getElementById("cards") // Almacenar referencia al contenedor cards
        const productView = products.map((product) => {
            return domManipulator.createProductView(product)
          });
      
          fragment.append(...productView);
          cards.innerHTML = "" // Limpiar el contenido existente
          cards.append(fragment)
        },
           
    showMessage: (text) => {
      const message = domManipulator.createElement("div", "", "message", text)
      domManipulator.root.append(message)
    },
  
    showPopup: (text) => {
      return new Promise((resolve) => {
        const element = domManipulator.createElement(
          "div",
          "",
          "popup",
          `
          <div class="info">
            <h3>${text}</h3>
            <div>
              <button class="confirm">Si</button>
              <button class="reject">No</button>
            </div>
          </div>
        `
        );
        domManipulator.root.append(element)
  
        const handleClick = (e) => {
          if (e.target.classList.contains("confirm")) {
            element.remove()
            resolve(true)
          }
          if (e.target.classList.contains("reject")) {
            element.remove()
            resolve(false)
          }
        }
  
        element.addEventListener("click", handleClick);
      })
    },
  }
  
  // Módulo de gestión de productos
  const products = {
    items: JSON.parse(localStorage.getItem("products")) || [],
    id: JSON.parse(localStorage.getItem("id")) || 0,
  
    createProduct: (data) => {
      data.id = products.id
      products.items.push(data)
      localStorage.setItem("products", JSON.stringify(products.items))
      products.id++
    },
  
    updateProduct: (data) => {
      const index = products.items.findIndex((product) => product.id == data.id)
      if (index !== -1) {
        products.items[index] = data
        localStorage.setItem("products", JSON.stringify(products.items))
      }
    },
  
    deleteProduct: (id) => {
      const index = products.items.findIndex((product) => product.id == id)
      if (index !== -1) {
        products.items.splice(index, 1)
        localStorage.setItem("products", JSON.stringify(products.items))
      }
    },
  }
  
  // Módulo de interacción y eventos
  const interactionModule = {
    handleCreateProduct: () => {
      const element = document.getElementById("create-form")
      element.addEventListener("submit", (e) => {
        e.preventDefault()
        const inputData = {
          name: element.elements.productName.value,
          price: element.elements.productPrice.value,
          stock: element.elements.productStock.value,
        }
        products.createProduct(inputData)
        const newProductView = domManipulator.createProductView(inputData)
        domManipulator.addElementView("cards",newProductView)
        domManipulator.showMessage("Producto creado")
        element.reset()
      });
    },
  
    handleEditProduct: () => {
      const cards = document.getElementById("cards")
      cards.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn-update")) {
          const element = e.target.closest(".template-form");
          const { productId, productName, productPrice, productStock } = element.children
          const inputData = {
            id: productId.value,
            name: productName.value,
            price: productPrice.value,
            stock: productStock.value,
          }
          const accept = await domManipulator.showPopup("¿Quiere actualizar el producto?")
          if (accept) {
            products.updateProduct(inputData)
            domManipulator.showMessage("Producto actualizado")
          } else {
            element.reset()
          }
        }
        if (e.target.classList.contains("btn-delete")) {
          const element = e.target.closest(".template-form")
          const id = element.children.productId.value
          const accept = await domManipulator.showPopup("¿Quiere eliminar el producto?")
          if (accept) {
            products.deleteProduct(id)
            domManipulator.showMessage("Producto eliminado")
            element.remove()
          }
        }
      })
    },
  }
  
  // Inicialización
  domManipulator.createProductForm()
  domManipulator.createCardsContainer()
  domManipulator.createProductsView(products.items)
  interactionModule.handleCreateProduct()
  interactionModule.handleEditProduct()