package com.shopease.config;

import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!prod") // Development-only initialization
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initAdminAccount();
        initCustomerAccount();
        initSampleData();
    }

    /**
     * Development-only method to initialize default administrator account.
     * Public registration will never create ADMIN users.
     */
    private void initAdminAccount() {
        String adminEmail = "admin@shopease.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("ShopEase Administrator");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            log.info("Initialized default development administrator: {} (password: admin123)", adminEmail);
        }
    }

    /**
     * Development-only method to initialize a sample customer account.
     */
    private void initCustomerAccount() {
        String customerEmail = "customer@shopease.com";
        if (!userRepository.existsByEmail(customerEmail)) {
            User customer = new User();
            customer.setName("John Customer");
            customer.setEmail(customerEmail);
            customer.setPasswordHash(passwordEncoder.encode("customer123"));
            customer.setRole("ROLE_CUSTOMER");
            userRepository.save(customer);
            log.info("Initialized default development customer: {} (password: customer123)", customerEmail);
        }
    }

    private void initSampleData() {
        if (!categoryRepository.existsByName("Electronics")) {
            Category electronics = categoryRepository.save(new Category(null, "Electronics", "Devices, gadgets, and consumer electronics"));
            Category accessories = categoryRepository.save(new Category(null, "Accessories", "Wearables, bags, and daily essentials"));
            Category home = categoryRepository.save(new Category(null, "Home & Living", "Modern furniture, lighting, and kitchenware"));

            productRepository.save(new Product(
                        null,
                        "Wireless Noise-Canceling Headphones",
                        "Experience high-fidelity audio with industry-leading active noise cancellation and 30-hour battery life.",
                        199.99,
                        electronics,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                        45,
                        4.8,
                        124
                ));
                productRepository.save(new Product(
                        null,
                        "Minimalist Mechanical Keyboard",
                        "Tenkeyless mechanical keyboard featuring tactile brown switches and warm white LED backlighting.",
                        89.99,
                        electronics,
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
                        30,
                        4.7,
                        89
                ));
                productRepository.save(new Product(
                        null,
                        "Ergonomic Ceramic Coffee Mug",
                        "Artisan crafted ceramic coffee mug with matte blue finish and comfortable wide grip handle.",
                        24.50,
                        home,
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
                        60,
                        4.9,
                        210
                ));
                productRepository.save(new Product(
                        null,
                        "Premium Leather Cardholder",
                        "Slim full-grain leather wallet with RFID-blocking sleeves and quick-access thumb slot.",
                        39.00,
                        accessories,
                        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
                        50,
                        4.6,
                        75
                ));
                log.info("Initialized default sample categories and products");
        }
    }
}
