import os
from typing import Optional

import httpx
from errors import (
    ApiBaseError,
    ApiConnectionError,
    CourseNotFound,
    InvalidIDError,
    NotFoundError,
    StudentNotFound,
    SubjectNotFound,
    ValidationError,
    _check_generic_errors,
)

BASE = os.getenv("API_BASE_URL", "http://localhost:3333/api")


async def _request(method: str, endpoint: str, data: dict = None) -> httpx.Response:
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            return await c.request(method, f"{BASE}{endpoint}", json=data)
    except httpx.RequestError:
        raise ApiConnectionError("Falha ao conectar com o servidor da API.")


async def get_report(student_id: str):
    r = await _request("GET", f"/students/{student_id}/report")

    if r.status_code == 404:
        raise StudentNotFound(f"Aluno {student_id} não encontrado")

    _check_generic_errors(r)

    return r.json()


async def update_progress(
    student_id: str, subject_id: str, status: str, grade: Optional[int] = None
):
    status_map = {
        "PENDENTE": "PENDING",
        "CURSANDO": "IN_PROGRESS",
        "APROVADO": "APPROVED",
        "REPROVADO": "FAILED",
    }

    if status == "APROVADO":
        payload = {
            "subjectId": subject_id,
            "status": status_map[status],
            "grade": grade,
        }
    else:
        payload = {
            "subjectId": subject_id,
            "status": status_map[status],
        }

    r = await _request("PATCH", f"/students/{student_id}/progress", data=payload)

    if r.status_code == 404:
        try:
            msg = r.json().get("message", "").lower()
        except:
            msg = r.text.lower()

        if "student" in msg:
            raise StudentNotFound(msg)
        elif "subject" in msg:
            raise SubjectNotFound(msg)
        else:
            raise NotFoundError(msg)

    _check_generic_errors(r)

    return r.json()


async def list_subjects() -> list:
    r = await _request("GET", "/subjects")

    _check_generic_errors(r)

    return r.json()


async def list_courses():
    r = await _request("GET", "/courses")

    _check_generic_errors(r)

    return r.json()


async def list_students():
    r = await _request("GET", "/students")

    _check_generic_errors(r)

    return r.json()


async def attach_subject(course_id: str, subject_id: str, semester: str):
    payload = {
        "courseId": course_id,
        "subjectId": subject_id,
        "semester": semester,
    }
    r = await _request("PATCH", "/courses/subject/attach", data=payload)

    if r.status_code == 404:
        try:
            msg = r.json().get("message", "").lower()
        except:
            msg = r.text.lower()

        if "course" in msg:
            raise CourseNotFound(msg)
        elif "subject" in msg:
            raise SubjectNotFound(msg)
        else:
            raise NotFoundError(msg)

    if r.status_code == 409:
        raise ValidationError("A matéria já está cadastrada no curso.")

    _check_generic_errors(r)

    if r.status_code == 204:
        return None

    return r.json()


async def create_course(name: str, total_hours: int):
    payload = {
        "name": name,
        "totalHours": total_hours,
    }
    r = await _request("POST", "/courses", data=payload)

    if r.status_code == 409:
        raise ValidationError("Um curso com esse nome já existe.")

    _check_generic_errors(r)

    if r.status_code == 204:
        return None

    return r.json()


async def create_student(name: str, email: str, course_id: str):
    payload = {"name": name, "email": email, "courseId": course_id}
    r = await _request("POST", "/students", data=payload)

    if r.status_code == 404:
        try:
            msg = r.json().get("message", "").lower()
        except:
            msg = r.text.lower()

        if "course" in msg:
            raise CourseNotFound(msg)
        else:
            raise NotFoundError(msg)

    if r.status_code == 409:
        raise ValidationError("Um estudante com esse email já foi cadastrado.")

    _check_generic_errors(r)

    if r.status_code == 204:
        return None

    return r.json()


async def create_subject(code: str, name: str, hours: int, category: str):
    cat_map = {
        "OBRIGATORIA": "MANDATORY",
        "OPTATIVA": "OPTIONAL",
        "COMPLEMENTAR": "COMPLEMENTARY",
    }
    payload = {
        "code": code,
        "name": name,
        "hours": hours,
        "category": cat_map[category],
    }
    r = await _request("POST", "/subjects", data=payload)

    if r.status_code == 409:
        raise ValidationError("Uma matéria com esse código já foi cadastrada.")

    _check_generic_errors(r)

    if r.status_code == 204:
        return None

    return r.json()
