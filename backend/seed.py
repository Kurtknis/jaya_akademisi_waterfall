import os
from datetime import datetime, timedelta
from app import create_app
from app.models import (
    db, User, Category, Course, CourseModule, Lesson,
    Enrollment, LessonProgress, Assignment, AssignmentSubmission
)

app = create_app()

def seed_database():
    with app.app_context():
        print("Initializing tables and clearing previous seed data if any...")
        db.drop_all()
        db.create_all()

        print("Seeding Users...")
        # 1. Admin
        admin = User(
            name="Administrator Jaya",
            email="admin@jayaakademisi.local",
            role="admin",
            bio="Lead Academic Systems Administrator at Universitas Pembangunan Jaya.",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
        )
        admin.set_password("Admin123!")

        # 2. Lecturer 1
        lecturer1 = User(
            name="Dr. Ir. Hendra Saputra, M.Kom.",
            email="lecturer@jayaakademisi.local",
            role="lecturer",
            bio="Senior Lecturer in Computer Science, specializing in Distributed Systems and Software Architecture.",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
        )
        lecturer1.set_password("Lecturer123!")

        # 3. Lecturer 2
        lecturer2 = User(
            name="Siti Rahmawati, S.E., M.M.",
            email="siti.rahmawati@jayaakademisi.local",
            role="lecturer",
            bio="Lecturer in Digital Business and Marketing Management at UPJ.",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
        )
        lecturer2.set_password("Lecturer123!")

        # 4. Student 1
        student1 = User(
            name="Budi Pratama",
            email="student@jayaakademisi.local",
            role="student",
            bio="Informatics Engineering undergraduate student at UPJ, passionate about Web Development.",
            avatar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
        )
        student1.set_password("Student123!")

        # 5. Student 2
        student2 = User(
            name="Anisa Putri",
            email="anisa.putri@jayaakademisi.local",
            role="student",
            bio="Visual Communication Design student exploring UI/UX and digital interaction.",
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
        )
        student2.set_password("Student123!")

        db.session.add_all([admin, lecturer1, lecturer2, student1, student2])
        db.session.commit()

        print("Seeding Categories...")
        cat_cs = Category(
            name="Computer Science & IT",
            slug="computer-science-it",
            description="Explore software engineering, databases, web development, and cloud systems."
        )
        cat_bus = Category(
            name="Business & Management",
            slug="business-management",
            description="Learn entrepreneurial strategy, financial analysis, leadership, and digital operations."
        )
        cat_des = Category(
            name="Design & Creative Media",
            slug="design-creative-media",
            description="Master visual communication, UI/UX prototyping, motion graphics, and user research."
        )

        db.session.add_all([cat_cs, cat_bus, cat_des])
        db.session.commit()

        print("Seeding Courses, Modules, Lessons, and Assignments...")
        # Course 1: Full-Stack Web Architecture
        c1 = Course(
            title="Full-Stack Web Architecture with React & Flask",
            slug="full-stack-web-architecture-react-flask",
            description="Comprehensive guide to architecting modern web platforms. Learn REST APIs with Python Flask, responsive user interfaces with React and Tailwind CSS, and database relational integrity with SQLite.",
            objectives="Understand client-server architecture; Build robust RESTful APIs with Flask and SQLAlchemy; Create modular React frontend applications; Implement secure token-based authentication and role-based access control.",
            category_id=cat_cs.id,
            instructor_id=lecturer1.id,
            image_url="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
            level="Intermediate",
            is_published=True
        )
        db.session.add(c1)
        db.session.commit()

        # Modules for Course 1
        m1_1 = CourseModule(course_id=c1.id, title="Module 1: REST API Fundamentals & Flask Setup", order_index=1)
        m1_2 = CourseModule(course_id=c1.id, title="Module 2: Relational Databases with SQLAlchemy & SQLite", order_index=2)
        db.session.add_all([m1_1, m1_2])
        db.session.commit()

        # Lessons for Module 1_1
        l1_1_1 = Lesson(
            module_id=m1_1.id,
            title="Lesson 1.1: Introduction to RESTful Design Principles",
            content="### REST Architectural Constraints\n\nREST (Representational State Transfer) is a set of architectural principles for networked applications. Key constraints include:\n\n1. **Client-Server Architecture**: Separation of concerns between user interface and data storage.\n2. **Statelessness**: Each request from client to server contains all information necessary to understand and process the request.\n3. **Cacheability**: Responses explicitly declare whether they are cacheable.\n4. **Uniform Interface**: Resource identification in requests, manipulation of resources through representations, self-descriptive messages, and hypermedia as the engine of application state (HATEOAS).",
            video_url="https://www.youtube.com/embed/lsMQRaeKNDk",
            resource_url="https://restfulapi.net/",
            duration_minutes=15,
            order_index=1
        )
        l1_1_2 = Lesson(
            module_id=m1_1.id,
            title="Lesson 1.2: Flask Application Factory Pattern & Blueprints",
            content="### The Application Factory Pattern\n\nUsing an application factory function (typically named `create_app`) allows multiple instances of the Flask application with varying configurations (such as testing and production).\n\n```python\ndef create_app(config_name):\n    app = Flask(__name__)\n    app.config.from_object(config[config_name])\n    db.init_app(app)\n    # register blueprints\n    return app\n```\n\nBlueprints organize related endpoints into cohesive modules.",
            video_url="https://www.youtube.com/embed/mqhxxeeTbu0",
            resource_url="https://flask.palletsprojects.com/en/3.0.x/patterns/appfactories/",
            duration_minutes=20,
            order_index=2
        )

        # Lessons for Module 1_2
        l1_2_1 = Lesson(
            module_id=m1_2.id,
            title="Lesson 2.1: Designing Normalized Relational Schemas",
            content="### Database Normalization\n\nDatabase normalization organizes database fields and tables to minimize redundancy and dependency:\n\n- **1NF**: Atomic column values and unique primary keys.\n- **2NF**: All non-key attributes fully functionally dependent on the primary key.\n- **3NF**: No transitive dependencies between non-prime attributes.",
            video_url="https://www.youtube.com/embed/UrYLYV7WSHM",
            resource_url="https://en.wikipedia.org/wiki/Database_normalization",
            duration_minutes=18,
            order_index=1
        )
        l1_2_2 = Lesson(
            module_id=m1_2.id,
            title="Lesson 2.2: Enforcing Foreign Keys in SQLite with SQLAlchemy",
            content="### SQLite Foreign Key Pragmas\n\nBy default in SQLite, foreign key constraints are not enforced unless explicitly enabled per connection:\n\n```python\n@event.listens_for(Engine, 'connect')\ndef set_sqlite_pragma(dbapi_connection, connection_record):\n    cursor = dbapi_connection.cursor()\n    cursor.execute('PRAGMA foreign_keys=ON')\n    cursor.close()\n```",
            video_url="https://www.youtube.com/embed/5U2zB8qV64Y",
            resource_url="https://sqlite.org/foreignkeys.html",
            duration_minutes=12,
            order_index=2
        )
        db.session.add_all([l1_1_1, l1_1_2, l1_2_1, l1_2_2])
        db.session.commit()

        # Assignment for Course 1
        a1 = Assignment(
            course_id=c1.id,
            title="Assignment 1: REST API Schema Design Specification",
            description="Submit a short technical specification detailing the endpoints, request/response models, and status codes for a university course enrollment system.",
            max_score=100,
            due_date=datetime.utcnow() + timedelta(days=7)
        )
        db.session.add(a1)
        db.session.commit()

        # Course 2: Digital Business Strategy & Product Management
        c2 = Course(
            title="Digital Business Strategy & Product Management",
            slug="digital-business-strategy-product-management",
            description="Examine digital transformation frameworks, user acquisition economics, customer lifetime value (CLV), and Agile roadmap execution for modern tech enterprises.",
            objectives="Analyze digital business models; Formulate lean canvas and value propositions; Execute agile product release cycles; Measure product-market fit using analytics.",
            category_id=cat_bus.id,
            instructor_id=lecturer2.id,
            image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
            level="Beginner",
            is_published=True
        )
        db.session.add(c2)
        db.session.commit()

        m2_1 = CourseModule(course_id=c2.id, title="Module 1: Market Analysis & Customer Discovery", order_index=1)
        m2_2 = CourseModule(course_id=c2.id, title="Module 2: Agile Product Roadmaps & Metrics", order_index=2)
        db.session.add_all([m2_1, m2_2])
        db.session.commit()

        l2_1_1 = Lesson(
            module_id=m2_1.id,
            title="Lesson 1.1: The Lean Startup Methodology",
            content="### Build - Measure - Learn Feedback Loop\n\nThe fundamental premise of the Lean Startup is accelerating the cycle time through the Build-Measure-Learn loop. Validate assumptions early using Minimum Viable Products (MVPs).",
            video_url="https://www.youtube.com/embed/fEvMoMw0HgQ",
            resource_url="https://theleanstartup.com/",
            duration_minutes=25,
            order_index=1
        )
        l2_1_2 = Lesson(
            module_id=m2_1.id,
            title="Lesson 1.2: Customer Journey Mapping",
            content="### Understanding User Touchpoints\n\nMap awareness, consideration, acquisition, retention, and referral touchpoints to identify friction and optimize retention.",
            video_url="https://www.youtube.com/embed/2q_Vp0hXU_M",
            resource_url="https://www.nngroup.com/articles/customer-journey-mapping/",
            duration_minutes=20,
            order_index=2
        )
        l2_2_1 = Lesson(
            module_id=m2_2.id,
            title="Lesson 2.1: Defining North Star Metrics & KPIs",
            content="### Key Performance Indicators\n\nA North Star Metric represents the core value delivered to customers. For educational platforms, this is active learning completion and skill acquisition.",
            video_url="https://www.youtube.com/embed/Xq4yN_u2H4A",
            resource_url="https://amplitude.com/north-star",
            duration_minutes=15,
            order_index=1
        )
        l2_2_2 = Lesson(
            module_id=m2_2.id,
            title="Lesson 2.2: Prioritization with RICE and MoSCoW Frameworks",
            content="### RICE Framework\n\nRICE Score = (Reach * Impact * Confidence) / Effort. Use this to systematically prioritize engineering and design backlogs.",
            video_url="https://www.youtube.com/embed/WJ6dGvQ0C5Y",
            resource_url="https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/",
            duration_minutes=18,
            order_index=2
        )
        db.session.add_all([l2_1_1, l2_1_2, l2_2_1, l2_2_2])
        db.session.commit()

        a2 = Assignment(
            course_id=c2.id,
            title="Assignment 2: Lean Canvas Proposal for an Educational App",
            description="Submit a 1-page Lean Canvas analyzing customer segments, unique value propositions, channels, and revenue streams for a campus service.",
            max_score=100,
            due_date=datetime.utcnow() + timedelta(days=10)
        )
        db.session.add(a2)
        db.session.commit()

        # Course 3: UI/UX Design Systems & Human-Centered Computing
        c3 = Course(
            title="UI/UX Design Systems & Human-Centered Computing",
            slug="ui-ux-design-systems-human-centered-computing",
            description="Learn how to create consistent, accessible digital product design systems. Covers atomic design, typography scales, contrast ratios, and wireframe prototyping in Figma.",
            objectives="Master design tokens and atomic component design; Understand WCAG accessibility guidelines; Conduct usability testing sessions; Build scalable design libraries.",
            category_id=cat_des.id,
            instructor_id=lecturer1.id,
            image_url="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
            level="Beginner",
            is_published=True
        )
        db.session.add(c3)
        db.session.commit()

        m3_1 = CourseModule(course_id=c3.id, title="Module 1: Atomic Design & Component Hierarchy", order_index=1)
        m3_2 = CourseModule(course_id=c3.id, title="Module 2: Accessibility & Usability Testing", order_index=2)
        db.session.add_all([m3_1, m3_2])
        db.session.commit()

        l3_1_1 = Lesson(
            module_id=m3_1.id,
            title="Lesson 1.1: Atomic Design Methodology",
            content="### Atoms, Molecules, Organisms, Templates, and Pages\n\nBrad Frost's Atomic Design methodology helps teams construct scalable, maintainable design systems from simple UI atoms (buttons, inputs) up to complete pages.",
            video_url="https://www.youtube.com/embed/Yi-A20x2dcA",
            resource_url="https://atomicdesign.bradfrost.com/",
            duration_minutes=15,
            order_index=1
        )
        l3_1_2 = Lesson(
            module_id=m3_1.id,
            title="Lesson 1.2: Design Tokens & Typography Scales",
            content="### Consistency through Design Tokens\n\nDesign tokens encapsulate visual values such as spacing, colors, font families, and radii into standardized variables.",
            video_url="https://www.youtube.com/embed/j62dYm_c-gU",
            resource_url="https://m3.material.io/foundations/design-tokens/overview",
            duration_minutes=20,
            order_index=2
        )
        l3_2_1 = Lesson(
            module_id=m3_2.id,
            title="Lesson 2.1: WCAG 2.1 AA Color Contrast & Accessibility",
            content="### Inclusive Design Standards\n\nEnsure color contrast ratios meet minimum 4.5:1 for normal text and 3:1 for large text. Provide keyboard navigation and aria labels.",
            video_url="https://www.youtube.com/embed/cOmehxAU_4s",
            resource_url="https://www.w3.org/WAI/standards-guidelines/wcag/",
            duration_minutes=15,
            order_index=1
        )
        l3_2_2 = Lesson(
            module_id=m3_2.id,
            title="Lesson 2.2: Usability Testing & Heuristic Evaluation",
            content="### Jakob Nielsen's 10 Usability Heuristics\n\nEvaluate visibility of system status, match between system and real world, user control and freedom, error prevention, and recognition over recall.",
            video_url="https://www.youtube.com/embed/p1Oq3Z21cHs",
            resource_url="https://www.nngroup.com/articles/ten-usability-heuristics/",
            duration_minutes=22,
            order_index=2
        )
        db.session.add_all([l3_1_1, l3_1_2, l3_2_1, l3_2_2])
        db.session.commit()

        print("Seeding Enrollments & Lesson Progress...")
        # Enroll Student 1 in Course 1 & Course 2
        enr1 = Enrollment(user_id=student1.id, course_id=c1.id)
        enr2 = Enrollment(user_id=student1.id, course_id=c2.id)
        # Enroll Student 2 in Course 1 & Course 3
        enr3 = Enrollment(user_id=student2.id, course_id=c1.id)
        enr4 = Enrollment(user_id=student2.id, course_id=c3.id)
        db.session.add_all([enr1, enr2, enr3, enr4])
        db.session.commit()

        # Student 1 completed Lesson 1.1 and 1.2 in Course 1
        prog1 = LessonProgress(user_id=student1.id, lesson_id=l1_1_1.id, is_completed=True)
        prog2 = LessonProgress(user_id=student1.id, lesson_id=l1_1_2.id, is_completed=True)
        # Student 1 completed Lesson 1.1 in Course 2
        prog3 = LessonProgress(user_id=student1.id, lesson_id=l2_1_1.id, is_completed=True)
        db.session.add_all([prog1, prog2, prog3])
        db.session.commit()

        print("Seeding Sample Assignment Submission & Grade...")
        sub1 = AssignmentSubmission(
            assignment_id=a1.id,
            student_id=student1.id,
            submission_text="### REST API Specification - Campus Enrollment\n\n1. `POST /api/enroll`: Accepts `course_id` and student JWT. Returns 201 Created on success.\n2. `GET /api/my-courses`: Returns list of enrolled courses with progress percentages.\n3. `DELETE /api/unenroll`: Drops course and cascades removal of session tracking.",
            score=95.0,
            feedback="Excellent REST architectural structure and proper status code documentation. Well done!",
            graded_by=lecturer1.id,
            submitted_at=datetime.utcnow() - timedelta(days=2),
            graded_at=datetime.utcnow() - timedelta(days=1)
        )
        db.session.add(sub1)
        db.session.commit()

        print("Database seed completed successfully!")
        print(f"Users created: 5 (Admin: {admin.email}, Lecturer: {lecturer1.email}, Student: {student1.email})")
        print(f"Courses created: 3, Categories: 3, Lessons: 12, Enrollments: 4, Submissions: 1")

if __name__ == "__main__":
    seed_database()
