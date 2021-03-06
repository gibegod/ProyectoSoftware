package com.unla.deporteonline.entities;
import javax.persistence.*;

@Entity
@Table(name="role")
public class Role  {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;

    @Column(name= "name", nullable = false)
    private String name;

    public Role() {}

    public Role(int id, String name) {
        this.setId(id);
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}