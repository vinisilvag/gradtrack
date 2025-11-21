import os, httpx
from errors import (
    ApiBaseError, ApiConnectionError, ValidationError, InvalidIDError,
    NotFoundError, StudentNotFound, CourseNotFound, SubjectNotFound, _check_generic_errors
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

async def get_progress(student_id: str):
    r = await _request("GET", f"/students/{student_id}/progress")

    if r.status_code == 404:
        raise StudentNotFound(f"Aluno {student_id} não encontrado")

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
        raise ValidationError("A matéria já está cadastrada no curso")

    _check_generic_errors(r)

    if r.status_code == 204:
        return None

    return r.json()

