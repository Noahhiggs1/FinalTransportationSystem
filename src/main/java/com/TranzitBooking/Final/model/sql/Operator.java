package com.TranzitBooking.Final.model.sql;

import jakarta.persistence.*;

@Entity
@Table(name = "operator")
public class Operator {
    @Id
    private String licenseNumber;
    private String vehicleType;

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
}
