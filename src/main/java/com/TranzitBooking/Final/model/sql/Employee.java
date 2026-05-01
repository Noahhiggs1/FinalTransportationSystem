package com.TranzitBooking.Final.model.sql;
import jakarta.persistence.*;

@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private Double salary;

    @Column(name = "hours_worked")
    private Integer hoursWorked;

    private String station;
    private String email;
    private String password;

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
    public Integer getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Integer hoursWorked) { this.hoursWorked = hoursWorked; }
    public String getStation() { return station; }
    public void setStation(String station) { this.station = station; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isAdmin() {
        return employeeId != null && employeeId == 5264L;
    }
}