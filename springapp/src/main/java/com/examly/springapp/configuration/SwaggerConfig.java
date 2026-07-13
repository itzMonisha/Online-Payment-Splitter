package com.examly.springapp.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI customOpenAPI() {

                return new OpenAPI()

                                .info(

                                                new Info()

                                                                .title("Online Payment Splitter API")

                                                                .version("1.0")

                                                                .description("REST APIs for Online Payment Splitter Application")

                                                                .contact(new Contact()

                                                                                .name("Monisha")

                                                                                .email("monishamp15@gmail.com"))

                                                                .license(new License()

                                                                                .name("Apache 2.0")

                                                                                .url("https://www.apache.org/licenses/LICENSE-2.0"))

                                );

        }

}