package com.techie.rapid.mapper.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "rapid_mappings")
public class Mapping extends Auditable {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    @Lob // Large object to store file content
    @Column(columnDefinition = "LONGBLOB") // or BLOB depending on your database
    private byte[] schemaData; // Store the file content as a byte array

    private String schemaFileName; //store the file name

    @ManyToOne // Change to ManyToOne
    @JoinColumn(name = "request_schema_id")
    private RequestSchema requestSchema;
}
