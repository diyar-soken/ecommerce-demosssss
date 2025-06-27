package it.diyar.ecommercedemos.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigration implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Verifica se le colonne esistono già
            addColumnIfNotExists("shipping_full_name", "VARCHAR(255)");
            addColumnIfNotExists("shipping_address_line1", "VARCHAR(255)");
            addColumnIfNotExists("shipping_address_line2", "VARCHAR(255)");
            addColumnIfNotExists("shipping_city", "VARCHAR(100)");
            addColumnIfNotExists("shipping_postal_code", "VARCHAR(10)");
            addColumnIfNotExists("shipping_province", "VARCHAR(100)");
            addColumnIfNotExists("shipping_country", "VARCHAR(100)");
            addColumnIfNotExists("shipping_phone_number", "VARCHAR(20)");
            
            System.out.println("Database migration completed successfully!");
        } catch (Exception e) {
            System.err.println("Error during database migration: " + e.getMessage());
        }
    }

    private void addColumnIfNotExists(String columnName, String columnType) {
        try {
            // Verifica se la colonna esiste
            String checkColumnSql = "SELECT COUNT(*) FROM information_schema.columns " +
                    "WHERE table_schema = DATABASE() AND table_name = 'orders' AND column_name = ?";
            
            Integer count = jdbcTemplate.queryForObject(checkColumnSql, Integer.class, columnName);
            
            if (count == 0) {
                // La colonna non esiste, aggiungila
                String alterTableSql = "ALTER TABLE orders ADD COLUMN " + columnName + " " + columnType;
                jdbcTemplate.execute(alterTableSql);
                System.out.println("Added column: " + columnName);
            } else {
                System.out.println("Column already exists: " + columnName);
            }
        } catch (Exception e) {
            System.err.println("Error adding column " + columnName + ": " + e.getMessage());
        }
    }
}