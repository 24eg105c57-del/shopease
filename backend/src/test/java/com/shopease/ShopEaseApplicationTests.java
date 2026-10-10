package com.shopease;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopease.dto.AddToCartRequest;
import com.shopease.dto.CheckoutRequest;
import com.shopease.dto.LoginRequest;
import com.shopease.dto.RegisterRequest;
import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.repository.CartItemRepository;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ShopEaseApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Product savedProduct;
    private Category savedCategory;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        cartItemRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        savedCategory = new Category(null, "Test Category", "Category Desc");
        savedCategory = categoryRepository.save(savedCategory);

        Product p = new Product(null, "Test Product", "Test Description", 10.0, savedCategory, "url", 10, 4.5, 10);
        savedProduct = productRepository.save(p);

        userRepository.findByEmail("testcustomer@example.com").ifPresent(userRepository::delete);
        if (!userRepository.existsByEmail("admin@shopease.com")) {
            userRepository.save(new User(null, "Admin", "admin@shopease.com", passwordEncoder.encode("admin123"), "ROLE_ADMIN"));
        }
        if (!userRepository.existsByEmail("customer@shopease.com")) {
            userRepository.save(new User(null, "Customer", "customer@shopease.com", passwordEncoder.encode("customer123"), "ROLE_CUSTOMER"));
        }
    }

    @Test
    void contextLoads() {
    }

    @Test
    @DisplayName("GET /api/health should return UP status and 200 OK")
    void healthCheckShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.service").value("ShopEase E-Commerce API"));
    }

    @Test
    @DisplayName("GET /api/products should return list of products")
    void getAllProductsShouldReturnProducts() throws Exception {
        mockMvc.perform(get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data.content[0].name").value("Test Product"));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return product")
    void getProductByIdShouldReturnProduct() throws Exception {
        mockMvc.perform(get("/api/products/" + savedProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(savedProduct.getId()));
    }

    @Test
    @DisplayName("POST /api/products without token should be forbidden/unauthorized")
    void createProductWithoutTokenShouldBeUnauthorized() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"New Product\",\"price\":20.0,\"categoryId\":\"" + savedCategory.getId() + "\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer registration should assign ROLE_CUSTOMER and allow login")
    void customerRegistrationAndLoginFlow() throws Exception {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Test Customer");
        registerReq.setEmail("testcustomer@example.com");
        registerReq.setPassword("Password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.role").value("ROLE_CUSTOMER"));

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("testcustomer@example.com");
        loginReq.setPassword("Password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_CUSTOMER"));
    }

    @Test
    @DisplayName("Admin user can log in and access protected product creation endpoint")
    void adminCanCreateProduct() throws Exception {
        LoginRequest adminLogin = new LoginRequest();
        adminLogin.setEmail("admin@shopease.com");
        adminLogin.setPassword("admin123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String responseJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("data").get("token").asText();

        String newProductPayload = "{"
                + "\"name\": \"Admin Created Product\","
                + "\"description\": \"Created with admin authorization\","
                + "\"price\": 49.99,"
                + "\"stock\": 20,"
                + "\"categoryId\": \"" + savedCategory.getId() + "\""
                + "}";

        mockMvc.perform(post("/api/products")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newProductPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Admin Created Product"));
    }

    @Test
    @DisplayName("Complete Shopping Cart and Checkout Flow with Stock Reduction")
    void cartAndCheckoutFlow() throws Exception {
        // Log in as customer
        LoginRequest customerLogin = new LoginRequest();
        customerLogin.setEmail("customer@shopease.com");
        customerLogin.setPassword("customer123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("data").get("token").asText();

        // 1. Add item to cart
        AddToCartRequest addReq = new AddToCartRequest(savedProduct.getId(), 2);
        mockMvc.perform(post("/api/cart")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.totalAmount").value(20.0));

        // 2. Checkout
        CheckoutRequest checkoutReq = new CheckoutRequest();
        checkoutReq.setCustomerName("John Customer");
        checkoutReq.setPhoneNumber("555-0199");
        checkoutReq.setDeliveryAddress("123 Market St, Suite 400");

        MvcResult checkoutResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkoutReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.paymentMethod").value("CASH_ON_DELIVERY"))
                .andExpect(jsonPath("$.data.totalAmount").value(20.0))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andReturn();

        // 3. Verify stock was safely reduced in DB: started at 10, ordered 2 -> remaining 8
        Product updatedProduct = productRepository.findById(savedProduct.getId()).orElseThrow();
        assertEquals(8, updatedProduct.getStockQuantity());

        // 4. Verify cart is cleared
        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(0)));
    }

    @Test
    @DisplayName("Order creation fails when requesting more than available inventory")
    void cannotOrderMoreThanAvailableStock() throws Exception {
        LoginRequest customerLogin = new LoginRequest();
        customerLogin.setEmail("customer@shopease.com");
        customerLogin.setPassword("customer123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("data").get("token").asText();

        // Attempt to order 999 units (available: 10)
        AddToCartRequest addReq = new AddToCartRequest(savedProduct.getId(), 999);
        mockMvc.perform(post("/api/cart")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
