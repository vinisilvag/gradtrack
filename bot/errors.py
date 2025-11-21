import httpx


class ApiBaseError(Exception):
    pass


class ApiConnectionError(ApiBaseError):
    pass


class ValidationError(ApiBaseError):
    pass


class InvalidIDError(ValidationError):
    pass


class NotFoundError(ApiBaseError):
    pass


class StudentNotFound(NotFoundError):
    pass


class CourseNotFound(NotFoundError):
    pass


class SubjectNotFound(NotFoundError):
    pass


def _check_generic_errors(r: httpx.Response):
    """
    Valida erros comuns (400, 500) que funcionam igual para todos endpoints.
    """
    if r.status_code == 400:
        try:
            err_json = r.json()
            if "uuid" in str(err_json).lower():
                raise InvalidIDError("Formato de ID incorreto.")
            msg = err_json.get("message", "Dados enviados inválidos.")
            raise ValidationError(msg)
        except ValueError:
            raise ValidationError("Requisição inválida (400).")

    # Se for qualquer outro erro (500, 401, 403), estoura genérico
    try:
        r.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise ApiBaseError(f"Erro HTTP: {e.response.status_code} - {e.response.text}")

