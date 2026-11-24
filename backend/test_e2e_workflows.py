import os
import sys
from app import create_app
from app.models import (
    db, User, Category, Course, CourseModule, Lesson,
    Enrollment, LessonProgress, Assignment, AssignmentSubmission
)

def run_e2e_tests():
    print("==================================================")
    print("STARTING COMPLETE E2E WORKFLOW VALIDATION")
    print("==================================================")

    app = create_app()
    client = app.test_client()

    # Step 1: Login Admin
    print("\n[Step 1] Admin Authentication")
    res_admin = client.post("/api/auth/login", json={
        "email": "admin@jayaakademisi.local",
        "password": "Admin123!"
    })
    assert res_admin.status_code == 200, f"Admin login failed: {res_admin.data}"
    admin_token = res_admin.get_json()["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print(" -> Admin authenticated successfully.")

    # Step 2: Admin Dashboard & Management
    print("\n[Step 2] Admin Stats & Category Creation")
    res_stats = client.get("/api/dashboard/stats", headers=admin_headers)
    assert res_stats.status_code == 200
    stats = res_stats.get_json()["stats"]
    assert stats["total_students"] >= 2
    assert stats["total_lecturers"] >= 2
    assert stats["total_courses"] >= 3
    print(f" -> Verified platform stats: {stats}")

    res_new_cat = client.post("/api/admin/categories", headers=admin_headers, json={
        "name": "Cybersecurity & Infrastructure",
        "description": "Network defenses, cryptography, and server hardening."
    })
    assert res_new_cat.status_code == 201, f"Failed to create category: {res_new_cat.data}"
    cyber_cat_id = res_new_cat.get_json()["category"]["id"]
    print(f" -> Created new category 'Cybersecurity & Infrastructure' (ID: {cyber_cat_id}).")

    # Step 3: Lecturer Authentication & Course Creation
    print("\n[Step 3] Lecturer Course & Curriculum Creation")
    res_lec = client.post("/api/auth/login", json={
        "email": "lecturer@jayaakademisi.local",
        "password": "Lecturer123!"
    })
    assert res_lec.status_code == 200
    lec_token = res_lec.get_json()["token"]
    lec_headers = {"Authorization": f"Bearer {lec_token}"}
    print(" -> Lecturer authenticated successfully.")

    res_new_course = client.post("/api/courses", headers=lec_headers, json={
        "title": "Cybersecurity Operations & Network Defense",
        "description": "Learn network vulnerability analysis, firewall orchestration, and threat hunting.",
        "objectives": "Master penetration testing methodology; Configure iptables; Detect anomalies with Wireshark.",
        "category_id": cyber_cat_id,
        "level": "Intermediate",
        "is_published": True
    })
    assert res_new_course.status_code == 201, f"Failed to create course: {res_new_course.data}"
    course_id = res_new_course.get_json()["course"]["id"]
    print(f" -> Course created: ID {course_id}")

    # Add Module
    res_mod = client.post(f"/api/courses/{course_id}/modules", headers=lec_headers, json={
        "title": "Module 1: Threat Vectors & Reconnaissance"
    })
    assert res_mod.status_code == 201
    mod_id = res_mod.get_json()["module"]["id"]
    print(f" -> Module created: ID {mod_id}")

    # Add Lesson 1
    res_les1 = client.post(f"/api/modules/{mod_id}/lessons", headers=lec_headers, json={
        "title": "Lesson 1.1: Passive & Active Reconnaissance",
        "content": "Reconnaissance is the preparatory phase where an attacker seeks information about a target network before launching attacks.",
        "video_url": "https://www.youtube.com/embed/3Kq1MIfTWCE",
        "resource_url": "https://www.wireshark.org/docs/",
        "duration_minutes": 25
    })
    assert res_les1.status_code == 201
    les1_id = res_les1.get_json()["lesson"]["id"]

    # Add Lesson 2
    res_les2 = client.post(f"/api/modules/{mod_id}/lessons", headers=lec_headers, json={
        "title": "Lesson 1.2: Port Scanning with Nmap",
        "content": "Nmap scanning principles: SYN stealth scan (-sS), TCP connect scan (-sT), and service detection (-sV).",
        "video_url": "https://www.youtube.com/embed/4t4kBkMsDbY",
        "duration_minutes": 30
    })
    assert res_les2.status_code == 201
    les2_id = res_les2.get_json()["lesson"]["id"]
    print(f" -> Added Lessons (IDs: {les1_id}, {les2_id})")

    # Add Assignment
    res_assign = client.post(f"/api/courses/{course_id}/assignments", headers=lec_headers, json={
        "title": "Practical Lab: Port Scan Report",
        "description": "Scan a local test service and write an executive summary of open ports and security implications.",
        "max_score": 100
    })
    assert res_assign.status_code == 201
    assign_id = res_assign.get_json()["assignment"]["id"]
    print(f" -> Created Assignment: ID {assign_id}")

    # Step 4: Student Authentication, Course Browsing & Enrollment
    print("\n[Step 4] Student Course Discovery & Enrollment")
    res_stu = client.post("/api/auth/login", json={
        "email": "student@jayaakademisi.local",
        "password": "Student123!"
    })
    assert res_stu.status_code == 200
    stu_token = res_stu.get_json()["token"]
    stu_headers = {"Authorization": f"Bearer {stu_token}"}
    print(" -> Student authenticated successfully.")

    # Browse courses
    res_browse = client.get(f"/api/courses?category_id={cyber_cat_id}")
    assert res_browse.status_code == 200
    cyber_courses = res_browse.get_json()
    assert any(c["id"] == course_id for c in cyber_courses)
    print(" -> Verified course appears in catalog.")

    # Enroll
    res_enroll = client.post(f"/api/courses/{course_id}/enroll", headers=stu_headers)
    assert res_enroll.status_code in [200, 201]
    print(f" -> Student enrolled in Course {course_id}.")

    # Duplicate enroll test
    res_dup = client.post(f"/api/courses/{course_id}/enroll", headers=stu_headers)
    assert res_dup.status_code == 200
    print(" -> Duplicate enrollment prevention verified.")

    # Step 5: Student Learning, Lesson Completion & Progress Calculation
    print("\n[Step 5] Lesson Progression & Dynamic Tracking")
    # Mark Lesson 1 complete
    res_prog1 = client.post(f"/api/lessons/{les1_id}/toggle-complete", headers=stu_headers)
    assert res_prog1.status_code == 200
    assert res_prog1.get_json()["is_completed"] == True
    # Course has 2 lessons, so 1 completed = 50.0%
    assert res_prog1.get_json()["course_progress"]["percentage"] == 50.0
    print(" -> Lesson 1 completed. Progress: 50.0%")

    # Mark Lesson 2 complete
    res_prog2 = client.post(f"/api/lessons/{les2_id}/toggle-complete", headers=stu_headers)
    assert res_prog2.status_code == 200
    assert res_prog2.get_json()["is_completed"] == True
    assert res_prog2.get_json()["course_progress"]["percentage"] == 100.0
    print(" -> Lesson 2 completed. Progress: 100.0%")

    # Step 6: Assignment Submission
    print("\n[Step 6] Assignment Submission")
    res_sub = client.post(f"/api/assignments/{assign_id}/submit", headers=stu_headers, json={
        "submission_text": "### Port Scan Lab Findings\n- Open Ports: 22/tcp (SSH), 80/tcp (HTTP), 443/tcp (HTTPS).\n- Recommended mitigation: Disable password SSH login, use public-key cryptography, enforce HTTPS redirection."
    })
    assert res_sub.status_code == 200, f"Submission failed: {res_sub.data}"
    sub_id = res_sub.get_json()["submission"]["id"]
    print(f" -> Assignment submission recorded (ID: {sub_id}).")

    # Step 7: Lecturer Evaluation & Grading
    print("\n[Step 7] Lecturer Evaluation & Score Assignment")
    res_grade = client.put(f"/api/submissions/{sub_id}/grade", headers=lec_headers, json={
        "score": 98.0,
        "feedback": "Outstanding reconnaissance analysis and robust mitigation recommendations. High academic quality!"
    })
    assert res_grade.status_code == 200, f"Grading failed: {res_grade.data}"
    graded_data = res_grade.get_json()["submission"]
    assert graded_data["score"] == 98.0
    assert graded_data["is_graded"] == True
    print(f" -> Graded submission with score: {graded_data['score']} pts.")

    # Step 8: Student Checks Grades
    print("\n[Step 8] Student Gradebook Verification")
    res_grades = client.get("/api/student/grades", headers=stu_headers)
    assert res_grades.status_code == 200
    my_grades = res_grades.get_json()["submissions"]
    assert any(g["id"] == sub_id and g["score"] == 98.0 for g in my_grades)
    print(" -> Student grade verified in gradebook.")

    # Step 9: Database Persistence Verification Across New Application Session
    print("\n[Step 9] Simulating Application Restart & Verifying SQLite Persistence")
    # Create entirely fresh app instance simulating restart
    restarted_app = create_app()
    with restarted_app.app_context():
        persisted_course = Course.query.get(course_id)
        assert persisted_course is not None, "Course did not persist in SQLite!"
        assert persisted_course.title == "Cybersecurity Operations & Network Defense"

        persisted_modules = CourseModule.query.filter_by(course_id=course_id).all()
        assert len(persisted_modules) == 1
        assert len(persisted_modules[0].lessons) == 2

        persisted_enrollment = Enrollment.query.filter_by(course_id=course_id).first()
        assert persisted_enrollment is not None, "Enrollment did not persist in SQLite!"

        persisted_sub = AssignmentSubmission.query.get(sub_id)
        assert persisted_sub is not None, "Submission did not persist in SQLite!"
        assert persisted_sub.score == 98.0
        assert "Outstanding" in persisted_sub.feedback

        persisted_progress = LessonProgress.query.filter_by(lesson_id=les1_id).first()
        assert persisted_progress is not None and persisted_progress.is_completed == True
        print(" -> ALL DATA PERSISTS IN SQLITE AFTER RESTARTING APPLICATION!")

    print("\n==================================================")
    print("ALL END-TO-END WORKFLOW TESTS COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_e2e_tests()
