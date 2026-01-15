package com.workflow.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "workflow_clients")
public class Client extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "client_code", unique = true, length = 5)
    private String clientCode;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "industry")
    private String industry;

    @Column(name = "company_size")
    private String companySize;

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    @Column(name = "time_zone")
    private String timeZone;

    @Column(name = "locale")
    private String locale;

    @Column(name = "max_users")
    private Integer maxUsers;

    @Column(name = "max_workflows")
    private Integer maxWorkflows;

    @Column(name = "billing_contact_email")
    private String billingContactEmail;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;
}
