# Data Flow Diagrams (DFD)

## DFD Level 0 (Context Diagram)

```mermaid
flowchart TD
    S[Student] -->|"Credentials, Enrollments, Progress, Submissions"| SYS["Jaya Akademisi System (LMS)"]
    L[Lecturer] -->|"Course Content, Modules, Assignments, Grades"| SYS
    A[Admin] -->|"User Controls, Category Master Data"| SYS

    SYS -->|"Course Materials, Progress Analytics, Grade Feedback"| S
    SYS -->|"Student Submissions, Enrolled Lists, Roster Data"| L
    SYS -->|"System Metrics, Platform Overview, User Directory"| A
```

## DFD Level 1 (Decomposition)

```mermaid
flowchart TD
    subgraph Processes
        P1["1.0 Authentication & User Session"]
        P2["2.0 Course & Curriculum Management"]
        P3["3.0 Enrollment & Learning Execution"]
        P4["4.0 Assessment & Grading Engine"]
        P5["5.0 Administration & Analytics"]
    end

    subgraph DataStores[Database Storage]
        DS1[("D1 Users")]
        DS2[("D2 Courses & Modules")]
        DS3[("D3 Enrollments & Progress")]
        DS4[("D4 Assignments & Submissions")]
        DS5[("D5 Categories")]
    end

    P1 <--> DS1
    P2 <--> DS2
    P2 <--> DS5
    P3 <--> DS3
    P3 <--> DS2
    P4 <--> DS4
    P5 <--> DS1
    P5 <--> DS2
    P5 <--> DS3
```
