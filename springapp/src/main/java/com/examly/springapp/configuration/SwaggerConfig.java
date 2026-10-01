package com.examly.springapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI customOpenAPI() {

                final String securitySchemeName = "Bearer Authentication";

                return new OpenAPI()

                                .info(
                                                new Info()

                                                                .title("Online Payment Splitter API")

                                                                .version("1.0")

                                                                .description("REST APIs for Online Payment Splitter Application")

                                                                .contact(
                                                                                new Contact()
                                                                                                .name("Monisha")
                                                                                                .email("monishamp15@gmail.com"))

                                                                .license(
                                                                                new License()
                                                                                                .name("Apache 2.0")
                                                                                                .url("https://www.apache.org/licenses/LICENSE-2.0")))

                                // Enables Authorize button
                                .addSecurityItem(
                                                new SecurityRequirement()
                                                                .addList(securitySchemeName))

                                .components(
                                                new Components()
                                                                .addSecuritySchemes(
                                                                                securitySchemeName,

                                                                                new SecurityScheme()

                                                                                                .name("Authorization")

                                                                                                .type(SecurityScheme.Type.HTTP)

                                                                                                .scheme("bearer")

                                                                                                .bearerFormat("JWT")

                                                                                                .in(SecurityScheme.In.HEADER)

                                                                ));

        }

}