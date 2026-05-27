package com.yuwenl.personalwebsite.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Swagger3Config {

    @Bean
    public OpenAPI openApiInformation() {

        Server productionServer = new Server()
                .url("https://www.meetyuwen.com/springapp")
                .description("Production Server URL");

        Server localServer = new Server()
                .url("http://localhost:9090")
                .description("Localhost Server URL");

        Contact contact = new Contact()
                .email("luyuwen2000@gmail.com")
                .name("Yuwen Lu");

        Info info = new Info()
                .title("Personal Website API Documentation")
                .version("V1.0.0")
                .description("This API provides functionalities for managing various aspects of the personal website, including but not limited to notes, user management, and other related services. It allows for CRUD operations, file uploads, and other interactions.")
                .contact(contact)
                .license(new License().name("Apache 2.0").url("http://springdoc.org"));

        return new OpenAPI()
                .info(info)
                .addServersItem(productionServer)
                .addServersItem(localServer);
    }
}
