import json
from app import create_app

def test_all_apis():
    app = create_app()
    client = app.test_client()

    print("Testing 1: Health check...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.data}"
    print("Health check OK!")

    print("Testing 2: Login as Admin, Lecturer, Student...")
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@jayaakademisi.local",
        "password": "Admin123!"
    })
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.data}"
    admin_token = admin_login.get_json()["token"]

    lecturer_login = client.post("/api/auth/login", json={
        "email": "lecturer@jayaakademisi.local",
        "password": "Lecturer123!"
    })
    assert lecturer_login.status_code == 200, f"Lecturer login failed: {lecturer_login.data}"
    lecturer_token = lecturer_login.get_json()["token"]

    student_login = client.post("/api/auth/login", json={
        "email": "student@jayaakademisi.local",
        "password": "Student123!"
    })
    assert student_login.status_code == 200, f"Student login failed: {student_login.data}"
    student_token = student_login.get_json()["token"]
    print("Logins OK!")

    print("Testing 3: List courses & categories...")
    courses_res = client.get("/api/courses")
    assert courses_res.status_code == 200
    courses = courses_res.get_json()
    assert len(courses) >= 3, f"Expected at least 3 courses, got {len(courses)}"

    cats_res = client.get("/api/courses/categories")
    assert cats_res.status_code == 200
    assert len(cats_res.get_json()) >= 3
    print("Courses & Categories OK!")

    print("Testing 4: Course details with token...")
    course_detail = client.get(f"/api/courses/{courses[0]['id']}", headers={"Authorization": f"Bearer {student_token}"})
    assert course_detail.status_code == 200
    detail_data = course_detail.get_json()
    assert "modules" in detail_data
    assert "progress_percentage" in detail_data
    print("Course detail OK!")

    print("Testing 5: Dashboard statistics...")
    admin_dash = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_dash.status_code == 200
    assert admin_dash.get_json()["stats"]["total_courses"] >= 3

    lecturer_dash = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {lecturer_token}"})
    assert lecturer_dash.status_code == 200
    assert lecturer_dash.get_json()["role"] == "lecturer"

    student_dash = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {student_token}"})
    assert student_dash.status_code == 200
    assert student_dash.get_json()["role"] == "student"
    print("Dashboards OK!")

    print("Testing 6: Lesson progress toggle...")
    first_lesson_id = detail_data["modules"][0]["lessons"][0]["id"]
    prog_res = client.post(f"/api/lessons/{first_lesson_id}/toggle-complete", headers={"Authorization": f"Bearer {student_token}"})
    assert prog_res.status_code == 200
    print("Progress toggle OK!")

    print("Testing 7: Student grades and submissions...")
    grades_res = client.get("/api/student/grades", headers={"Authorization": f"Bearer {student_token}"})
    assert grades_res.status_code == 200
    print("Student grades OK!")

    print("ALL API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all_apis()
