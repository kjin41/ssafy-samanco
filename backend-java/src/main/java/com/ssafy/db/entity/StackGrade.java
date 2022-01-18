package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
@Getter @Setter
@NoArgsConstructor
public class StackGrade extends BaseEntity{

    @Column(name="HTML")
    private int html;

    @Column(name="CSS")
    private int css;

    @Column(name="JavaScript")
    private int js;

    @Column(name="VueJS")
    private int vuejs;

    @Column(name="React")
    private int react;

    @Column(name="Angular")
    private int angular;

    @Column(name="Python")
    private int python;

    @Column(name="Java")
    private int java;

    @Column(name="C")
    private int c;

    @Column(name="Spring_boot")
    private int springBoot;

    @Column(name="MySQL")
    private int mysql;

    @Column(name="Git")
    private int git;

    @Column(name="AWS")
    private int aws;

    @Column(name="Docker")
    private int docker;

    @Column(name="Linux")
    private int linux;

    @Column(name="Jira")
    private int jira;

    @Column(name="Django")
    private int django;

    @Column(name="Redis")
    private int redis;

    @OneToOne(mappedBy = "stackGrade")
    private Club club;
}
