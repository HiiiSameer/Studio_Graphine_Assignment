async function fetchCategories() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );
    const products = await response.json();
    return products;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
  }
}

async function createMenu(menuItems) {
  const ul = document.createElement("ul");

  for (const item of menuItems) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${item.id}`;
    a.textContent = item.name;
    li.appendChild(a);

    if (item.child) {
      if (item.id === "product") {
        const categories = await fetchCategories();
        const categorySubMenu = await Promise.all(
          categories.map(async (category) => {
            const products = await fetchProductsByCategory(category);
            return {
              name: category,
              id: category,
              child: products.map((product) => ({
                name: product.title,
                id: product.id.toString(),
              })),
            };
          })
        );
        item.child = categorySubMenu;
      }

      li.appendChild(await createMenu(item.child));
    }

    ul.appendChild(li);
  }

  return ul;
}

async function initializeMenu() {
  const navbar = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Our Products", id: "product", child: [] },
    { name: "Contact Us", id: "contact" },
  ];

  const topMenu = document.getElementById("topMenu");
  topMenu.appendChild(await createMenu(navbar));
}

initializeMenu();

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (validateForm()) {
    console.log("Form submitted successfully!");
  }
});

function validateForm() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.trim() === "") {
    alert("Name is required.");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return false;
  }

  if (message.trim() === "") {
    alert("Message is required.");
    return false;
  }

  return true;
}
